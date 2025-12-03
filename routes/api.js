const express = require("express")
const router = express.Router()
const { check, validationResult } = require('express-validator')

router.get('/books', function (req, res, next) {
    let sqlquery = "SELECT * FROM books"
    const searchWord =req.query.search || ''
    const minPrice =req.query.minprice ;
    const maxPrice = req.query.maxprice ;
    const sort =req.query.sort 
    const data =[]
    const conditions = []

    if (searchWord){
        sqlquery+= " WHERE name LIKE ?"
        data.push(`%${searchWord}%`)
    }
    if (minPrice){
        conditions.push("price >= ?")
        data.push(minPrice)
    }

    if (maxPrice){
        conditions.push("price <= ?")
        data.push(maxPrice)
    }

        if (conditions.length > 0) {
        sqlquery += " WHERE " + conditions.join(" AND ")
    }


    if(sort === 'name'|| sort==='price'){
        sqlquery +=` ORDER BY ${sort} ASC`
    }

    db.query(sqlquery, data ,(err, result) => {
        if(err){
            res.json(err)
            next(err)
        }
        if(result !==undefined &&result.length >0) {
            res.render('books.ejs',{books: result, search:searchWord, maxprice: maxPrice,minprice: minPrice,sort: sort,error: null })
        } else {
            res.render('books.ejs',{books: null, search: searchWord,minprice: minPrice, maxprice: maxPrice,sort: sort,error: "no title present" })
        }
    })
})

module.exports = router