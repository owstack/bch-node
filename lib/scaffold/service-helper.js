'use strict';

function mapName(serviceName) {
	// Map alias to loadable module name.
  var serviceNameMap = {
    'explorer-api': 'bcccore-explorer-api'
  };
  return serviceNameMap[serviceName] || serviceName;
}

module.exports.mapName = mapName;
