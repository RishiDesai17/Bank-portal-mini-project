const express = require('express')
const app = express()
const morgan = require('morgan')
const db = require('./db')
const fs = require('fs').promises
require('ejs')

app.set('view engine', 'ejs');
app.use(morgan('dev'))
app.use(express.static("public"));
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const userRoutes = require('./routes/users');

app.use('/users', userRoutes);

app.get("/customer", (req, res) => {
    res.render("index")
})

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