
const db = require('mysql');

const connection = db.createConnection({
    host : 'localhost',
    user : 'quintet',
    password : 'quintet',
    database : 'bookstore'
});

exports.execute = (sql,func) => {

    connection.query(sql, (error, results, fields) => {

        try {
            if(error) throw error;

            func(results);

        } catch (err) {
            console.error(err.message);
        } 

    });

}