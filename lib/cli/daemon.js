'use strict';

var program = require('commander');
var path = require('path');
var bch = require('..');

function main(servicesPath, additionalServices) {
  /* jshint maxstatements: 100 */

  var version = bch.version;
  var start = bch.scaffold.start;
  var findConfig = bch.scaffold.findConfig;
  var defaultConfig = bch.scaffold.defaultConfig;

  program
    .version(version)
    .description('Start the current node')
    .option('-c, --config <dir>', 'Specify the directory with Bch Node configuration');

  program.parse(process.argv);

  if (program.config) {
    program.config = path.resolve(process.cwd(), program.config);
  }
  var configInfo = findConfig(program.config || process.cwd());
  if (!configInfo) {
    configInfo = defaultConfig({
      additionalServices: additionalServices
    });
  }
  if (servicesPath) {
    configInfo.servicesPath = servicesPath;
  }
  start(configInfo);
}

module.exports = main;
