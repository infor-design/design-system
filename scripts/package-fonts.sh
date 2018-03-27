#!/bin/bash

VERSION_TAG="2.020R-ro/1.075R-it"
FILENAME="SourceSansPro"
DEST="font"

echo "Starting fresh..."
rm $DEST/{*.css,*.txt}
rm -r $DEST/*/
mv $DEST/README.md $DEST/README.bk
echo "Downloading Source Sans Pro..."
mkdir -p $DEST
wget --quiet --output-document "$DEST/$FILENAME.zip" "https://github.com/adobe-fonts/source-sans-pro/archive/$VERSION_TAG.zip"
echo "Unzipping..."
unzip -q -d "$DEST" "$DEST/$FILENAME.zip" && f=("$DEST"/*/) && mv "$DEST"/*/* "$DEST/" && rm -r "${f}"
echo "Cleaning up..."
rm -r $DEST/$FILENAME.zip
rm $DEST/bower.json
mv $DEST/README.bk $DEST/README.md
echo Done!
