# Release

1. Make sure you have release-it installed (`npm install release-it -g`)
1. Checkout the release branch (X.Y.Z) and `git pull --tags`
1. Run `npm run test` just to ensure things are ok
1. Run a release cmd:
    1. `npm run release:beta` - beta
    1. `npm run release:rc` - release candidate normally the final testing branch before the release
    1. `npm run release:final` - the release itself
1. Always verify the release version when the script asks.
1. Merge Back to master
1. Verify the release on github and npm
