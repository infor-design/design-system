# Release

1. Make sure you have release-it installed (`npm install release-it -g`)
1. Checkout the release branch (X.Y.Z) and `git pull --tags`
1. Run `npm run test` just to ensure things are ok.
1. You can run `release-it --dry-run --no-git.requireCleanWorkingDir` just to test things are ok.
1. Run `release-it`
1. Always verify the release version when the script asks.
1. Merge Back to master
1. Verify the release on github and npm
