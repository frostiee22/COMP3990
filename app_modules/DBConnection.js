var mysql = require("mysql"),
    connection,
    status;

//local database
// connection = mysql.createConnection({
//    host: "localhost",
//    user: "drainage",
//    password: "drainage",
//    database: "drainage"
// });


// online database
connection = mysql.createConnection({
    host: "www.db4free.net",
    user: "softeng",
    password: "softeng",
    database: "softeng"
});

connection.connect(function (err) {
    if (err) {
        status = ("Error Connecting to the server: " + err.stack);
    } else {
        status = ("Successfully connected to the database");
    }
});

function returnDBConnection() {
    return connection;
}

function returnStatus() {
    return status;
}

module.exports = {
    'returnDBConnection': returnDBConnection,
    'returnStatus': returnStatus
};
