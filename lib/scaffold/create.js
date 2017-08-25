'use strict';

var spawn = require('child_process').spawn;
var bcccore = require('bcccore-lib');
var async = require('async');
var $ = bcccore.util.preconditions;
var _ = bcccore.deps._;
var path = require('path');
var packageFile = require('../../package.json');
var mkdirp = require('mkdirp');
var fs = require('fs');
var defaultBaseConfig = require('./default-base-config');

var version = '^' + packageFile.version;

var BASE_PACKAGE = {
  description: 'A full Bitcoin node build with Bcccore',
  repository: 'https://github.com/user/project',
  license: 'MIT',
  readme: 'README.md',
  dependencies: {
    // 'bcccore-lib': '^' + bcccore.version,
    // 'bcccore-node': version
    'bcccore-lib': 'owstack/bcccore-lib',
    'bcccore-node': 'owstack/bcccore-node'
  }
};

/**
 * Will create a directory and bitcoin.conf file for Bitcoin.
 * @param {String} dataDir - The absolute path
 * @param {Function} done - The callback function called when finished
 */
function createBitcoinDirectory(datadir, done) {
  mkdirp(datadir, function(err) {
    if (err) {
      throw err;
    }

    done();

    // Don't create the configuration yet
  });
}

/**
 * Will create a base Bcccore Node configuration directory and files.
 * @param {Object} options
 * @param {String} options.network - "testnet/bcc" or "livenet/bcc"
 * @param {String} options.datadir - The bitcoin database directory
 * @param {String} configDir - The absolute path
 * @param {Boolean} isGlobal - If the configuration depends on globally installed node services.
 * @param {Function} done - The callback function called when finished
 */
function createConfigDirectory(options, configDir, isGlobal, done) {
  mkdirp(configDir, function(err) {
    if (err) {
      throw err;
    }
    var configInfo = defaultBaseConfig(options);
    var config = configInfo.config;

    var configJSON = JSON.stringify(config, null, 2);
    var packageJSON = JSON.stringify(BASE_PACKAGE, null, 2);
    try {
      fs.writeFileSync(configDir + '/bcccore-node.json', configJSON);
      if (!isGlobal) {
        fs.writeFileSync(configDir + '/package.json', packageJSON);
      }
    } catch(e) {
      done(e);
    }
    done();

  });
}

/**
 * Will setup a directory with a Bcccore Node directory, configuration file,
 * bitcoin configuration, and will install all necessary dependencies.
 *
 * @param {Object} options
 * @param {String} options.cwd - The current working directory
 * @param {String} options.dirname - The name of the bcccore node configuration directory
 * @param {String} options.datadir - The path to the bitcoin datadir
 * @param {Function} done - A callback function called when finished
 */
function create(options, done) {
  /* jshint maxstatements:20 */

  $.checkArgument(_.isObject(options));
  $.checkArgument(_.isFunction(done));
  $.checkArgument(_.isString(options.cwd));
  $.checkArgument(_.isString(options.dirname));
  $.checkArgument(_.isBoolean(options.isGlobal));
  $.checkArgument(_.isString(options.datadir));

  var cwd = options.cwd;
  var dirname = options.dirname;
  var datadir = options.datadir;
  var isGlobal = options.isGlobal;

  var absConfigDir = path.resolve(cwd, dirname);
  var absDataDir = path.resolve(absConfigDir, datadir);

  async.series([
    function(next) {
      // Setup the the bcccore-node directory and configuration
      if (!fs.existsSync(absConfigDir)) {
        var createOptions = {
          network: options.network,
          datadir: datadir
        };
        createConfigDirectory(createOptions, absConfigDir, isGlobal, next);
      } else {
        next(new Error('Directory "' + absConfigDir+ '" already exists.'));
      }
    },
    function(next) {
      // Setup the bitcoin directory and configuration
      if (!fs.existsSync(absDataDir)) {
        createBitcoinDirectory(absDataDir, next);
      } else {
        next();
      }
    },
    function(next) {
      // Install all of the necessary dependencies
      if (!isGlobal) {
        var npm = spawn('npm', ['install'], {cwd: absConfigDir});

        npm.stdout.on('data', function (data) {
          process.stdout.write(data);
        });

        npm.stderr.on('data', function (data) {
          process.stderr.write(data);
        });

        npm.on('close', function (code) {
          if (code !== 0) {
            return next(new Error('There was an error installing dependencies.'));
          } else {
            return next();
          }
        });

      } else {
        next();
      }
    }
  ], done);

}

module.exports = create;
