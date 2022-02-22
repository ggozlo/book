const {Service} = require('./Service');
const {Controller} = require('./Controller');
const {DAO} = require('./DAO');

const dao = new DAO({
    host : 'localhost',
    user : 'quintet',
    password : 'quintet',
    database : 'bookstore'
});
const service = new Service(dao);
const controllr = new Controller(service);

controllr.listen();