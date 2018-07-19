///////////------- LOGIN - SIGNUP - LOGOUT - DASHBOARD - PROFILE - SETUP ------------///////////

const express         = require('express')
const router          = express.Router();
const User            =require('../models/user')
const bcrypt          =require('bcryptjs')
const passport        = require('passport')
// const multer          =require('multer')
const uploadCloud     = require('../config/cloudinary')

const Item            = require('../models/item');
const Store            = require('../models/store');

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
       else if(newUser.gender == 'male'){
        res.redirect(`/profileSetupMen/${newUser._id}`)
      }else if(newUser.gender == 'female'){
         console.log('sup girl')
        res.redirect(`/profileSetupWomen/${newUser._id}`)   
       }
                                                            //next page
      })
  })
  .catch((err)=>{
    next(err)
  })
 })
})

//------------------------------------------------------------------------------------------PROFILE-SETUP

// const fileInput = document.getElementById('file-input');




router.get('/profileSetupMen/:id', (req, res, next)=>{  
  res.render('userViews/profileSetupMen')
})

router.get('/profileSetupWomen/:id', (req, res, next)=>{  
  res.render('userViews/profileSetupWomen')
})


router.post('/profileSetupWomen/:id', uploadCloud.single('photo'), (req, res, next)=>{
  const userId = req.params.id;  

  const updates = {
    shirt:        req.body.shirt,
    pants:        req.body.pants,
    shorts:       req.body.shorts,  
    shoes:        req.body.shoes,
    skirt:        req.body.skirt,
    sweater:      req.body.sweater,
    boxerBriefs:  req.body.boxerBriefs,
    bra:          req.body.bra,
    panties:      req.body.panties,
    dress:        req.body.dress,
    jumper:       req.body.jumper,
  }

  if(req.file){
    updates.image = req.file.url
  }
  User.findByIdAndUpdate(userId, updates)
  .then(() => {
    res.redirect('/dashboard');
  })
  .catch(err => next(err));
  

  
})

router.post('/profileSetupMen/:id', uploadCloud.single('photo'), (req, res, next)=>{
  const userId = req.params.id;  
  const updates = {
    img:          req.body.fileInput,
    shirt:        req.body.shirt,
    pants:        req.body.pants,
    shorts:       req.body.shorts,  
    shoes:        req.body.shoes,
    skirt:        req.body.skirt,
    sweater:      req.body.sweater,
    boxerBriefs:  req.body.boxerBriefs,
   
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
 User.findById(req.user._id)
 .populate('followers')
 .populate('following') 
 .then( foundUser => {
  Item.find()
  .then((listOfItems) =>{
    Store.find()
    .then((listOfStores) =>{
        // res.render('userViews/dashboard', {listOfStores: listOfStores}), {message: req.flash("error")};
        res.render('userViews/dashboard', {listOfItems:listOfItems, theUser:foundUser}), {message: req.flash("error")};
    })
    .catch((err)=>{
        next(err); 
     })
  })
  .catch((err)=>{
      next(err); 
   })
 } )



});

// router.get("/dashboard", (req, res, next) => {
  
 
//   });

router.post('/users/:id/followMe', (req, res, next) => {
  const userId = req.params.id;
  User.findById(req.user._id)
  .then( meAsUser => {
    meAsUser.following.push(userId);
    console.log('meAsUser: ', meAsUser);
    meAsUser.save()
    .then( () => {
      User.findById(userId)
      .then( someOtheruser => {
        someOtheruser.followers.push(req.user._id);
        console.log("someOtheruser: ", someOtheruser)
        someOtheruser.save()
        .then( () => {
          res.redirect('/dashboard')
        } )
        .catch( err => next(err) )

      } )
      .catch( err => next(err) )
    } )
    .catch( err => next(err) )
  } )
  .catch( err => next(err) )
})

router.get('/users/:id', (req, res, next) => {
  User.findById(req.params.id)
  .populate('following')
  .populate('followers')
  .then( foundUser => {
    res.render('userViews/userDetails', { theUser: foundUser })
  } )
  .catch( err => next(err) )
})





//-----------------------------------------------------------------------------------------------EXPORT
module.exports = router