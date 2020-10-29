const mysql = require('mysql')

const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'bank'
})

connection.connect(err => {
    if(err){
        console.log(err)
    }
    else{
        console.log("MySQL connected")
    }
});

module.exports = connection