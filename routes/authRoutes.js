const express         = require('express')
const router          = express.Router();
const User            =require('../models/user')
const bcrypt          =require('bcryptjs')
const passport        = require('passport')


const Item      = require('../models/item');

//-------------SIGNUP-------------
router.get('/signup', (req, res, next)=>{
  res.render('userViews/signupPage')
})

router.post('/signup', (req, res, next)=>{
  const thePassword = req.body.thePassword
  const theUsername = req.body.theUsername
  
  if(thePassword === "" || theUsername === ""){ 
    res.render('userViews/signupPage' , {errorMessage:'Please fill in both fields'})
    return
  }
  
  User.findOne({'username': theUsername})
  .then((responseFromDB)=>{
    if(responseFromDB !== null){
      res.render('userViews/signupPage',{errorMessage: `Sorry. the username ${theUsername} is already taken`})
      return;
    }
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(thePassword, salt)
    
    User.create({username: theUsername, password: hashedPassword})
    .then((response)=>{
    res.redirect('/')
  })
  .catch((err)=>{
    next(err)
  })
 })
})

//-------------end of SIGNUP-------------

//-------------LOGIN-------------

router.get("/login", (req, res, next) => {
  res.render("userViews/loginPage", {message: req.flash("error")});
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));
//------------- end of LOGIN-------------

//------------- LOGOUT ------------

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

//-------------Dashboard---------
router.get("/dashboard", (req, res, next) => {
  
Item.find()
.then((listOfItems)=>{
    res.render('userViews/dashboard', {listOfItems}), {message: req.flash("error")};
})
.catch((err)=>{
    next(err); 
 })


});






//----------  EXPORT ---------------
module.exports = router

