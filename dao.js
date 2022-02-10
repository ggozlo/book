
const db = require('mysql');

exports.DAO =  class DAO{

    constructor(connectData) {
        // 나중엔 connectData 를 인수로...
        this.connection = db.createConnection({
            host : 'localhost',
            user : 'quintet',
            password : 'quintet',
            database : 'bookstore'
        });
    }

    // 쿼리 메서드
    execute (sql,task, callback) {

        return new Promise((resolve, reject) => {
            this.connection.query(sql, function(error, results, fields)  {

                try {
                    if(error) {throw error};
                    task.resultValue = results;
                    resolve(task);
                } catch (error) {
                    task.errorMessage = error.message;
                    reject(error);
                } 
            });
        });
    }

}





