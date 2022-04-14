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

## Using the Css Variable Sass Map

- Add import `@import '../../../node_modules/ids-identity/dist/theme-new/tokens/web/theme-new.map.variables'`;
` to your sass.
- Add a sass mixin like this

```sass
@mixin css-variables($vars...) {
  :host {
    @each $var in $vars {
      @if not map-get($css-variables, $var) {
        @error 'ERROR: Specified css variable #{$var} does not exist in the css-variables map';
      }

      #{$var}: map-get($css-variables, $var);
    }
  }
}
```

- use as follows:

```sass
@include css-variables(
  --ids-color-brand-primary-base,
  --ids-color-palette-azure-10,
  --ids-color-palette-azure-50,
  --ids-color-palette-azure-60,
  --ids-color-palette-azure-90,
  --ids-color-palette-classic-slate-10,
  --ids-color-palette-classic-slate-60,
  --ids-color-palette-classic-slate-80,
  --ids-color-palette-graphite-10,
  --ids-color-palette-graphite-30,
  --ids-color-palette-graphite-100,
  --ids-color-palette-slate-10,
  --ids-color-palette-slate-20,
  --ids-color-palette-slate-30,
  --ids-color-palette-slate-60,
  --ids-color-palette-slate-70,
  --ids-color-palette-slate-90,
  --ids-color-palette-slate-100,
  --ids-color-palette-white,
);
```
