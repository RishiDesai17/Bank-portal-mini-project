const db =  require('../db')

exports.addPhoneNumberPage = (req, res) => {
    const { customer } = req.params
    db.query(`SELECT Phone FROM Customerphones WHERE Customer = ${customer}`, (err, phonenos) => {
        if(err){
            console.log(err)
            return;
        }
        console.log(phonenos)
        res.render("newPhoneNumber", {
            phonenos
        })
    })
}

exports.addPhoneNumber = (req, res) => {
    const { customer } = req.params
    const { phno } = req.body
    db.query(`INSERT INTO Customerphones (Customer, Phone) VALUES ("${customer}", "${phno}")`, (err, row) => {
        if(err){
            console.log(err)
            return;
        }
        console.log(row)
        res.redirect(`/phone/${customer}`)
    })
}