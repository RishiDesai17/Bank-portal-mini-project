const db = require('../db')

exports.loansPage = (req, res) => {
    const { customer } = req.params
    db.query(`
        SELECT Loan.Loan_id, Loan.Amount, Loan.Interest, Loan.Accepted
        FROM Loan
        INNER JOIN Customer_Loan
        ON (Customer, Loan) = (${customer}, Loan.Loan_id)
    `, (err, loans) => {
        if(err){
            console.log(err)
            return res.render("loans", {
                message: "Something went wrong"
            })
        }
        console.log(loans)
        res.render("loans", {
            loans
        })
    })
}

exports.requestLoanPage = (req, res) => {
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
        res.render("loanRequest", {
            branches
        })
    })
}

exports.requestLoan = (req, res) => {
    const { customer } = req.params
    const { amount, branch } = req.body
    // interest editable by bank(0 when customer requests for loan)
    db.beginTransaction(() => {
        db.query(`INSERT INTO Loan(Amount, Interest, Accepted, Branch) VALUES (${amount}, ${0}, ${false}, ${branch})`, (err, row) => {
            if(err){
                console.log(err)
                res.send("Something went wrong")
                return db.rollback()
            }
            console.log(row)
            const loan_id = row.insertId
            db.query(`INSERT INTO Customer_Loan VALUES (${customer},${loan_id})`, (err, row2) => {
                if(err){
                    console.log(err)
                    res.send("Something went wrong")
                    return db.rollback()
                }
                console.log(row2)
                db.commit()
                res.send("Loan successfully requested")
            })
        })
    })
}