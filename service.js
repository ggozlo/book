const {DAO} = require('./dao');
const ev = require('events');



exports.Service =  class Service {

    constructor(dao) {
        // 나중엔 dao 를 받아서...
        this.dao = new DAO();
        this.events = ['clear', 'exit', 'save', 'show', 'modify', 'remove'];
    }

    clear(command, pId) {
        process.stdout.write("\u001b[2J\u001b[0;0H");
    };

    exit(command, pId) {
        process.exit();
    };

    // save 이벤트
    save(command, pId) {
        this.dao.execute(
            `INSERT INTO book_list
            (book_name, book_author, book_ISBN, book_publisher, publication_date ) 
            values ('${command[0]}','${command[1]}','${command[2]}','${command[3]}','${command[4]}');` ,
            () => { } 
            ,pId
        );
    };

    // show 이벤트
    show(command, pId) {
        const secondCommand = command.shift();
        const selectQuery = `SELECT 
            book_id,book_name, book_author, book_ISBN, book_publisher, date_format(publication_date, '%Y-%m-%d')
            FROM book_list`;

        if(secondCommand  === 'all' ) {
            this.dao.execute(selectQuery , showFunc ,pId);
        } else if(secondCommand === 'name') {
            this.dao.execute(selectQuery + ` WHERE book_name LIKE '%${command.shift()}%'`, showFunc ,pId);
        } else {
            console.error('잘못된 서브 커맨드 입니다.');
        }
    };

    // modify 이벤트
    modify(command, pId) { 
        
        targetCheck(command, pId)
        .then( (targetId) => {
            this.dao.execute(`
            UPDATE book_list SET 
                book_name = '${command[0]}',
                book_author = '${command[1]}',
                book_ISBN = '${command[2]}',
                book_publisher = '${command[3]}', 
                publication_date = '${command[4]}'
                WHERE book_id = ${targetId};`,
            (results) => {}
            ,pId);
        });
    };

    // remove 이벤트
    remove(command, pId) {
        const secondCommand = command.shift();
        if( secondCommand == 'all' ) {
            this.dao.execute(
                `truncate booK_list;`, 
                function (results) {}
                ,pId
            );
        } else if (secondCommand == 'id') {
            targetCheck(this.dao, command, pId)
            .then( (targetId) => {
                this.dao.execute(
                    `DELETE FROM book_list WHERE book_id = ${targetId} ;`,
                    (results) => {}
                    ,pId
                    );
            });
        } else {
            console.error(pId,'잘못된 서브 커맨드 입니다.');
        }
    };
}


// 공통 함수
function showFunc (results) {
    console.log(`|\t번호\t|\t제목\t|저자\t|\t출판사\t|\tISBN\t|\t출간일\t|`);
    console.log('=========================================================================================');
    for (const res of results) {
        console.log(`|\t${res.book_id}\t|${res.book_name}\t|${res.book_author}\t|${res.book_ISBN}\t|${res.book_publisher}\t|${res["date_format(publication_date, '%Y-%m-%d')"]}\t|`);
    }
}

function targetCheck(dao, command, pId)  {
    return new Promise((resolve) => {
        const targetId = command.shift();
        dao.execute( 
            `SELECT book_id FROM book_list WHERE book_id = ${targetId}`,
            (results) => {
                if (results.length === 0 ) throw new Error('대상이 없습니다!');
                resolve(targetId);
            },
            pId
        )
    });
}

