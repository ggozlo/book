const {Service} = require('./Service');
const {Task} = require('./Task');
const {DAO} = require('./DAO');

const dao = new DAO({
    host : 'ggozlo-db.csnyyl3espcx.ap-northeast-2.rds.amazonaws.com',
    user : 'ggozlo',
    password : 'ggozlo1133',
    database : 'BookStoreDB'
});
const service = new Service(dao);


exports.handler = async (event) => {
    

    let line = event.queryStringParameters.subCommand;
    line += ' ' + event.multiValueQueryStringParameters.params.join(' ');

    const task = new Task(line);

    let data = new Promise((resolve, reject) => {
        try{
            service.show(task)
            .then((result) => {
                 const obj =  {
                    statusCode: 200,
                    body: JSON.stringify(result)

                }; 
                resolve(obj);
            })
            .catch((error) => {
                reject(error);
            });

        } catch (error) {
            reject(error);
        }
    })

    return data
};

