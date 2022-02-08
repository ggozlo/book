const readline = require('readline');
const ev = require('events');
const dao = require('./dao');

const emitter = new ev();
const reader = readline.createInterface({
    input : process.stdin,
    output : process.stdout
});

let events = ['clear', 'exit', 'save', 'show']

reader.on('line', (line) => {

    let command = line.split(" ");
    let head = command.shift();

    for (const keyword of events) {
        if(keyword==head) {
            emitter.emit(keyword, command);
            break;
        }
    };

});

emitter.on(events[0], () => {
    process.stdout.write("\u001b[2J\u001b[0;0H");
});
emitter.on(events[1], ()=> {
    process.exit();
});
emitter.on(events[2], (command)=> {
    dao.saveBook( 
        {
            name : command[0],
            author : command[1], 
            publisher : command[2], 
            ISBN : command[3], 
            publication_date : command[4] 
        } 
    );
});
emitter.on(events[3], (command)=>{
    if( command.shift() == 'all' ) {
        dao.showAll();
    }
});