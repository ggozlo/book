const readline = require('readline');
const {Service} = require('./service');
const {v4} = require('uuid');

const service = new Service();

const reader = readline.createInterface({
    input : process.stdin,
    output : process.stdout
});

reader.on('line', (line) => {

    const pId = '['+v4().substring(0,8)+']';
    const command = line.split(" ");
    let head = command.shift();
    let flag = true;

    console.log(pId, line);

    for (const keyword of service.events) {
        if(keyword==head) {
            
            service[keyword](command, pId);
            flag = false;
            break;
        }
    };
    if(flag) {
        console.log(pId,'잘못된 커맨드 입니다.');
    }
});
