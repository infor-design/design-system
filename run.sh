#!/bin/bash

# This script runs inside of a docker container on start as a
# kubernetes job. AWS permissions are controlled by a role setup 
# in kubernetes.  To run this locally, use the make build command
# with proper environment variables set in .env file.

_NPM_TOKEN=${NPM_TOKEN:-}

npm config set //registry.npmjs.org/:_authToken $_NPM_TOKEN
npm install
npm run build

release-it --config release-it.json --ci -- patch
