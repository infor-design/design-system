#!/bin/bash

PACKAGE_VERSION=$(node -p -e "require('./package.json').version")

# @output zip
# @comment cd into dist and get font and sketch
#          from parent to build structure as below
# @structure:
#    IDS-X.X.X.zip
#        font/
#        sketch/
#        tokens/

cd dist
zip -r ../IDS-$PACKAGE_VERSION.zip \
    ../font/ \
    ../sketch/ \
    tokens/
