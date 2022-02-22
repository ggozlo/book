const readline = require('readline');
const {Task}  =require('./Task');


exports.Controller =  class Controller {

    constructor(service) {
        this.service =service;
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

            try{

                const head = task.shiftCommand();
                for (const keyword of this.service.events) {
                    if(keyword == head) {
                            this.service[keyword](task)
                            .then((result) => {
                                if (result.taskCommand[0] === 'show') {
                                    showFunc(result.resultValue);
                                    console.log(result.pId, 'task done');
                                } else {
                                    console.log(result.pId, `task done`);
                                }
                                console.timeEnd(result.pId);
                            })
                            .catch((error) => {
                                console.error(task.pId, error.message);
                                console.timeEnd(task.pId);
                            });
                        
                        flag = false;
                        break;
                    }
                };

            if(flag) {
                throw new Error('잘못된 커맨드 입니다.');
            }
            } catch (error) {
                console.error(task.pId, error.message);
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

