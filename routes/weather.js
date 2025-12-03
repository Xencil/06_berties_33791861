const express = require("express")
const router = express.Router()
const { check, validationResult } = require('express-validator')
const request = require('request')

router.get('/now',function(req, res, next){
        let apiKey = "9497a10455efc52af3efcde9ecc45db4"
        const city = req.query.city || ''
        let url =`http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
        
        request(url,function(err,response,body) {
        if(err) next(err)
            // res.send(body)
            var weather = JSON.parse(body)
            if(weather!==undefined&& weather.main !==undefined) {
                res.render('weather',{ weather, city, error: null })
            } else{
                res.render('weather',{ weather: null, city, error: "no data present" })
            }
        }) 
});

module.exports = router
