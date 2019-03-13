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

# Set param defaults
PACKAGE_VERSION=$(node -p -e "require('./package.json').version")
PACKAGE_LIBRARY="ids-identity"
FNAME="IDS-$PACKAGE_VERSION.zip"

# Set params and override defaults if param exists
while getopts "e:f:l:" opt; do
    case $opt in
        e)
            DEPLOY_ENV="${OPTARG}"
            ;;
        f)
            FNAME="${OPTARG}"
            ;;
        l)
            PACKAGE_LIBRARY="${OPTARG}"
            ;;
        *)
            exit 1
            ;;
    esac
done

case $DEPLOY_ENV in
  "local") DEPLOY_URL='http://localhost/api/docs/';;
  "localDebug") DEPLOY_URL='http://localhost:9002/api/docs/';;
  "staging") DEPLOY_URL='https://staging.design.infor.com/api/docs/';;
  "prod")  DEPLOY_URL='https://design.infor.com/api/docs/';;
   *) echo "Invalid option for deploy environment";;
esac

echo "${CYAN}Getting assets for $PACKAGE_VERSION...${RESET}"

if [ ! -f $FNAME ]; then
    echo "${RED}ERROR: $FNAME not found!${RESET}"
    exit 1
fi

echo "${CYAN}Uploading assets...${RESET}"

RESPONSE=$(curl \
  -s -o /dev/null -w "%{http_code}" \
  --form "file=@$FNAME" \
  --form root_path="$PACKAGE_LIBRARY/$PACKAGE_VERSION"\
  --form post_auth_key=$DOCS_API_KEY \
  $DEPLOY_URL
)

if [[ "$RESPONSE" == "200" ]]; then
  echo "${CYAN}Success!${RESET}"
else
  echo "${RED}ERROR: deploy returned http code $RESPONSE!${RESET}"
  exit 1
fi
