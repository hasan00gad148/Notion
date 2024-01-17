const path = require('path');

const validateSignup = require('../utils/validation/validateSignup'); 
const validateLogin = require('../utils/validation/validateLogin'); 
const flashInputData = require('../utils/validation/flashInputData');
const User = require("../database/models/user");




function getSignup (req, res) {
    let inputdata = flashInputData.getInputData(req,{
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      confirmPassword: "",
      massege: "",
    });
    res.render("signup",{inputdata: inputdata}); 
  }




async function postSignup (req, res,next) {

 
    if (!validateSignup.validateFormFields(req))
    {
        flashInputData.flashInputData(req,
          {...req.body,
            massege: "invalid input"},
          function(){ res.redirect("/signup")})
        return false;
    }
  
    if(!validateSignup.regexEmail(req.body.email)){
      flashInputData.flashInputData(req,
        {...req.body,
          massege: "invalid email"},
        function(){ res.redirect("/signup")})
      return false;
  
    }
  
    if (req.body.confirmPassword !==req.body.password){
      flashInputData.flashInputData(req,
        {...req.body,
        massege: "password and confirm password do not match"},
        function(){ res.redirect("/signup")})
      return false;
    } 
  
      const user =new User(null,req.body.firstname, req.body.lastname, 
        req.body.email, req.body.password)
        

      let existinguser  = null
      try {
        existinguser = await user.fetchByEmail()
      } catch (error) {
        next(`something went wrong in database, ${error} `);
        return false;
      } 
  
      if (existinguser){
  
        flashInputData.flashInputData(req,
          {...req.body,
          massege: "email already exists"},
          function(){ res.redirect("/signup")})
        return false;
      }
   
      try {
       await user.add();
      } catch (error) {
        next(`something went wrong in database, ${error} `);
        return false;
      }
  
      req.session.user=user.data;
      req.session.isAuth = true;
  
      req.session.save(function(){
        res.redirect("/workSpace");
      });
  
  }






function getLogin (req, res) {

    let inputdata = flashInputData.getInputData(req,{
      username: "",
      email: "",
      password: "",
      massege:false,
    });
  
    res.render("login",{inputdata: inputdata}); 
  }




async function postLogin(req, res,next) {


    if(!validateLogin.validateFormFields(req))
    {
      flashInputData.flashInputData(req,
        {...req.body,
        massege: "invalid input"},
        function(){ res.redirect("/login"); });
      return false;
    }
  
      const user = new User();
      let existinguser  = null
      try {
        existinguser = await user.fetchByEmail(req.body.email);
      } catch (error) {
        next(`something went wrong in database, ${error} `);
        return false;
      }
  
      if (!existinguser){
        flashInputData.flashInputData(req,
          {...req.body,
          massege: "email or password are wrong"},
          function(){ res.redirect("/login")})
        return false;
      }
  
      if (existinguser.password !== req.body.password){
        flashInputData.flashInputData(req,
          {...req.body,
          massege: "email or password are wrong"},
          function(){ res.redirect("/login")})
        return false;
      } 
  
  
      req.session.user=existinguser;
      req.session.isAuth = true;
      req.session.save(function(){
        res.redirect("/workSpace");
      });
      
  }




function logout(req,res){
    req.session.destroy(function(){
      res.redirect("/home");
    });
    return;
    }


module.exports = {getSignup: getSignup, 
                    postSignup: postSignup,
                    getLogin:getLogin,
                    postLogin:postLogin,
                    logout:logout}