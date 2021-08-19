# Building the Design System Assets

## Use NPM

- `npm run build` to build the assets into `dist/`
    - `npm run build:tokens:web` to build the tokens for web platform
    - `npm run build:font` copies the font
- `npm run clean` deletes the 3rd level dist files
- `npm test` to run a lint check

## Use NPM Link

- Go to infor-design folder and type `npm link` that sets up the symbolic link
- Go to the ids-enterprise or enterprise-wc folder and type `npm link ids-identity`
- If you make a change to the tokens:
    - in infor design folder change to a token
    - run `npm run build`
    - in enterprise run `npm run build` (or use watch and change a file) and then refresh the page
