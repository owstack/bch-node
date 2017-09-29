'use strict';

var should = require('chai').should();

describe('Index Exports', function() {
  it('will export bch-lib', function() {
    var bch = require('../');
    should.exist(bch.lib);
    should.exist(bch.lib.Transaction);
    should.exist(bch.lib.Block);
  });
});
