const db = require('../db')

exports.loansPage = (req, res) => {
    const { customer } = req.params
    db.query(`
        SELECT Loan.Loan_id, Loan.Amount, Loan.Interest, Loan.Accepted
        FROM Loan
        INNER JOIN Customer_Loan
        ON (Customer, Loan) = (${customer}, Loan.Loan_id)
        ORDER BY Loan.Loan_id DESC
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

exports.bankLoansPage = (req, res) => {
    const { bank } = req.params
    db.query(`
        SELECT Loan_id, Amount, Interest, Accepted
        FROM Loan
        WHERE Branch IN (SELECT Branch_id FROM Branch WHERE Bank = ${bank})
        ORDER BY Loan_id DESC
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
        db.query(`INSERT INTO Loan(Amount, Interest, Accepted, Branch) VALUES (${amount}, ${0}, ${null}, ${branch})`, (err, row) => {
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

exports.requestedLoans = (req, res) => {
    const { bank } = req.params
    db.query(`
        SELECT Loan.Loan_id, Loan.Amount, Customer.Name AS CustomerName FROM Loan
        INNER JOIN Customer_Loan
        ON Customer_Loan.Loan = Loan.Loan_id
        INNER JOIN Customer
        ON Customer.Customer_id = Customer_Loan.Customer
        WHERE Loan.Accepted IS NULL
        AND Branch IN ( SELECT Branch_id FROM Branch WHERE Bank = ${bank} )
    `, (err, loans) => {
        if(err){
            console.log(err)
            return
        }
        res.render("requestedLoans", {
            loans
        })
    })
}

exports.loanAction = (req, res) => {
    const { loan_id, toApprove, interest } = req.body
    let sql;
    if(toApprove){
        sql = `
            UPDATE Loan
            SET Accepted = ${true}, Interest = ${interest}
            WHERE Loan_id = ${loan_id}
        `
    }
    else{
        sql = `
            UPDATE Loan
            SET Accepted = ${false}
            WHERE Loan_id = ${loan_id}
        `
    }
    db.query(sql, (err, row) => {
        if(err){
            console.log(err)
            return;
        }
        res.send("Successfully completed")
    })
}