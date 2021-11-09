#!/bin/bash

# ./scripts/after-release.sh latest 4.12.1
# ./scripts/after-release.sh beta 4.13.0-beta.0

RELEASE_TAG=$1

if [[ "$RELEASE_TAG" == "latest" ]]; then
    ./scripts/deploy-assets.sh -e prod
    ./scripts/deploy-assets.sh -e staging
fi
