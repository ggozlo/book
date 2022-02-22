exports.Service =  class Service {

    constructor(dao) {
        this.dao = dao;
        this.events = ['clear', 'exit', 'save', 'show', 'modify', 'remove'];
    }

    clear(task) {
        return new Promise((resolve, reject) => {
            process.stdout.write("\u001b[2J\u001b[0;0H");
            resolve(task);
        });
        
    };

    exit(task) {
        return new Promise((resolve, reject) => {
            process.exit();
        });
        
    };

    // save 이벤트
    save(task) {

        return new Promise((resolve, reject) => {
            const insertResult = this.dao.execute(
                `INSERT INTO book_list
                (book_name, book_author, book_ISBN, book_publisher, publication_date ) 
                values ('${task.command[0]}','${task.command[1]}','${task.command[2]}'
                ,'${task.command[3]}','${task.command[4]}');` , 
                task);
            resolve(insertResult);
        });
    };

    // show 이벤트
    show(task) {
        const secondCommand = task.shiftCommand();
        const selectQuery = `SELECT 
            book_id,book_name, book_author, book_ISBN, book_publisher,
             date_format(publication_date, '%Y-%m-%d')
            FROM book_list`;
        return new Promise((resolve, reject) => {
            let selectResult;
            if(secondCommand  === 'all' ) {
                selectResult = this.dao.execute(selectQuery ,task);
            } else if(secondCommand === 'name') {
                selectResult = this.dao.execute(
                    selectQuery + ` WHERE book_name LIKE '%${task.shiftCommand()}%'` ,task);
            } else { 
                reject( new Error(task.pId +' 잘못된 서브 커맨드 입니다.'))
            }
            // 여기서 데이터 가공...
            resolve(selectResult);
        })
    };

    // modify 이벤트
    modify(task) { 

        return new Promise((resolve, reject) => {
        
            targetCheck(this.dao,task)
            .then( (task) => {
                this.dao.execute(`
                    UPDATE book_list SET 
                        book_name = '${task.command[1]}',
                        book_author = '${task.command[2]}',
                        book_ISBN = '${task.command[3]}',
                        book_publisher = '${task.command[4]}', 
                        publication_date = '${task.command[5]}'
                        WHERE book_id = ${task.command[0]};` ,
                        task)
                    .then((task) => {
                        // 여기서 데이터 가공... 
                        resolve(task);
                    });
                
            });
        });
    };

    // remove 메소드
    remove(task) {
        const secondCommand = task.shiftCommand();
        return new Promise((resolve, reject) => {
            
            if( secondCommand == 'all' ) {
                resolve(this.dao.execute(`truncate booK_list;` ,task ));
            } else if (secondCommand == 'id') {
                targetCheck(this.dao, task)
                .then( (task) => {
                    resolve(this.dao.execute(`
                        DELETE FROM book_list
                            WHERE book_id = ${task.command[0]} ;` ,task ));
                });
            } else {
                task.message = '잘못된 서브 커맨드 입니다!.';
                reject(task);
            }
        });
    };
}
// 공통함수
function targetCheck(dao, task)  {
    
    return new Promise((resolve) => {
        checkResult = dao.execute(`
            SELECT book_id FROM book_list 
                WHERE book_id = ${task.command[0]};`,task);
        resolve(checkResult);
    });
}

