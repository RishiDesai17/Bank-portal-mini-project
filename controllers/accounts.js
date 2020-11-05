const db =  require('../db')

exports.getOneAccount = async(req, res) => {
    try{
        const { id } = req.params
        db.query(`
            SELECT Account.Account_no, Account.Balance, Branch.Address, Bank.Name FROM Account
            INNER JOIN Branch
            ON Branch.Branch_id = Account.Branch
            INNER JOIN Bank
            ON Bank.Bank_code = Branch.Branch_id
            WHERE Account_no=${id}
        `, (err, accountInfo) => {
            if(err){
                console.log(err)
                return
            }
            console.log(accountInfo)
            db.query(`
                SELECT * FROM Transaction
                WHERE Account = ${id}
            `, (err, transactions) => {
                if(err){
                    console.log(err)
                    return
                }
                console.log(transactions)
                res.render("accountDetails", {
                    account: accountInfo[0],
                    transactions
                })
            })
        })
    }
    catch(err){
        console.log(err)
    }
}