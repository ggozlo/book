const readline = require('readline');
const {Service} = require('./service');
const {v4} = require('uuid');

const service = new Service();

exports.Controller =  class Controller {

    constructor(service) {
        // 나중엔 매개변수로....
        this.service = new Service(); 
        this.reader = readline.createInterface({
            input : process.stdin,
            output : process.stdout
        });
    }

    listen() {
        this.reader.on('line', (line) => {
            const task = new Task(line);
            console.time(task.pId);
            let flag = true;

            const head = task.shiftCommand();
            for (const keyword of service.events) {
                if(keyword == head) {
                    
                    service[keyword](task)
                        .then((result) => {
                            if (result.taskCommand[0] === 'show') {
                                showFunc(result.resultValue);
                                console.log(result.pId, 'task done');
                            } else {
                                console.log(result.pId, 'task done');
                            }
                            console.timeEnd(result.pId);
                        })
                        .catch((error) => {
                            throw error;
                        });
                    
                    flag = false;
                    break;
                }
            };

            if(flag) {
                console.log(task.pId,'잘못된 커맨드 입니다.');
            }

        });
    }
}



function showFunc (results) {
    console.log(`|\t번호\t|\t제목\t|저자\t|\t출판사\t|\tISBN\t|\t출간일\t|`);
    console.log('=========================================================================================');
    for (const res of results) {
        console.log(`|\t${res.book_id}\t|${res.book_name}\t|${res.book_author}\t|${res.book_ISBN}\t|${res.book_publisher}\t|${res["date_format(publication_date, '%Y-%m-%d')"]}\t|`);
    }
}

class Task{

    constructor(line) {
        this.resultValue = null;
        this.pId = '['+v4().substring(0,8)+']';
        this.command = line.split(" ");
        this.taskCommand = [];
    }

    shiftCommand() {
        let head =  this.command.shift();
        this.taskCommand.push(head);
        return head;
    }

    

}

const controller = new this.Controller();
controller.listen();
