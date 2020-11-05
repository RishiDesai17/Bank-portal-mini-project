const db = require('../db')

exports.customerPage = (req, res) => {
    const { id } = req.params
    db.query(`SELECT Username, Name, Address FROM Customer WHERE Customer_id=${id}`, (err, rows) => {
        if(err){
            console.log(err)
            return
        }
        if(rows.length === 0){
            res.redirect("404")
            return
        }
        res.render("customer", {
            customer: rows[0]
        })
    })
}

exports.customerAccounts = (req, res) => {
    const { id } = req.params
    db.query(`
        SELECT Account.account_no, Account.Balance FROM Account
        INNER JOIN customer_account
        ON Account.account_no = customer_account.Account
        WHERE customer_account.Customer = ${id}
    `, (err, rows) => {
        if(err){
            console.log(err)
            return
        }
        console.log(rows)
        res.render("account", {
            accounts: rows
        })
    })
}