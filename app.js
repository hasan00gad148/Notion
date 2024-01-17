const path = require('path');

const { v4: uuidv4 } = require("uuid");
const express = require("express");

const mongodb = require('./database/mongoDB');
const authRouter = require("./routes/authRouter")
const appConfig = require("./utils/expressAppConfig");




db = null;

app = express();
appConfig.config(app);



app.use(function(req, res, next) {
  res.locals.csrfToken= req.csrfToken()
    if(req.session.isAuth){
     
        res.locals.isAuth = true;   
        res.locals.username = req.session.user.firstname+" "+req.session.user.lastname;
        res.locals.id = req.session.user.id;
    }
   
    next();
});



app.use(authRouter.router)







//\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\\
app.use((req, res, next) => {
    res.status(404).render('404');
    
  });

app.use((err,req, res, next) => {
    console.error(err)
    if (err.code === 'EBADCSRFTOKEN') 
        return res.status(403).render('403');
    return res.status(500 || err.status).render('500');
  });


mongodb.connectdb()
.then(function (){
    db = mongodb.getdb();

    port = 3000
    app.listen(port,(err, req, res)=>{
        if (err){
            console.error("app.listen func: ",err)
        }
        console.log("listenning on port " +port + ".......")
    })

})
.catch(function (err){
    console.error("database connetion error: ",err)
});