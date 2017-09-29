'use strict';

var createError = require('errno').create;

var BchNodeError = createError('BchNodeError');

var RPCError = createError('RPCError', BchNodeError);

module.exports = {
  Error: BchNodeError,
  RPCError: RPCError
};
