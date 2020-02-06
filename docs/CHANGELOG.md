# What's New with Infor Design System

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
