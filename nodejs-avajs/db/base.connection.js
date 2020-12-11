class BaseConnection {
    constructor(sqlName, addr, userName, pass, dbname, dbport) {
        this.sqlServer = require(sqlName);
        this.connection = this.connectDb(addr, userName, pass, dbname, dbport);
    }

    connectDb(addr, userName, pass, dbname, dbport) {
        return this.sqlServer.createConnection({
            host: addr,
            port: dbport,
            database: dbname,
            user: userName,
            password: pass,
        });
    }

    closeDb() {
        this.connection.end((err) => {
            if (err) {
                console.log(`Error on closing connection ${err}`);
            }
            console.log('Connection is closed');
        })
    }

    queryDb(sqlQuery) {
        this.connection.connect((err) => {
            if (err) throw err;
            console.log('Connected to db');
            this.connection.query(sqlQuery, ((err, result) => {
                if (err) throw err;
                console.log(result);
            }));
            this.closeDb();
        });
    }
}

exports.BaseConnection = BaseConnection;
