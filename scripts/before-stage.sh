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

if [ -z ${GITHUB_ACCESS_TOKEN+x} ]; then
    echo "${RED}ERROR: GITHUB_ACCESS_TOKEN is unset and required for deploy${RESET}"
    exit 1
fi

if [ -z ${DOCS_API_KEY+x} ]; then
    echo "${RED}ERROR: DOCS_API_KEY is unset and required for deploy${RESET}"
    exit 1
fi

#npm install && \
#    npm run clean && \
#    npm run build && \
#    npm run test
