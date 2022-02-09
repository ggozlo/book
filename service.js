const dao = require('./dao');
const ev = require('events');
const { rejects } = require('assert');

let emitter = new ev();

// 이벤트 키워드
let events = ['clear', 'exit', 'save', 'show', 'modify', 'remove'];

// 모듈 export
exports.events = events;
exports.emitter = emitter;


// 공통 함수
const showFunc = function (results) {
    console.log(`|\t번호\t|\t제목\t|저자\t|\t출판사\t|\tISBN\t|\t출간일\t|`);
    console.log('=========================================================================================');
    for (const res of results) {
     console.log(`|\t${res.book_id}\t|${res.book_name}\t|${res.book_author}\t|${res.book_ISBN}\t|${res.book_publisher}\t|${res["date_format(publication_date, '%Y-%m-%d')"]}\t|`);
    }
}
const targetCheck = (command) => {
    return new Promise((resolve) => {
        const targetId = command.shift();
        dao.execute( 
            `SELECT book_id FROM book_list WHERE book_id = ${targetId}`,
            (results) => {
                 if (results.length === 0 ) throw new Error('대상이 없습니다!');
                 resolve(targetId);
            }
        );
    });
}


// 이벤트 목록
emitter.on(events[0], () => {
    process.stdout.write("\u001b[2J\u001b[0;0H");
});
emitter.on(events[1], ()=> {
    process.exit();
});

emitter.on(events[2], (command)=> {

    dao.execute(
        `INSERT INTO book_list
        (book_name, book_author, book_ISBN, book_publisher, publication_date ) 
        values ('${command[0]}','${command[1]}','${command[2]}','${command[3]}','${command[4]}');` ,

        () => {console.log('save complete!');} 
    );

});

// show 이벤트
emitter.on(events[3], (command)=>{
    secondCommand = command.shift();
    const selectQuery = `SELECT 
        book_id,book_name, book_author, book_ISBN, book_publisher, date_format(publication_date, '%Y-%m-%d')
        FROM book_list`;

    if(secondCommand  === 'all' ) {
        dao.execute(selectQuery , showFunc);
    } else if(secondCommand === 'name') {
        dao.execute( selectQuery + ` WHERE book_name LIKE '%${command.shift()}%'`, showFunc);
    } else {
        console.log('잘못된 커맨드 입니다.');
    }
});

// modify 이벤트
emitter.on(events[4], (command) => { 
    
    targetCheck(command)
    .then( (targetId) => {
        dao.execute(`
        UPDATE book_list SET 
            book_name = '${command[0]}',
            book_author = '${command[1]}',
            book_ISBN = '${command[2]}',
            book_publisher = '${command[3]}', 
            publication_date = '${command[4]}'
            WHERE book_id = ${targetId};`,
        (results) => {
            console.log(`${targetId}번 데이터가 수정되었습니다.`);
        });
    });

});

// remove 이벤트
emitter.on(events[5], (command) => {
    const secondCommand = command.shift();
    if( secondCommand == 'all' ) {
        dao.execute(
            `truncate booK_list;`, 
            function (results) {
                console.log(`전부 삭제되었습니다.`);
            });
    } else if (secondCommand == 'id') {
        targetCheck(command)
        .then( (targetId) => {
            dao.execute(
                `DELETE FROM book_list WHERE book_id = ${targetId} ;`,
                (results) => { console.log(`${targetId}번 데이터가 삭제 되었습니다.`);}
            );
        });
    } else {
        console.log('잘못된 커맨드 입니다!');
    }
});




