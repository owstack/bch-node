'use strict';

var createError = require('errno').create;

var BcccoreNodeError = createError('BcccoreNodeError');

var RPCError = createError('RPCError', BcccoreNodeError);

module.exports = {
  Error: BcccoreNodeError,
  RPCError: RPCError
};
