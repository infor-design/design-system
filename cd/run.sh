#!/bin/bash

# This script runs inside of a docker container on start as a
# kubernetes job. AWS permissions are controlled by a role setup 
# in kubernetes.  To run this locally, use the "make build" command
# with proper environment variables set in .env file.
set -e

export TERM=xterm
export NODE_OPTIONS=--max_old_space_size=4096

_NPM_TOKEN=${NPM_TOKEN:-}
_GITHUB_ACCESS_TOKEN=${GITHUB_ACCESS_TOKEN:-}
_RELEASE_INCREMENT=${RELEASE_INCREMENT:-}
_RELEASEIT_FLAGS=${RELEASEIT_FLAGS:-}

rm -fr /root/design-system/{..?*,.[!.]*,*} 2>/dev/null

#echo "[url \"git@github.com:\"]\n\tinsteadOf = https://github.com/" >> /root/.gitconfig
#git config --global url."https://${_GITHUB_ACCESS_TOKEN}:@github.com/".insteadOf "https://github.com/"

git clone https://${_GITHUB_ACCESS_TOKEN}@github.com/infor-design/design-system.git /root/design-system
cd /root/design-system
git remote set-url origin https://${_GITHUB_ACCESS_TOKEN}@github.com/infor-design/design-system.git

npm config set '//registry.npmjs.org/:_authToken' "${_NPM_TOKEN}"
npm install
npm run build

if [ -n "$_RELEASEIT_FLAGS" ];
then
  release-it $_RELEASEIT_FLAGS --config .release-it.json --ci -- $_RELEASE_INCREMENT
fi

if [[ "$_RELEASEIT_FLAGS" == *"--dry-run=false"* ]];
then
    ZIP_FILES=`find . -iname \*.zip`

    for file in $ZIP_FILES; do
        aws s3 cp "$file" "s3://infor-design-assets-downloads/archives/`basename $file`"
    done
fi
