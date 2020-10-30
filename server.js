const express = require('express')
const app = express()
const db = require('./db')
const fs = require('fs').promises
require('ejs')

app.set('view engine', 'ejs');
app.use(express.static("public"));

const init = async() => {
    try{
        let queries = await fs.readFile('./db/schema.sql', 'utf-8')
        queries = queries.replace(/\r|\n/g, '').split(";")
        queries.pop()
        for(query of queries){
            db.query(query, err => {
                if(err){
                    console.log(err)
                    return;
                }
            })
        }
    }
    catch(error){
        console.log(error)
    }
}

const port = 3002
init().then(() => {
    app.listen(port, () => {
        console.log("Server running on port 3002")
    })
})