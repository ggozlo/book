const {DAO} = require('./dao');

exports.Service =  class Service {

    constructor(dao) {
        // 나중엔 dao 를 받아서...
        this.dao = new DAO();
        this.events = ['clear', 'exit', 'save', 'show', 'modify', 'remove'];
    }

    clear(task) {
        process.stdout.write("\u001b[2J\u001b[0;0H");
    };

    exit(task) {
        process.exit();
    };

    // save 이벤트
    save(task) {
        this.dao.execute(
            `INSERT INTO book_list
            (book_name, book_author, book_ISBN, book_publisher, publication_date ) 
            values ('${task.command[0]}','${task.command[1]}','${task.command[2]}','${task.command[3]}','${task.command[4]}');` , 
            task);
    };

    // show 이벤트
    show(task) {
        const secondCommand = task.shiftCommand();
        const selectQuery = `SELECT 
            book_id,book_name, book_author, book_ISBN, book_publisher, date_format(publication_date, '%Y-%m-%d')
            FROM book_list`;

        if(secondCommand  === 'all' ) {
            return this.dao.execute(selectQuery ,task);
        } else if(secondCommand === 'name') {
            return this.dao.execute(selectQuery + ` WHERE book_name LIKE '%${task.command.shift()}%'` ,task);
        } else {
            return new Promise((resolve, reject)=> {
                reject( new Error(task.pId +' 잘못된 서브 커맨드 입니다.'))
            })
        }
        
    };

    // modify 이벤트
    modify(task) { 
        
        targetCheck(task)
        .then( (targetId) => {
            this.dao.execute(`
            UPDATE book_list SET 
                book_name = '${command[0]}',
                book_author = '${command[1]}',
                book_ISBN = '${command[2]}',
                book_publisher = '${command[3]}', 
                publication_date = '${command[4]}'
                WHERE book_id = ${targetId};` ,
            task);
        });
    };

    // remove 이벤트
    remove(task) {
        const secondCommand = task.shiftCommand();
        if( secondCommand == 'all' ) {
            this.dao.execute(
                `truncate booK_list;`, 
                function (results) {}
                ,task
            );
        } else if (secondCommand == 'id') {
            targetCheck(this.dao, task)
            .then( (targetId) => {
                this.dao.execute(
                    `DELETE FROM book_list WHERE book_id = ${targetId} ;`,
                    (results) => {}
                    ,task
                    );
            });
        } else {
            console.error(task,'잘못된 서브 커맨드 입니다.');
        }
    };
}




function targetCheck(dao, task)  {
    return new Promise((resolve) => {
        const targetId = command.shift();
        dao.execute( 
            `SELECT book_id FROM book_list WHERE book_id = ${targetId}`,
            task, 
            (results) => {
                if (results.length === 0 ) throw new Error('대상이 없습니다!');
                resolve(targetId);
            }
        )
    });
}

