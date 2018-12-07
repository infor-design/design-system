#!/bin/bash

REL_VERSION=$(cat /tmp/ids-identity-release-version)
PREV_VERSION=$(git describe --tags --abbrev=0)
if [[ "$PREV_VERSION" == "" ]]; then
    VERSION_COMPARE=""
else
    VERSION_COMPARE="$PREV_VERSION...HEAD"
fi
LOG=$(git log --pretty=format:"* %s (%h)" $VERSION_COMPARE)

if [[ "$REL_VERSION" == "" ]]; then
    COPY="To access the assets in this release, download the IDS zip above for the latest Sketch toolkit, fonts, and more!"
else
    COPY="To access the assets in this release, [download IDS-$REL_VERSION.zip](https://github.com/infor-design/design-system/releases/download/$REL_VERSION/IDS-$REL_VERSION.zip) for the latest Sketch toolkit, fonts, and more!"
    rm /tmp/ids-identity-release-version
fi

echo "$COPY"
echo ""
echo "$LOG"
