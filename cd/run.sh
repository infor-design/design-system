#!/bin/bash

# This script runs inside of a docker container on start as a
# kubernetes job. AWS permissions are controlled by a role setup 
# in kubernetes.  To run this locally, use the make build command
# with proper environment variables set in .env file.

export TERM=xterm
export GIT_SSH_COMMAND='ssh -i /root/.ssh/github_rsa -o "StrictHostKeyChecking=no"'

_NPM_TOKEN=${NPM_TOKEN:-}
_RELEASE_INCREMENT=${RELEASE_INCREMENT:-}
_DRY_RUN=${DRY_RUN:-}

IFS="|" read _USERNAME _PASSWORD _EMAIL < /usr/src/secrets/secrets

ls -al /root/.ssh
git clone git@github.com:infor-design/design-system.git /root/design-system
cd /root/design-system

# leaving this for testing when working on figma dev branch
# git fetch --all
# git checkout -b figma -t remotes/origin/figma

npm config set //registry.npmjs.org/:_authToken $_NPM_TOKEN
npm-cli-login -u $_USERNAME -p $_PASSWORD -e $_EMAIL
npm install
npm run build
npm run zip

ZIP_FILES=`find . -iname \*.zip`

for file in $ZIP_FILES; do
    aws s3 cp "$file" "s3://infor-design-assets-downloads/archives/`basename $file`"
done

release-it $_DRY_RUN --config release-it.json --ci -- $_RELEASE_INCREMENT
