const db =  require('../db')

exports.getOneAccount = async(req, res) => {
    try{
        const { id } = req.params
        db.query(`
            SELECT Account.Account_no, Account.Balance, Branch.Name AS BranchName, Bank.Name AS BankName
            FROM Account
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
                WHERE AccountFrom = ${id} OR AccountTo = ${id}
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

exports.getBankAccountsPage = (req, res) => {
    res.render("searchAccounts")
}

exports.getBankAccounts = (req, res) => {
    const { bank } = req.params
    const { name } = req.body
    db.query(`
        SELECT Account.Account_no, Account.Balance, Customer.Name FROM Account
        INNER JOIN Customer_account
        ON Account.Account_no = Customer_Account.Account
        INNER JOIN Customer
        ON Customer.Customer_id = Customer_Account.Customer 
        WHERE Customer.Name LIKE CONCAT ("%", "${name}", "%") AND
        Account.Branch IN (SELECT Branch_id FROM Branch WHERE Bank = ${bank})
    `, (err, accounts) => {
        if(err){
            console.log(err)
            return
        }
        console.log(accounts)
        res.render("searchAccounts", {
            accounts
        })
    })
}

exports.createAccount = (req, res) => {
    const {  } = req.body
}