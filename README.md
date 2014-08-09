node-simple-migrate
===================

用于 CI 上 MySQL 数据库做 migration 的库，我想的策略非常简单：你在 `migration/` 目录下以 `Date#toISOString()` 格式储存 sql 代码文件，如

    2014-08-09T12:00:00.000Z.sql
    2014-08-09T13:00:00.000Z.sql

假设当前时间是 `2014-08-09T12:50:00.000Z` 左右（可以在 JavaScript console 里面运行 `(new Date).toISOString()` 获取），就把此次需要修改数据库的代码写到如 `2014-08-09T13:00:00.000Z.sql` 这样的文件里，时间稍微推后一点点。推到 CI 之后，CI 运行 `simple-migrate`，会在这个目录里比较当前时间，运行文件名表示为未来时间点的 sql 语句，过几分钟后时间走过这个时间点，下次再有代码推送到 CI 的时候，就不会再运行这些 sql 代码了。

##Installation

    npm install --save simple-migrate

##Usage

    ./node_modules/.bin/simple-migrate

#Lisence
MIT
