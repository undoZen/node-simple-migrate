'use strict';

var assert = require('assert');
var m = require('../');

describe('simple-migrate', function () {
  it('return sql after now', function (done) {
    m({returnSqlOnly: true}, __dirname + '/migration', new Date('2014-08-09T13:30:00.000Z'), function (err, sql) {
      if (err) console.error(err.stack);
      assert(!err);
      assert.equal('/* test sql 2 */', sql.trim());
      done();
    });
  });
});
