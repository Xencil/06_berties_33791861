// Create a new router
const express = require("express")
const router = express.Router()
const bcrypt = require('bcrypt')
const saltRounds = 10



router.get('/register', function (req, res, next) {
    res.render('register.ejs')
})

router.get('/login', function (req, res, next) {
    res.render('login.ejs')
})

router.post('/registered', function (req, res, next) {
    const plainPassword = req.body.password
    // saving data in database
    bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
        let sqlquery = "INSERT INTO users (username, firstName, lastName, email, hashedPassword) VALUES (?,?,?,?,?)"
        // execute sql query
        let newrecord = [req.body.username,req.body.first,req.body.last,req.body.email,hashedPassword]
        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                next(err)
            }
            else
                result = 'Hello '+ req.body.first + ' '+ req.body.last +' you are now registered!  We will send an email to you at ' + req.body.email
                result += 'Your password is: '+ req.body.password +' and your hashed password is: '+ hashedPassword
                res.send(result)
        })
    })                                                                  
}); 


router.post('/loggedin', (req, res, next) => {
    const username = req.body.username
    const plainPassword = req.body.password
    let sqlquery ="SELECT * FROM users WHERE username = ?"
    db.query(sqlquery, [username], (err, results) => {
        if (err)
            next(err)
        if (results.length === 0) {
            return res.send('Login failed: username not found')
        }
        const user = results[0]
        const hashedPassword = user.hashedPassword
        bcrypt.compare(plainPassword, hashedPassword,function(err,result) {
            if (err) {
                // TODO: Handle error
                next(err)
            }
            else if (result == true) {
                // TODO: Send message
                res.send(`Login worked, Hello, ${user.firstName} ${user.lastName}`)
            }
            else {
                // TODO: Send message
                res.send('Failed, incorrect pass')
            }
        })
    })
})

router.get('/list', function(req, res, next) {
        let sqlquery = "SELECT id, username, firstName, lastName, email FROM users" // query database to get all the books
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                next(err)
            }
            res.render("UserList.ejs", {users:result})
        });
    });

// Export the router object so index.js can access it
module.exports = router
