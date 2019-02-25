# Update Color Palette

## Proposal

Five years ago, SoHo Xi was launched and the color palette for Infor UI has stayed the same since.

The Infor Design System team is requesting comments on the following proposal to update the color palette as part of a rebranding of the user interface components, including new themes for the IDS components.

## Background

Decisions about colors in "SoHo Xi" strongly took into account how functionality and accessibility would be effected. Previous generations of SoHo used more a more saturated blue, lighter gray, and more whitespace. At the time, customers found this a jarring change and felt that contrast was too low. Whitespace also felt overwhelming because applications weren't responsive. This left large areas of the application open because the space couldn't be better accommodated by adjusting layouts in a responsive manner.

Grey was used more prominently in Xi designs to combat the whitespace issue. A lower saturated color palette complemented the gray space well.

## Reasoning

We want to update the color palette for aesthetic and functional reasons. Personal and market preference changes over time and the current palette feels dull to us and our users. We also have a greater capacity to handle functional and accessible aspects of color through the design system than we did five years ago.

### Aesthetics

The color palette in "SoHo Xi" is low in saturation. This was originally intended for a softer visual aesthetic for long-term use of the software. While this remains a requirement, visual appeal for our customers and prospects is a priority.

Infor competition, whether enterprise or consumer, tend to use more saturated colors for visual appeal.

### Functional and Accessible

Accessibility is still a priority. Based on what we've learned and including better tooling, documentation, and change management protocols, we're more capable in handling multiple theme variants and documenting the differences in implementation.

Because of this, we now can have a color palette that supports a wide variety of implementations and use cases and use themes and variants (dark, light, contrast, accessible) to achieve the differences in functional and accessible use cases.

## Impacts

### Positive

- More aesthetically attractive colors
- Defines palette for use across:
    - Iconography
        - system
        - accent
        - application
    - assets like splash screens
    - primary actions

### Negative

- Requires manual color updates for teams not using IDS components or design tokens
- Creates additional disunity among current and legacy applications

## Roll Out

A new set of colors will be rolled out in two main ways:

1. Design Tokens
2. Enterprise component theme

### Design Tokens

Already a work-in-progress, the [uplift-theme](https://github.com/infor-design/design-system/blob/master/design-tokens/theme-uplift/color-palette.json) design tokens define the color palette which are inherited by the rest of the token mechanism.

Updating the color palette in a new token-based theme would provide access to extensive design metadata and would allow access to the specifications of components using the new theme colors.

### Enterprise Component Theme

The Enterprise components use the design tokens under the hood. The integration between the design tokens and the Enterprise components means that when we update the new color palette in the tokens, we can modify or add a new theme within the Enterprise components.

We intend to release an updated theme based on a new color palette within the `4.x` series of components and make it an opt-in theme. When we eventually release the `5.x` components, this new theme will be the default.
