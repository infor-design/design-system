# Using Source Sans Pro for Infor Design System

To read more about how to use Source Sans in IDS, see our [typography page](https://github.com/infor-design/enterprise/blob/main/src/components/typography/readme.md).

## Source Sans Pro

[Source Sans Pro](http://adobe-fonts.github.io/source-sans-pro/) is a set of OpenType fonts that have been designed to work well in user interface (UI) environments.

## Including Source Sans Pro in your Web App

It is no longer recommended to use `fonts.googleapis` to use the fonts because it can cause some issues:

a) because Google fonts violates [GDPR](https://www.cookieyes.com/documentation/google-fonts-and-gdpr/)
b) if application needs to run without an internet connection
c) because some countries google links may be banned

For this reason we recommend you serve the files with your application. All the needed fonts can be found in this folder

1. Serve all the `woff2` files in a folder on the server thats available to the app. These fonts can use caching if possible. Note that there are a lot of files because Source Sans is not available in some languages so alternatives are used as noted on [this page](https://github.com/infor-design/enterprise/blob/main/src/components/typography/_typography-new.scss#L6)

1. The OFL.txt is the license
1. The README.md is this file
1. Then include font-face.css in the page before the `theme-light-new.css` (or whatever soho css file)

```html
  <link rel="stylesheet" id="font-face" href="/css/font-face.css" type="text/css" />
  <link rel="stylesheet" id="sohoxi-stylesheet" href="{{basepath}}css/theme-new-light.css" type="text/css"/>
```

If you just want to include the main font and no languages and dont care about the above. For example for testing ect you can use the CDN.

```html
<link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600&amp;display=swap" rel="stylesheet">
```

## Font installation instructions

Installing the font may be needed for some design tools to accurately reflect the font.

- [Mac OS X](http://support.apple.com/kb/HT2509) Mac users can install the OTF version by going into `/font/OTF/` and installing all variants into Font Book.
- [Windows](http://windows.microsoft.com/en-us/windows-vista/install-or-uninstall-fonts)
- [Linux/Unix-based systems](https://github.com/adobe-fonts/source-code-pro/issues/17#issuecomment-8967116)

## Further information

For information about the design and background of Source Sans, please refer to the [official font readme file](http://www.adobe.com/products/type/font-information/source-sans-pro-readme.html).
