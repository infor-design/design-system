# What's New with Infor Design System

## v3.0.4

### v3.0.4 Fixes

- '[Icons]' Made rejected icons hollow

## v3.0.3

### v3.0.3 Fixes

- '[Icons]' Added a new solid and non solid rejected status icon.

## v3.0.2

### v3.0.2 Fixes

- '[Icons]' Added a new solid rejected status icon in soho theme.

## v3.0.1

### v3.0.1 Fixes

- '[Icons]' Added a new rejected status icon.

## v3.0.0

### v3.0.0 Fixes and Breaking Changes

- `[General]` In Uplift theme all colors are slate now, no graphite.
- `[General]` Removed extra copy of token from the v2 name. Please use `/dist/theme-*/tokens`.
- `[General]` All tokens renamed from The `theme` to `ids`. This was needed as the theme is redundant and the variables had to be name spaced.
- `[General]` Added a tailwind config file with a lot of our settings. We dont actually use this IN tailwind for anything but is there for convenience.
- `[General]` Added a scss file with mixins for the tailwind config.
- '[Tokens]' Removed `ids.number.opacity.disabled.value` please use `theme.number.opacity.disabled.value` instead.
- '[Tokens]' Removed `ids.size.font.line.height` please use `theme.number.font.line.height` options instead.
- '[Tokens]' Removed `ids.size.font.line.height` please use `theme.number.font.line.height` options instead.
- '[Tokens]' Removed `dist/*custom-properties.css` please use `dist/*.variables.css`instead if using css variables.
- '[General]' Added eslint but didnt fix everything yet.
- '[Icons]' Added a path-data.json for each set of icons so they can be imported as JSON.
- '[Icons]' Made all icons compress to single paths.
- '[Tokens]' Additional font size tokens have been added. The old tokens ($theme-size-font-xm, $theme-size-font-sm, $theme-size-font-md, $theme-size-font-lg, $theme-size-font-xl) will eventually be removed. Please begin using $theme-size-font-px{size} instead of $theme-size-font-{size}.
- '[Font]' The included source-sans font was updated to version 3.006R.

## v2.9.11

### v2.9.11 Fixes

- `[Icons]` Changed the tree node icon to be more meaningful in uplift theme.
- `[Icons]` Added a print-preview icon. This replaces the update-preview icon which has confusing meaning but was not removed.

## v2.9.10

### v2.9.10 Fixes

- `[Icons]` Changed the uplift amend icon to be more meaningful.

## v2.9.9

### v2.9.9 Fixes

- `[Tokens]` The `$theme-size-font-px-46` should be `48`.

## v2.9.8

### v2.9.8 Fixes

- `[Icons]` Added new locked/unlocked icons to uplift and soho themes.

## v2.9.7

### v2.9.7 Fixes

- `[Icons]` Fixed the disabled color in uplift dark mode of checkboxes. ([#3511](https://github.com/infor-design/enterprise/issues/3511))

## v2.9.6

### v2.9.6 Fixes

- `[Icons]` Fixed the muted color in uplift dark mode to be more visible. ([#2754](https://github.com/infor-design/enterprise/issues/2754))

## v2.9.5

### v2.9.5 Features

- `[Icons]` Added icons for playing videos `icon-security-on`, `icon-security-on`. ([#442](https://github.com/infor-design/design-system/pull/442))

## v2.9.4

### v2.9.4 Features

- `[Colors]` Ruby 06 had the wrong color, so fixed this. ([#3448](https://github.com/infor-design/enterprise/issues/3448))

## v2.9.3

### v2.9.3 Features

- `[Input]` Fixed the disabled input border and colors in uplift. ([#3007](https://github.com/infor-design/enterprise/issues/3007))

## v2.9.2

### v2.9.2 Features

- `[Icons]` Added icons for playing videos `icon-play, icon-record, icon-stop, icon-pause`. ([#437](https://github.com/infor-design/enterprise/issues/437))

## v2.9.1

### v2.9.1 Features

- `[Tokens]` Added minor QA fixes for the color changes in 2.8.0 / 2.9.0 ([#3007](https://github.com/infor-design/enterprise/issues/3007))

## v2.9.0

### v2.9.0 Features

- `[Tokens]` Added new tokes for sizes for fields and input labels for example `input-size-regular-height` and `input-size-compact-height`. ([#3249](https://github.com/infor-design/enterprise/issues/3249))

## v2.8.0

### v2.8.0 Features

- `[Tokens]` Revised the color in all 3 variants of the uplift/vibrant theme. This impacts many components and charts in color only. ([#3007](https://github.com/infor-design/ids-enterprise/issues/3007))

## v2.7.0

### v2.7.0 Features

- `[Icons]` Reversed a change in previous versions to make alert icons all have a white background as this caused issues. Concerning alert icons there are now the following `icon-[name]` - which will have transparent background, in Uplift these are linear in style, in soho these are solid in style. We also add a `icon-[name]-alert` for alert icons with a white background. If you need a white background you can use these now. ([#3052](https://github.com/infor-design/enterprise/issues/3052))
- `[Tokens]` Added a new typographic scale which expands the sizes from 5 (xm, sm, md, lg, xl) to 12. This results in the token names changing from this format `$theme-size-font-{size}` to `$theme-size-font-px{size}`, the old tokens are kept for now for backwards compatibility but may later be removed `$theme-size-font-px{size}` tokens should be used. ([#427](https://github.com/infor-design/design-system/issues/427))

## v2.6.18

### v2.6.18 Features

- `[Icons]` Added a new set of icon for no users/people ect. to the empty state icons. ([#429](https://github.com/infor-design/design-system/issues/429))

## v2.6.17

### v2.6.17 Features

- `[Icons]` Added a new set of icons empty state for the uplift theme. ([#426](https://github.com/infor-design/design-system/issues/426))
