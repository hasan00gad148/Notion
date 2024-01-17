const path = require('path');

const express = require("express");
const session = require('express-session')
let MongoDBStore = require('connect-mongodb-session')
const  csurf = require('csurf')
const cookieParser = require('cookie-parser');


function config(app){
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname,".." ,'views'));
    
    
    
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
        cookie: { sameSite: 'lax', maxAge: 1000 * 60 * 60 * 24 }
      }))
    
    
    
      app.use(express.urlencoded({ extended:true }));
      app.use(cookieParser());
      app.use(csurf());
    
      app.use('/public',express.static(path.join(__dirname ,"..",'public')));

}


module.exports = {config:config}