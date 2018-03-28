#!/bin/bash

PACKAGE_VERSION=$(node -p -e "require('./package.json').version")

mkdir -p dist && cd dist
zip -r IDS-$PACKAGE_VERSION.zip \
    ../font/ \
    ../sketch/ \
    tokens/
