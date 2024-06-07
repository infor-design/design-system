#!/bin/bash

# This script runs inside of a docker container on start as a
# kubernetes job. AWS permissions are controlled by a role setup 
# in kubernetes.  To run this locally, use the "make build" command
# with proper environment variables set in .env file.
set -e

export TERM=xterm
export NODE_OPTIONS=--max_old_space_size=4096

check_required_vars()
{
    var_names=("$@")
    for var_name in "${var_names[@]}"; do
        [ -z "${!var_name}" ] && echo "$var_name is unset." && var_unset=true
    done
    [ -n "$var_unset" ] && exit 1
    return 0
}

check_required_vars \
  NPM_TOKEN \
  BRANCH \
  REPO_OWNER_NAME \
  DRY_RUN

npm set "//registry.npmjs.org/:_authToken=${NPM_TOKEN}"

_RELEASE_INCREMENT=${RELEASE_INCREMENT:-}
_ROOT_DIR=/root/design-system

rm -fr $_ROOT_DIR/{..?*,.[!.]*,*} 2>/dev/null

git clone $REPO_OWNER_NAME $_ROOT_DIR
cd $_ROOT_DIR

git fetch --all
git checkout $BRANCH > /dev/null

if [ $? = 1 ] ; then
    echo "Git checkout failed. Please make sure the branch you are checking out exists."
    exit 1
fi

npm config set '//registry.npmjs.org/:_authToken' "${NPM_TOKEN}"
npm install
npm run build

if [ -z $VERSION ]
then
    VERSION=$(node -p "require('./package.json').version")
fi

git tag "${VERSION}"

# DRY_RUN is a string, true or false

if [ "$DRY_RUN" = "true" ]
then
    echo "Skipping git push and npm publish in dry run mode."
    npm publish --access public --dry-run
    exit 0
fi

git push origin "${VERSION}"
npm publish --access public

cd $_ROOT_DIR/dist && {
    aws s3 sync . s3://ids-com/docs/ids-identity/$VERSION/
    aws s3 sync . s3://ids-com-staging/docs/ids-identity/$VERSION/
}

ZIP_FILES=`find $_ROOT_DIR -iname \*.zip`

echo "Found zip files: $ZIP_FILES"

for file in $ZIP_FILES; do
    aws s3 cp "$file" "s3://infor-design-assets-downloads/archives/`basename $file`"
    echo "public link to $file: https://infor-design-assets-downloads.s3.amazonaws.com/archives/`basename $file`"
done
