#!/bin/bash

VERSION_TAG="2.020R-ro/1.075R-it"
FILENAME="SourceSansPro"
DEST="font"

rm -r font
echo "Downloading Source Sans Pro..."
mkdir -p font
wget --quiet --output-document "$FILENAME.zip" "https://github.com/adobe-fonts/source-sans-pro/archive/$VERSION_TAG.zip"
echo "Unzipping..."
unzip -q -d "$DEST" "$FILENAME.zip" && f=("$DEST"/*) && mv "$DEST"/*/* "$DEST" && rmdir "${f[@]}"
echo "Packaging OTF..."
zip -q -j -r $DEST/$FILENAME-OTF.zip $DEST/OTF/*
echo "Cleaning up..."
rm $FILENAME.zip
