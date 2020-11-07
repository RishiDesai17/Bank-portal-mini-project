const db = require('../db')
const bcrypt = require('bcryptjs')

exports.loginPage = (req, res) => {
    res.render("login")
}

exports.login = async(req, res) => {
    try{
        const { username, password, role } = req.body
        let sql;
        if(role === "staff"){
            sql = `SELECT Staff_id, Password FROM Staff WHERE Staff_id="${username}"`
        }
        else{
            sql = `SELECT Customer_id, Username, Password FROM Customer WHERE Username="${username}"`
        }
        db.query(sql, async(err, rows) => {
            if(err){
                console.log(err)
            }
            console.log(rows)
            if(rows.length === 0){
                return res.render("login", {
                    invalid_credentials: "You have entered invalid credentials"
                })
            }
            const isValid = await bcrypt.compare(password, rows[0].Password)
            if(!isValid){
                res.render("login", {
                    invalid_credentials: "You have entered invalid credentials"
                })
            }
            if(role === "staff"){
                res.redirect(`/staff/${rows[0].Staff_id}`)
            }
            else{
                res.redirect(`/customers/${rows[0].Customer_id}`)
            }
        })
    }
    catch(err){
        console.log(err)
    }
}

exports.registerPage = (req, res) => {
    res.render("signup")
}

exports.register = async(req, res) => {
    try{
        const { username, name, password, phno, address } = req.body
        const hashedPassword = await bcrypt.hash(password, 10)
        db.beginTransaction(() => {
            db.query(`INSERT INTO Customer (Username, Name, Password, Address) VALUES ("${username}", "${name}", "${hashedPassword}", "${address}")`, (err, result) => {
                if(err){
                    console.log(err)
                    if(err.code === "ER_DUP_ENTRY"){
                        res.render("signup", {
                            username_taken: "This username has already been taken"
                        })
                    }
                    return db.rollback();
                }
                console.log(result)
                db.query(`INSERT INTO Customerphones (Customer, Phone) VALUES ("${result.insertId}", "${phno}")`, err => {
                    if(err){
                        console.log(err)
                        return db.rollback();
                    }
                    db.commit()
                    res.redirect("/users/login")
                })
            })
        })
    }
    catch(err){
        console.log(err)
    }
}