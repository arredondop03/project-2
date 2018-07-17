///////////------- LOGIN - SIGNUP - LOGOUT - DASHBOARD - PROFILE - SETUP ------------///////////

const express         = require('express')
const router          = express.Router();
const User            =require('../models/user')
const bcrypt          =require('bcryptjs')
const passport        = require('passport')

const Item            = require('../models/item');

//------------------------------------------------------------------------------------------------SIGNUP

router.get('/signup', (req, res, next)=>{
  res.render('userViews/signupPage')
})

router.post('/signup', (req, res, next)=>{
  const thePassword           = req.body.thePassword
  const confirPassword        = req.body.confirmPassword
  const theUsername           = req.body.theUsername
  const theFirstName          = req.body.firstName
  const theLastName           = req.body.lastName
  const theGender             = req.body.gender
  const theBirthday           = req.body.bday

  
  if(thePassword === "" || theUsername === ""){                                         //Make sure the user
    res.render('userViews/signupPage' , {errorMessage:'Please fill in both fields'})    //fills both fields 
    return
  }
  
  if(thePassword !== confirPassword){                                                   //Confirm password
    res.render('userViews/signupPage' , {errorMessage:'The passwords are not the same'})
    return
  }
  
  User.findOne({'username': theUsername})                                               //working with db
  .then((responseFromDB)=>{                                                             //checking if username 
    if(responseFromDB !== null){                                                        //is taken
      res.render('userViews/signupPage',{errorMessage: `Sorry. the username             
      ${theUsername} is already taken`})
      return;
    }
    const salt = bcrypt.genSaltSync(10)                                                 //salt for password
    const hashedPassword = bcrypt.hashSync(thePassword, salt)                           //crazy password
    
    User.create({                                                                       //creating new username
      firstName: theFirstName,
      lastName: theLastName,
      gender: theGender,
      birthday: theBirthday,
      username: theUsername, 
      password: hashedPassword, 
      })
    .then((newUser)=>{
      req.login(newUser, (err) => {
        if(err){
          next(err);
        }
        res.redirect(`/profileSetup/${newUser._id}`)                                                       //next page
      })
  })
  .catch((err)=>{
    next(err)
  })
 })
})

//------------------------------------------------------------------------------------------PROFILE-SETUP

router.get('/profileSetup/:id', (req, res, next)=>{  
  res.render('userViews/profileSetup')
})


router.post('/profileSetup/:id', (req, res, next)=>{
  const userId = req.params.id;  
  const updates = {
    shirt: req.body.shirt,
    pants: req.body.pants,
    shorts: req.body.shorts,  
    shoes: req.body.shoes,
    skirt: req.body.skirt,
    sweater: req.body.sweater
  }
  User.findByIdAndUpdate(userId, updates)
  .then(() => {
    res.redirect('/dashboard');
  })
  .catch(err => next(err));
  

  
})

//------------------------------------------------------------------------------------------------LOGIN

router.get("/login", (req, res, next) => {
  res.render("userViews/loginPage", {message: req.flash("error")});
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

//------------------------------------------------------------------------------------------------LOGOUT

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

//----------------------------------------------------------------------------------------------DASHBOARD
router.get("/dashboard", (req, res, next) => {
  
Item.find()
.then((listOfItems)=>{
    res.render('userViews/dashboard', {listOfItems}), {message: req.flash("error")};
})
.catch((err)=>{
    next(err); 
 })


});





//-----------------------------------------------------------------------------------------------EXPORT
module.exports = router