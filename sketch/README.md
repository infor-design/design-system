# Using the Sketch Files

## System Icons

This is to explain the different methods and tools used to maintain `ids-icons-system.sketch` in the Uplift theme. (Please note that no changes to the icons Sketch files in `theme-soho` are permitted at this time unless requested otherwise).

### Design Guidelines

- Icons are designed at 32px, 24px, and 16px.
- Icons are designed with 1px stroke and various radiuses based on the three sizes.
- Icons should be black at 100% opacity.
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

### Naming Convention for Layers in Categories

- Separate words with dashes `-`.
    - Good: `icon-arrow-double-right`
    - Bad: `icon_double_rightArrow`
- Get more descriptive from left to right. This convention groups icons automatically when sorting alphabeticaly.
    - Good: `icon-arrow-double-right`
    - Bad: `icon-double-right-arrow`
- Keep the artboards/layers in an alphabetical order. If adding a new icon, select all artboards/layers and run the `sort me` plugin.

### Naming Convention for Layers in Symbols

- Separate words with dashes `/`.
    - Good: `Icons/Universal/Add/32`
    - Bad: `Icons-Universal-Add-32`
- Prefix each layer with "Icons/", followed by category name, icon name, and size.
    - Good: `Icons/Universal/Add/32`
    - Bad: `Icon/Add/32`
- Keep the artboards/layers in an alphabetical order. If adding a new icon, select all artboards/layers and run the `sort me` plugin.

### Sketch Plugin

- [Sort Me](https://github.com/romashamin/sort-me-sketch)

## App Icons

This is to explain the different methods and tools used to maintain `ids-icons-apps.sketch`, in the Uplift theme, which contains Application/Product Icons for Infor Ming.le.

## Fancy Icons

`ids-icons-fancy.sketch` contains accent icons, empty state icons, each in their own page respectively. Fancy icons should be black at varying opacity.
