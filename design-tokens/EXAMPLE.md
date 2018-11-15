# Example

This is a simple example of how to implement a design token in your code. We offer many formats of the design tokens, but this example uses SASS.

## Initial files

1. Our file hierarchy looks like this:

    ```txt
    ├── project/
    |   ├── sass/
    |       ├── styles.scss
    |       ├── my-theme-light.scss
    |       ├── my-theme-dark.scss
    ├── dist/
    ├── node_modules
        ├── ids-identity/
            ├──tokens/
                ├──web/
                    ├── theme-soho-scss
                    ├── theme-soho-dark.scss
    ```

1. Start with a simple Sass definition to showcase the body's `background-color` property.

    - sass/styles.scss

        ```css
        body {
            background-color: $body-color-primary-background;
        }
        ```

1. We will use two theme files to import the specific token theme and `styles.scss` file in the proper order.

    - sass/my-theme-light.scss

        ```css
        @import ../../node_modules/ids-identity/tokens/web/theme-soho.scss; // Use the soho original theme (lighter)
        @import styles.scss;
        ```

    - sass/my-theme-dark.scss

        ```css
        @import ../../node_modules/ids-identity/tokens/web/theme-soho-dark.scss; // Use the soho dark theme
        @import styles.scss;
        ```

1. There are many ways to compile SASS into CSS and we aren't sure what system you use, so we'll use our magical psuedo code function `psuedoSassToCSS()`:

    ```js
    psuedoSassToCSS(['sass/my-theme-light.scss', 'sass/my-theme-dark.scss']);
    ```

1. Post-compile you'll have two CSS files that correspond with each theme:

    - dist/my-theme-light.css

        ```css
        body {
            background-color: #f0f0f0;
        }
        ```

    - dist/my-theme-dark.css

        ```css
        body {
            background-color: #454545;
        }
        ```

1. In your website/app, you can include either stylesheet `dist/my-theme-light.css` or `dist/my-theme-dark.css`. You could even write a javascript mechanism to allow the user to control which theme they see.
