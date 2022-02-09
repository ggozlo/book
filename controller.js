const readline = require('readline');
const {events, emitter} = require('./service');


const reader = readline.createInterface({
    input : process.stdin,
    output : process.stdout
});

reader.on('line', (line) => {

    const command = line.split(" ");
    let head = command.shift();
    let flag = true;

    for (const keyword of events) {
        if(keyword==head) {
            emitter.emit(keyword, command);
            flag = false;
            break;
        }
    };
    if(flag) {
        console.log('잘못된 커맨드 입니다.');
    }
});
