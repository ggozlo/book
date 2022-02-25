exports.Service =  class Service {

    constructor(dao) {
        this.dao = dao
    }

    // show 메서드
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
                reject( new Error(' 잘못된 서브 커맨드 입니다.'))
            }
            // 여기서 데이터 가공...
            resolve(selectResult);
        })
    };

}
// 공통함수
function targetCheck(dao, task)  {
    
    return new Promise((resolve) => {
        let checkResult = dao.execute(`
            SELECT book_id FROM book_list 
                WHERE book_id = ${task.command[0]};`,task);
        resolve(checkResult);
    });
}

