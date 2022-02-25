const db = require('mysql');

exports.DAO =  class DAO{
    constructor(connectData) {
        this.connection = db.createConnection(connectData);
    }
    // 쿼리 메서드
    execute (sql,task) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, function(error, results, fields)  {
                try {
                    if(error) {throw error};
                    task.resultValue = results;
                    resolve(task);
                } catch (error) {
                    reject(error);
                } 
            });
        });
    }
   
}





