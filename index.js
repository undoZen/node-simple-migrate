'use strict';

var fs = require('fs');
var path = require('path');
var extend = require('extend');

module.exports = function (options, dir, date, cb) {
  if (!(date instanceof Date)) {
    cb = date;
    date = date || new Date;
  }
  cb = cb || function(){};
  var dbconnection = require('mysql').createConnection(extend(
        options,
        {multipleStatements: true}
      ));

  var returnSqlOnly = false;
  if (options.returnSqlOnly) {
    returnSqlOnly = true;
    delete options.returnSqlOnly;
  }

  var now = Date.now();
  var sql = '';
  try {
    sql = fs.readdirSync(dir)
    .filter(function (filename) {
      if (!filename.match(/\.sql$/i)) return false;
      var timestamp = Date.parse(filename.substring(0, 24));
      if (isNaN(timestamp) || timestamp < now) return false;
      return true;
    })
    .map(function (filename) {
      return fs.readFileSync(path.join(dir, filename), 'utf-8');
    })
    .reduce(function (r, sql) {
      return r + sql;
    }, '');
  } catch (err) {
    return cb(err);
  }

  if (returnSqlOnly) {
    cb(null, sql);
  } else {
    dbconnection.connect();
    dbconnection.query(sql);
    dbconnection.end(cb);
  }
}
