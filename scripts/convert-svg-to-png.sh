# Requires `brew cask install xquartz inkscape`

BASE_DIR="$PWD/icons/theme-soho/svg"
OUT_DIR="$PWD/icons/theme-soho/png"
INKSCAPE_BIN="/Applications/Inkscape.app/Contents/Resources/bin/inkscape"

for d in $BASE_DIR/*; do
    if [ -d "$d" ]; then
        TYPE_DIR=`echo ${d##*/}` # Trim greedily https://stackoverflow.com/a/3162500
    fi
    for f in $d/*; do
        FNAME=`basename ${f##*/} .svg`
        $INKSCAPE_BIN $f --export-png=$OUT_DIR/$TYPE_DIR/$FNAME.png --without-gui
    done
done
