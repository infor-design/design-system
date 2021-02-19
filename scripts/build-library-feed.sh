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

PACKAGE_LIBRARY=$(node -p -e "require('./package.json').name")
PACKAGE_VERSION=$(node -p -e "require('./package.json').version")
DOMAIN='https://design.infor.com'
DOCS_ROOT='api/docs'
NAME='IDS UI Design Library'
RELEASE_URL="https://github.com/infor-design/design-system/releases/tag/$PACKAGE_VERSION"
LIBRARY_PATH='sketch/theme-classic/ids-design-kit.sketch'
ENCLOSURE_URL="$DOMAIN/$DOCS_ROOT/$PACKAGE_LIBRARY/latest/$LIBRARY_PATH"
DATE=`date`
#Wed, 13 Mar 2019 10:09:18 GMT

OUTPUT_PATH='./tmp'
FEED_DIR="$OUTPUT_PATH/feeds"
OUTPUT_NAME='ids-sketch-library.rss'
ZIP_NAME="SketchLibraryFeeds.zip"

mkdir -p $FEED_DIR

echo "${CYAN}Writing feed...${RESET}"
cat << EOF > $FEED_DIR/$OUTPUT_NAME
<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom" version="2.0" xmlns:sparkle="http://www.andymatuschak.org/xml-namespaces/sparkle">
    <channel>
        <title>
            <![CDATA[$NAME]]>
        </title>
        <description>
            <![CDATA[$NAME]]>
        </description>
        <link>
            $DOMAIN
        </link>
        <generator>
            IDS
        </generator>
        <lastBuildDate>
            $DATE
        </lastBuildDate>
        <item>
            <title>
                <![CDATA[$NAME]]>
            </title>
            <description>
                <![CDATA[$NAME]]>
            </description>
            <link>
                $RELEASE_URL
            </link>
            <guid isPermaLink="false">
                $PACKAGE_VERSION
            </guid>
            <enclosure url="$ENCLOSURE_URL" type="application/octet-stream" sparkle:version="$PACKAGE_VERSION"/>
        </item>
    </channel>
</rss>
EOF

echo "${CYAN}Zipping assets...${RESET}"
cd $OUTPUT_PATH
zip -qr ../$ZIP_NAME .

echo "${GREEN}Created ${ZIP_NAME}${RESET}"

echo "${CYAN}Cleaning up...${RESET}"
cd ..
rm -r $OUTPUT_PATH
