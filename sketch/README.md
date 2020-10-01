# Using the Sketch Files

## Process for Updating/Adding Icons

- clone this repo with git for example:

```sh
git clone https://github.com/infor-design/design-system.git`
```

- go into the design-system folder you just cloned and open the files in the sketch folder in the sketch tool
- make a branch for the pull request - for example:

```sh
git checkout master
git checkout -b issueno-short-description
```

- make updates to the icons or add new icons in the same format as it is now
- if you add new icons make sure to add a soho icon and an uplift icon as we do need the icons to exist in both themes
- commit the change

```sh
git commit -a
```

- type a brief comment
- push the the change

```sh
git push
```

- on screen it will tell you a command to run next to push he branch, run it
- go to https://github.com/infor-design/design-system
- you will see a popup to make a pull request, click make pull request, to master and follow the template explaining the changes and submit
- dev will review it and take it from there

## System Icons

This is to explain the different methods and tools used to maintain `ids-icons-system.sketch` in the Uplift theme. Please note that while we are not changed icons `theme-soho` as a rule, we need to ensure that there is the same icons in both themes. So if you make a new icon please make one for both themes.

### Design Guidelines for System Icons

- Icons are designed at 32px, 24px, and 16px.
- Icons are designed with 1px stroke and various radiuses based on the three sizes.
- Icons should be black at 100% opacity.
- Icons need to be placed on an artboard, not only be a standalone symbol
- Please refer to the `Visual Guidelines` page within `ids-icons-system.sketch` for more details.

### Categories

- Each icon lives in one category only.
- Each icon should have a unique name and cannot be shared with another icon in the same or different category.
- Categories are organized by Pages in `ids-icons-system.sketch`.
- Category definition as the following:
    - Document: Any document related icons, such as reports, spreadsheets, etc.
    - Editor: Icons that represent the functions in HTML editor.
    - File: Any file types, such as excel, mp3, etc.
    - Media: Icons related to multi-player, such as play, pause, etc.
    - Navigation: Icons related to navigating through the product experiences, such as hambuger, arrows etc.
    - Object: Icons that are not tied to specific meanings and can be interpreted differently based on use cases, such as truck, moon, sun, etc.
    - People: Icons related to users and roles, such as profile, etc.
    - Search: Icons that are tied to the search field function, such as category search, etc.
    - Status: Icons that represent feedback loop from the system, such as alert, warning, etc.
    - System: Icons that are commonly known within the products but might not have universal meanings.
    - Table: Icons that represent the functions in datagrid, such as operators like equals, etc.
    - Universal: Icons that are universally known and can be identified within 3 seconds, such as save, delete, edit, etc.
    - Visualization: Icons related to visualization, such as charts, etc.

### Naming Convention for Layers in Categories (System Icons)

- Separate words with dashes `-`.
    - Good: `icon-arrow-double-right`
    - Bad: `icon_double_rightArrow`
- Get more descriptive from left to right. This convention groups icons automatically when sorting alphabetically.
    - Good: `icon-arrow-double-right`
    - Bad: `icon-double-right-arrow`
- Keep the artboards/layers in an alphabetical order. If adding a new icon, select all artboards/layers and run the `sort me` plugin.

### Naming Convention for Layers in Symbols (System Icons)

- Separate words with slashes `/`.
    - Good: `Icons/Universal/Add/32`
    - Bad: `Icons-Universal-Add-32`
- Prefix each layer with "Icons", followed by category name, icon name, and size.
    - Good: `Icons/Universal/Add/32`
    - Bad: `Icon/Add/32`
- Keep the artboards/layers in an alphabetical order. If adding a new icon, select all artboards/layers and run the `sort me` plugin.

## App Icons

This is to explain the different methods and tools used to maintain `ids-icons-apps.sketch`, in the Uplift theme, which contains Application/Product Icons for Infor Ming.le.

### Design Guidelines for App Icons

- Icons are designed at 40px by 40px.
- Icons are designed with a 9px radius on one corner of the shape.
- Five colors and 3 shades per color can be used for the icons. White can be used to create contrast but should only be used internally where it does not touch the edges of the icon, which may cause an open area when the icon is placed on a white background.
- Keep the design minimal by only include shapes that are necessary to identify its purpose.
- Please refer to the `Visual Guidelines` page within `ids-icons-apps.sketch` for more visual details.

### Naming Convention for Layers in Symbols (App Icons)

- Separate words with slashes `/` with object first and color second.
    - Good: `Calendar/Azure`
    - Bad: `Azure-Calendar`
- Get more descriptive from left to right. This convention groups icons automatically when sorting alphabetically.
    - Good: `Chart/Bar/Azure`
    - Bad: `Azure/Bar-Chart`
- Keep the artboards/layers in an alphabetical order. If adding a new icon, select all artboards/layers and run the `sort me` plugin.

## Sketch Plugins

- [Sort Me](https://github.com/romashamin/sort-me-sketch)
