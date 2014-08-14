'use strict';

var fs = require('fs');
var path = require('path');
var extend = require('extend');

module.exports = function (options, dir, date, cb) {
  if (!(date instanceof Date)) {
    cb = date;
    date = date ? date.valueOf() : Date.now();
  }
  cb = cb || function(){};

  var returnSqlOnly = false;
  if (options.returnSqlOnly) {
    returnSqlOnly = true;
    delete options.returnSqlOnly;
  }

  var files = [], sql = '';
  try {
    files = fs.readdirSync(dir)
    .filter(function (filename) {
      if (!filename.match(/\.sql$/i)) return false;
      var timestamp = Date.parse(filename.substring(0, 24));
      if (isNaN(timestamp) || timestamp < date) return false;
      return true;
    })
    sql = files.map(function (filename) {
      return fs.readFileSync(path.join(dir, filename), 'utf-8');
    })
    .reduce(function (r, sql) {
      return r + sql;
    }, '');
  } catch (err) {
    return cb(err);
  }

  if (!sql) {
    cb(null, sql, files);
  } else if (returnSqlOnly) {
    cb(null, sql, files);
  } else {
    var dbconnection = require('mysql').createConnection(extend(
          options,
          {multipleStatements: true}
        ));
    dbconnection.connect();
    dbconnection.query(sql);
    dbconnection.end(cb.bind(null, null, sql, files));
  }
}
