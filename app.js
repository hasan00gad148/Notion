const path = require('path');

const { v4: uuidv4 } = require("uuid");
const express = require("express");
const session = require('express-session')
let MongoDBStore = require('connect-mongodb-session')
const  csurf = require('csurf')
const cookieParser = require('cookie-parser');

const mongodb = require('./database/mongoDB');

db = null;

app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));



MongoDBStore = MongoDBStore(session);
const store = new MongoDBStore(
    {
      uri: 'mongodb://127.0.0.1:27017/',
      databaseName: 'connect_mongodb_session',
      collection: 'mySessions'
    },
    function(error) {
      if(error) 
        console.log("mongodb session store: ",error);
    });


app.use(session({
    secret: process.env.sessionsecret,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: { sameSite: 'lax', maxAge: 1000 * 60 * 60 }
  }))




app.use('/public',express.static(path.join(__dirname, 'public')));




app.use(express.urlencoded({ extended:true }));
app.use(cookieParser());
app.use(csurf());

app.use(function(req, res, next) {
  res.locals.csrfToken= req.csrfToken()
    if(req.session.isAuth){
     
        res.locals.isAuth = true;   
        res.locals.username = req.session.user.username;
    }
   
    next();
});




app.get('/', function(req, res) {
    res.redirect("/home");

})

app.get('/home', function(req, res) {
    res.render("home");

})

// signup==========================
app.get('/signup', function(req, res) {
  let inputdata = req.session.inputdata
  if(!inputdata){
    inputdata={
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      massege:false
    }
  }
  req.session.inputdata = null;
  res.render("signup",{inputdata: inputdata}); 
});

app.post('/signup',async function(req, res) {


  let user = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    date:new Date()
  }
  let confirmpassword = req.body.confirmPassword

  const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
  if(!user.username || !user.username.trim() ||
      !user.password || !user.password.trim() ||
      !user.email || !user.email.trim() || !regex.test(user.email))
      {
        req.session.inputdata={
          ...user,
          confirmPassword: confirmpassword,
          massege:"invalid input"
        }
         req.session.save(function(){
          res.redirect("/signup");
        } )
        return;
      }


  if (!confirmpassword ===user.password){
    req.session.inputdata={
      ...user,
      confirmPassword: confirmpassword,
      massege:"password and confirm password do not match"
    }
     req.session.save(function(){
      res.redirect("/signup");
    } )
    return;
  } 

  try {
    const existinguser = await db.collection('users').find({email: user.email}).toArray();
    if (existinguser && existinguser.length > 0){
      req.session.inputdata={
        ...user,
        confirmPassword: confirmpassword,
        massege:"email already exists"
      }
       req.session.save(function(){
        res.redirect("/signup");
      } )
      return;
    }

    await db.collection('users').insertOne(user)
    req.session.user=user;
    req.session.isAuth = true;
    req.session.save(function(){
      res.redirect("/workSpace");
    });
  }catch(e) {
    console.error(e)
    return res.status(500).render("500")
  }

});
//============================================================================




//login =================================================================
app.get('/login', function(req, res) {

  let inputdata = req.session.inputdata
  if(!inputdata){
    inputdata={
      username: "",
      email: "",
      password: "",
      massege:false,

    }
  }
  req.session.inputdata = null;
  res.render("login",{inputdata: inputdata}); 
});

app.post('/login',async function(req, res) {


  let user = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    date:new Date()
  }

  if(!user.password || !user.password.trim() ||
  !user.email || !user.email.trim())
  {
    req.session.inputdata={
      ...user,
      massege:"invalid input"
    }
    return req.session.save(function(){
      res.redirect("/login");
    } )
  }

  try {
    const [existinguser] = await db.collection('users').find({email: user.email}).toArray();
    if (!existinguser){
      req.session.inputdata={
        ...user,
        massege:"email or password are wrong"
      }
       req.session.save(function(){
        res.redirect("/login");
      } )
      return
    }

    if (!existinguser.password === user.password){
      req.session.inputdata={
        ...user,
        massege:"email or password are wrong"
      }
       req.session.save(function(){
        res.redirect("/login");
      } )
      return
    } 
    req.session.user=existinguser;
    req.session.isAuth = true;
    req.session.save(function(){
      res.redirect("/workSpace");
    });
    
  }catch(e) {
    console.error(e)
    return res.status(500).render("500")
  }


});
//======================================================================

app.get("/logout", function(req,res){
req.session.destroy(function(){
  res.redirect("/home");
});
return;
});















////////////////////////////////////////////////////////////////
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