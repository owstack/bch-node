'use strict';

var should = require('chai').should();

describe('Index Exports', function() {
  it('will export bch-lib', function() {
    var bchLib = require('../');
    should.exist(bchLib.lib);
    should.exist(bchLib.lib.Transaction);
    should.exist(bchLib.lib.Block);
  });
});
