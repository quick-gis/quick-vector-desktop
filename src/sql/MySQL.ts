const mysql = require('mysql');

interface ConnectionConfig {
  host: string;
  port: number | null;
  username: string;
  password: string;
  dbName: string;
}

function create(paramn: ConnectionConfig) {
  return mysql.createConnection({
    host: paramn.host,
    user: paramn.username,
    password: paramn.password,
    database: paramn.dbName,
    port: paramn.port ? paramn.port : 3306,
  });
}

function main() {
  var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root123@',
    port: '3306',
    database: 'mysql',
  });

  connection.connect();

  var sql = 'SELECT * from user';

  //查
  connection.query(sql, function (err: any, row: any, field: any) {
    if (err) {
      console.log('[SELECT ERROR] - ', err.message);
      return;
    }

    console.log('--------------------------SELECT----------------------------');

    Object.keys(row).forEach(function (key) {
      var row1 = row[key];
      console.log(row1);
    });
    console.log('------------------------------------------------------------\n\n');
  });

  connection.end();

  var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root123@',
    port: '3306',
    database: 'mysql',
  });
  pool.getConnection(function (e: any, c: any) {
    c.query('SELECT * from user', function (err: any, row: any, field: any) {
      if (err) {
        console.log('[SELECT ERROR] - ', err.message);
        return;
      }

      console.log('--------------------------SELECT----------------------------');

      Object.keys(row).forEach(function (key) {
        var row1 = row[key];
        console.log(row1);
      });
      console.log('------------------------------------------------------------\n\n');
    });
  });
}

main();
