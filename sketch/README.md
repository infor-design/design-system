# Using the Sketch Files

This is to explain the different methods and tools used to maintain the icons.

## Sketch Plugins

- [Sort Me](https://github.com/romashamin/sort-me-sketch)
- [Arrange Artboards](https://github.com/kenmoore/sketch-arrange-artboards)

## Principles to follow

- Keep the layers in alphabetical order.
    - If adding a new icon, run `sort me` then `arrange artboards` to integrate properly

- Naming Icon Layers
    - Prefix each layer with "icon-"
        - Bad: `a-name`
        - Good: `icon-a-name`
    - Separate words with dashes `-`.
        - Bad: `icon_double_rightArrow`
        - Good: `icon-arrow-double-right
    - Get more descriptive from left to right. This groups icons automatically when sorting alphabeticaly.
        - Bad: `icon-double-right-arrow`
        - Good: `icon-arrow-double-right

## Icon Requirements

The file `ids-icons-system.sketch` is used for system icons. All icons are categorized using Pages. Each icon should be black at 100% opacity.

Meanwhile, `ids-icons-fancy.sketch` contains accent icons, empty state icons, and product app icons, each in their own page respectively. Fancy icons should be black at varying opacity.
