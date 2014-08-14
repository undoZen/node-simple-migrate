'use strict';

var assert = require('assert');
var m = require('../');

describe('simple-migrate', function () {
  it('return sql after now', function (done) {
    m({returnSqlOnly: true}, __dirname + '/migration', new Date('2014-08-09T13:30:00.000Z'), function (err, sql, files) {
      if (err) console.error(err.stack);
      assert(!err);
      assert.deepEqual(files, [ '2014-08-09T14:00:00.000Z.sql' ]);
      assert.equal(sql.trim(), '/* test sql 2 */');
      done();
    });
  });
});
