#!/bin/bash

VERSION_TAG="2.020R-ro/1.075R-it"
FILENAME="SourceSansPro"
DEST="font"

echo "Starting fresh..."
rm -r $DEST/*.zip
echo "Downloading Source Sans Pro..."
mkdir -p $DEST
wget --quiet --output-document "$DEST/$FILENAME-ALL.zip" "https://github.com/adobe-fonts/source-sans-pro/archive/$VERSION_TAG.zip"
echo "Unzipping..."
unzip -q -d "$DEST/formats" "$DEST/$FILENAME-ALL.zip" && f=("$DEST/formats"/*) && mv "$DEST/formats"/*/* "$DEST/formats" && rmdir "${f[@]}"
for d in $DEST/formats/*/ ; do
  filetype=$(echo "$d" | rev | cut -d"/" -f2  | rev)
  echo "Packaging $filetype..."
  zip -q -j -r $DEST/$FILENAME-$filetype.zip $DEST/formats/$filetype/*
done
echo "Cleaning up..."
rm -r $DEST/formats
echo Done!
