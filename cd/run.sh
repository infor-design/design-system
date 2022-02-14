#!/bin/bash

# This script runs inside of a docker container on start as a
# kubernetes job. AWS permissions are controlled by a role setup 
# in kubernetes.  To run this locally, use the "make build" command
# with proper environment variables set in .env file.

export TERM=xterm

_NPM_TOKEN=${NPM_TOKEN:-}
_GITHUB_ACCESS_TOKEN=${GITHUB_ACCESS_TOKEN:-}
_RELEASE_INCREMENT=${RELEASE_INCREMENT:-}
_FLAGS=${FLAGS:-}

git clone https://corpulent:${_GITHUB_ACCESS_TOKEN}@github.com/infor-design/design-system.git /root/design-system
cd /root/design-system
git remote set-url origin https://corpulent:${_GITHUB_ACCESS_TOKEN}@github.com/infor-design/design-system.git
git config --global user.email "artemgolub@gmail.com"
git config --global user.name "corpulent"

# leaving this for testing when working on figma dev branch
# git fetch --all
# git checkout -b figma -t remotes/origin/figma

npm config set '//registry.npmjs.org/:_authToken' "${NPM_TOKEN}"
npm install
npm run build

release-it $_FLAGS --config release-it.json --ci -- $_RELEASE_INCREMENT


if [[ "$_FLAGS" != *"--dry-run"* ]]; then
    ZIP_FILES=`find . -iname \*.zip`

    for file in $ZIP_FILES; do
        aws s3 cp "$file" "s3://infor-design-assets-downloads/archives/`basename $file`"
    done
fi
