# Building the Design System Assets

## Use NPM

- `npm run build` to build the assets into `dist/`
    - `npm run build:tokens:web` to build the tokens for web platform
    - `npm run build:icons` to build the icons svgs from a sketch file
    - `npm run build:font` copies the font
- `npm run clean` deletes the 3rd level dist files
- `npm test` to run YML lint
- `npm run lint:web` To build and then lint the built custom-properties (since we have no way of linting the yaml for css rules)
