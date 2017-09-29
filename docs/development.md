# Setting up Development Environment

## Install Node.js

Install Node.js by your favorite method, or use Node Version Manager by following directions at https://github.com/creationix/nvm

```bash
nvm install v4
```

## Fork and Download Repositories

To develop bch-node:

```bash
cd ~
git clone git@github.com:<yourusername>/bch-node.git
git clone git@github.com:<yourusername>/bch-lib.git
```

To develop bitcoin or to compile from source:

```bash
git clone git@github.com:<yourusername>/bitcoin.git
git fetch origin <branchname>:<branchname>
git checkout <branchname>
```
**Note**: See bitcoin documentation for building bitcoin on your platform.


## Install Development Dependencies

For Ubuntu:
```bash
sudo apt-get install libzmq3-dev
sudo apt-get install build-essential
```
**Note**: Make sure that libzmq-dev is not installed, it should be removed when installing libzmq3-dev.


For Mac OS X:
```bash
brew install zeromq
```

## Install and Symlink

```bash
cd bch-lib
npm install
cd ../bch-node
npm install
```
**Note**: If you get a message about not being able to download bitcoin distribution, you'll need to compile bitcoind from source, and setup your configuration to use that version.


We now will setup symlinks in `bch-node` *(repeat this for any other modules you're planning on developing)*:
```bash
cd node_modules
rm -rf bch-lib
ln -s ~/bch-lib
rm -rf bitcoind-rpc
ln -s ~/bitcoind-rpc
```

And if you're compiling or developing bitcoin:
```bash
cd ../bin
ln -sf ~/bitcoin/src/bitcoind
```

## Run Tests

If you do not already have mocha installed:
```bash
npm install mocha -g
```

To run all test suites:
```bash
cd bch-node
npm run regtest
npm run test
```

To run a specific unit test in watch mode:
```bash
mocha -w -R spec test/services/bitcoind.unit.js
```

To run a specific regtest:
```bash
mocha -R spec regtest/bitcoind.js
```

## Running a Development Node

To test running the node, you can setup a configuration that will specify development versions of all of the services:

```bash
cd ~
mkdir devnode
cd devnode
mkdir node_modules
touch bch-node.json
touch package.json
```

Edit `bch-node.json` with something similar to:
```json
{
  "network": "livenet",
  "port": 3001,
  "services": [
    "bitcoind",
    "web",
    "explorer-api",
    "ows-explorer",
    "<additional_service>"
  ],
  "servicesConfig": {
    "bitcoind": {
      "spawn": {
        "datadir": "/home/<youruser>/.bitcoin",
        "exec": "/home/<youruser>/bitcoin/src/bitcoind"
      }
    },
    "explorer-api": {
      "module": "bch-explorer-api"
    }
  }
}
```

**Note**: To install services [bch-explorer-api](https://github.com/owstack/bch-explorer-api) and [ows-explorer](https://github.com/owstack/ows-explorer) you'll need to clone the repositories locally.

Setup symlinks for all of the services and dependencies:

```bash
cd node_modules
ln -s ~/bch-lib
ln -s ~/bch-node
ln -s ~/bch-explorer-api
ln -s ~/ows-explorer
```

Make sure that the `<datadir>/bitcoin.conf` has the necessary settings, for example:
```
server=1
whitelist=127.0.0.1
txindex=1
addressindex=1
timestampindex=1
spentindex=1
zmqpubrawtx=tcp://127.0.0.1:28332
zmqpubhashblock=tcp://127.0.0.1:28332
rpcallowip=127.0.0.1
rpcuser=bitcoin
rpcpassword=local321
```

From within the `devnode` directory with the configuration file, start the node:
```bash
../bch-node/bin/bch-node start
```