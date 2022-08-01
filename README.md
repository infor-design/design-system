# Infor Design System

The Infor Design System is a set of use-case driven design practices, development tools, and support documentation to create a cohesive user experience across all Infor CloudSuite applications.

This repository contains the fundamentals of the Infor Design System, including design tokens, which are design metadata, and basic tools like icons. For more information, see [design.infor.com](https://design.infor.com).

## Getting Started for Designers

To get started, :arrow_down:[download the latest release](https://github.com/infor-design/design-system/releases/latest) :arrow_down: of our IDS Design Kit. In that package, you'll find icons, font files for Source Sans Pro, and our design tokens.

See our [getting started page](https://design.infor.com/guidelines/getting-started-designers) for more information.

## Installing IDS Identity in your project

Part of the Infor Design System is a package of different assets that create the Infor identity. This includes the design tokens, font files, and icons.

Install this into your project with:

```shell
npm install --save-dev ids-identity
```

Then look in `node_modules/ids-identity` for the assets.

## Building Assets Locally

For designers and developers wanting to build these assets locally, see our [developer guide](docs/DEVELOP.md).

## Using Jenkins

- To release the next version, specify major, minor, or patch for RELEASE_INCREMENT, and clear RELEASEIT_FLAGS.
- To update an existing git release/tag, clear RELEASE_INCREMENT, and use these flags for RELEASEIT_FLAGS `--dry-run=false --no-increment --no-npm`. Before doing this, remove the tag/version from github so it gets re-created.

## Local Docker

Create a .env file and populate it. AWS keys are required only for local docker runs.

```bash
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=

NPM_TOKEN=""
GITHUB_ACCESS_TOKEN=
DOCS_API_KEY=

# specify the semantic version target X.X.X
RELEASE_INCREMENT=minor

RELEASEIT_FLAGS="--dry-run=true"
```

Then `make build`.

## Help

For questions and support, please [open an new Issue](https://github.com/infor-design/design-system/issues/new?template=support.md&title=[Support]).
