const db = require('../db')

exports.staffPage = (req, res) => {
    const { staff } = req.params
    db.query(`
        SELECT Staff.Name, Staff.Post, Staff.Salary, Staff.Address, Bank.Bank_code, Bank.Bank_code, Bank.Name AS BankName
        FROM Staff
        INNER JOIN Bank
        ON Bank.Bank_code = Staff.Bank
        WHERE Staff.Staff_id = ${staff}
    `, (err, rows) => {
        if(err){
            console.log(err)
            return res.render("staff", {
                message: "Something went wrong!"
            })
        }
        console.log(rows)
        res.render("staff", {
            staff: rows[0]
        })
    })
}