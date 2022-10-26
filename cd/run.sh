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
  GITHUB_ACCESS_TOKEN \
  NPM_TOKEN \
  BRANCH \
  REPO_OWNER_NAME

_RELEASE_INCREMENT=${RELEASE_INCREMENT:-}

rm -fr /root/design-system/{..?*,.[!.]*,*} 2>/dev/null

#echo "[url \"git@github.com:\"]\n\tinsteadOf = https://github.com/" >> /root/.gitconfig
#git config --global url."https://${GITHUB_ACCESS_TOKEN}:@github.com/".insteadOf "https://github.com/"

git clone https://${GITHUB_ACCESS_TOKEN}@github.com/infor-design/design-system.git /root/design-system
cd /root/design-system
git remote set-url origin https://${GITHUB_ACCESS_TOKEN}@github.com/infor-design/design-system.git

npm config set '//registry.npmjs.org/:_authToken' "${NPM_TOKEN}"
npm install
npm run build

if [ -n "$RELEASEIT_FLAGS" ];
then
  release-it $RELEASEIT_FLAGS --config .release-it.json --ci -- $_RELEASE_INCREMENT
fi

if [[ "$RELEASEIT_FLAGS" == *"--dry-run=false"* ]];
then
    ZIP_FILES=`find . -iname \*.zip`

    for file in $ZIP_FILES; do
        aws s3 cp "$file" "s3://infor-design-assets-downloads/archives/`basename $file`"
    done
fi
