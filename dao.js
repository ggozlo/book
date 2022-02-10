
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

    execute (sql,func,pId) {

        this.connection.query(sql, (error, results, fields) => {
    
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

}





