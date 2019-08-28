# Release

1. Make sure you have release-it installed (`npm install release-it -g`)
1. Checkout the release branch (X.Y.Z) and `git pull --tags`. If not created you may need to do so.
1. Run `npm run test` just to ensure things are ok.
1. You can run `release-it --dry-run --no-git.requireCleanWorkingDir` just to test things are ok.
1. Run `release-it`.
1. Always verify the release version when the script asks.
1. Verify the release on github and npm.
1. Merge Back to master using the following command sequence.

```sh
git checkout master
git pull origin master
git merge {branch name}
git push origin master
```
