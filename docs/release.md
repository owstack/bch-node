# Release Process

Binaries for bitcoind are distributed for convenience and built deterministically with Gitian, signatures for bitcoind are located at the [gitian.sigs](https://github.com/owstack/gitian.sigs) respository.

## How to Release

When publishing to npm, the .gitignore file is used to exclude files from the npm publishing process. Be sure that the bch-node directory has only the directories and files that you would like to publish to npm. You might need to run the commands below on each platform that you intend to publish (e.g. Mac and Linux).

To make a release, bump the `version` of the `package.json`:

```bash
git checkout master
git pull upstream master
npm install
npm run test
npm run regtest
npm run jshint
git commit -a -m "Bump package version to <version>"
git push upstream master
npm publish
```

Create a release tag and push it to the Open Wallet Stack Github repo:

```bash
git tag -s v<version> -m 'v<version>'
git push upstream v<version>
```
