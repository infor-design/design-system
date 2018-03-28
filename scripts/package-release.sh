#!/bin/bash

PACKAGE_VERSION=$(node -p -e "require('./package.json').version")

cd dist
zip -r ../IDS-$PACKAGE_VERSION.zip \
    ../font/ \
    ../sketch/ \
    tokens/
