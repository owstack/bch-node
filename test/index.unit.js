'use strict';

var should = require('chai').should();

describe('Index Exports', function() {
  it('will export bcccore-lib', function() {
    var bcccore = require('../');
    should.exist(bcccore.lib);
    should.exist(bcccore.lib.Transaction);
    should.exist(bcccore.lib.Block);
  });
});
