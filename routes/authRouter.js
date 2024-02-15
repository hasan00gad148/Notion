
const { Router } = require('express');
const authController = require("../controllers/authController");






const app = Router();


app.get('/', function(req, res) {
    res.redirect("/home");

})

app.get('/home', function(req, res) {
    res.render("home");

})


app.get('/signup', authController.getSignup);



app.post('/signup', authController.postSignup);


app.get('/login', authController.getLogin);


app.post('/login', authController.postLogin);


app.get("/logout", authController.logout);







module.exports =  app;