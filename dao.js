
const db = require('mysql');
const readline = require('readline');


const connection = db.createConnection({
    host : 'localhost',
    user : 'quintet',
    password : 'quintet',
    database : 'bookstore'
});


exports.saveBook = function(data) {
        console.log(data);
        connection.query(`INSERT INTO book_list
                    (book_name, book_author, book_ISBN, book_publisher, publication_date ) 
                    values ('${data.name}','${data.author}','${data.publisher}','${data.ISBN}','${data.publication_date}');`,
                    (error, results, fields) => {
                        try {
                        if(error) throw error;
                        } catch (err) {
                            console.error(err.code);
                        }
                    });
} 

exports.showAll = () => {

    connection.query(`SELECT 
        book_name, book_author, book_ISBN, book_publisher, date_format(publication_date, '%Y-%m-%d')
        FROM book_list`, 
    (error, results) => {
        try {
            if(error) throw error;

            console.log(`|제목  |저자   |출판사   |ISBN     |출간일	|`);
            console.log('======================================');
            for (const res of results) {
                 console.log(`|${res.book_name}|${res.book_author}|${res.book_ISBN}|${res.book_publisher}|${res["date_format(publication_date, '%Y-%m-%d')"]}|`);
            }

        } catch (err) {
            console.error(err.code);
        } 
    });

}