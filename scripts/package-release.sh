#!/bin/bash

RESET=`tput sgr0`

BLACK=`tput setaf 0`
RED=`tput setaf 1`
GREEN=`tput setaf 2`
YELLOW=`tput setaf 3`
BLUE=`tput setaf 4`
MAGENTA=`tput setaf 5`
CYAN=`tput setaf 6`
WHITE=`tput setaf 7`

PACKAGE_VERSION=$(node -p -e "require('./package.json').version")

# @output zip
# @comment Package release for Github and Docs API
# @argument {string} filename; has default value
# @structure:
#    IDS-X.X.X.zip
#        font/
#        sketch/
#        tokens/

# Set zip filename to argument or fallback
FNAME=${1:-IDS-${PACKAGE_VERSION}.zip}

echo "${CYAN}Copying assets...${RESET}"
mkdir -p deploy
cp -r dist/* deploy
cp -r sketch deploy

echo "${CYAN}Zipping assets...${RESET}"
cd deploy
zip -qr ../$FNAME \
    .
echo "${GREEN}Created ${FNAME}${RESET}"

echo "${CYAN}Cleaning up...${RESET}"
cd ..
rm -r deploy
