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
const customerRoutes = require('./routes/customers');
const accountRoutes = require('./routes/accounts');
const transactionRoutes = require('./routes/transactions');

app.use('/users', userRoutes);
app.use('/customers', customerRoutes);
app.use('/accounts', accountRoutes);
app.use('/transactions', transactionRoutes);

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