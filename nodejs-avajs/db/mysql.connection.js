const { BaseConnection } = require('./base.connection');

class MySQL extends BaseConnection {
  constructor(addr, user, password, dbname = 'sampledb', dbport = '3308') {
    super('mysql', addr, user, password, dbname, dbport);
  }
}

exports.MySQL = MySQL;
