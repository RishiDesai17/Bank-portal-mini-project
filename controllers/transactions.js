const db =  require('../db')

exports.customerTransactions = (req, res) => {
    const { customer } = req.params
    db.query(`
        SELECT * FROM Transaction
        WHERE AccountFrom IN (SELECT Account from Customer_Account WHERE Customer = ${customer})
        OR AccountTo IN (SELECT Account from Customer_Account WHERE Customer = ${customer})`,
    (err, transactions) => {
        if(err){
            console.log(err)
            return
        }
        console.log(transactions)
        res.render("transaction", {
            transactions
        })
    })
}

exports.transactionsPage = (req, res) => {
    res.render("transfer")
}

exports.transaction = (req, res) => {
    const { account } = req.params
    const { accountTo, amount } = req.body
    console.log(accountTo, amount)
    db.query(`INSERT INTO Transaction(Amount,AccountFrom,AccountTo,Timestamp) VALUES(${amount},${account},${accountTo},"${new Date().toISOString()}")`, (err, row) => {
        if(err){
            console.log(err)
            res.render("transfer", {
                message: err.code    
            })
            return
        }
        res.render("transfer", {
            message: "Transfer Successful"    
        })
    })
}

exports.filterByTime = (req, res) => {
    const { customer } = req.params
    const { start, end } = req.body
    db.query(`
        SELECT * FROM Transaction
        WHERE (AccountFrom IN (SELECT Account from Customer_Account WHERE Customer = ${customer}) 
        OR AccountTo IN (SELECT Account from Customer_Account WHERE Customer = ${customer}))
        AND (Timestamp >= "${start}" AND Timestamp <= "${end}")
    `, (err, transactions) => {
        if(err){
            console.log(err)
            return;
        }
        console.log(transactions)
        res.json({
            transactions
        })
    })
}