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
            ON Bank.Bank_code = Branch.Bank
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

exports.createAccountPage = (req, res) => {
    db.query(`
        SELECT Branch.Branch_id, Branch.Name as BranchName, Branch.Bank, Bank.Name as BankName
        FROM Branch
        INNER JOIN Bank
        ON Branch.Bank = Bank.bank_code
    `, (err, branches) => {
        if(err){
            console.log(err)
            return res.render("loanRequest", {
                message: "Something went wrong"
            }) 
        }
        console.log(branches)
        res.render("createAccount", {
            branches
        })
    })
}

exports.createAccount = (req, res) => {
    const { customer } = req.params
    const { type, branch } = req.body
    db.beginTransaction(() => {
        db.query(`INSERT INTO Account(Balance, Branch) VALUES(${5000}, ${branch})`, (err, row) => {
            if(err){
                console.log(err)
                db.rollback()
                return;
            }
            console.log(row)
            const accountId = row.insertId
            db.query(`INSERT INTO Customer_Account VALUES(${customer}, ${accountId})`, (err, row) => {
                if(err){
                    console.log(err)
                    db.rollback()
                    return;
                }
                if(type === "saving"){
                    db.query(`INSERT INTO savingacc VALUES(${accountId}, ${2})`, (err, row) => {
                        if(err){
                            console.log(err)
                            db.rollback()
                            return;
                        }
                        console.log(row)
                        db.commit()
                        res.send("Account successfully created")
                    })
                }
                else{
                    db.query(`INSERT INTO currentacc VALUES(${accountId}, ${5000})`, (err, row) => {
                        if(err){
                            console.log(err)
                            db.rollback()
                            return;
                        }
                        console.log(row)
                        db.commit()
                        res.send("Account successfully created")
                    })
                }
            })
        })
    })
}