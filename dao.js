
const db = require('mysql');

const connection = db.createConnection({
    host : 'localhost',
    user : 'quintet',
    password : 'quintet',
    database : 'bookstore'
});

exports.execute = (sql,func,pId) => {

    connection.query(sql, (error, results, fields) => {

        try {
            if(error) throw error;

            func(results, pId);
            if(pId) {
                console.log(pId, 'task done');
            }
        } catch (err) {
            console.error(pId, err.message);
        } 
    });

}