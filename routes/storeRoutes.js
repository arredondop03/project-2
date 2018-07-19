const express = require('express');
const router  = express.Router();
const Store      = require('../models/store');
const User      = require('../models/user');



router.get('/stores/new', (req, res, next) => {
    Store.find()
    .then((allTheStores)=>{
        res.render('storeViews/newStore', {allTheStores});
    })
    .catch((err)=>{
        next(err);
    })
});


router.post('/stores/create', (req, res, next)=>{
    console.log('hey: ', req.body)
  const newStore = new Store({
   name: req.body.name,
   img: req.body.img,
   linkToPage: req.body.linkToPage,
   owner: req.user._id
  })

  newStore.save()
  .then((response)=>{
      User.findById(req.user._id)
      .then( foundUser => {
          foundUser.favStores.push(newStore)
          foundUser.save()
          .then( () => {
              res.redirect('/dashboard')
          } )
          .catch( err => next(err) )
      } )
      .catch( err => next(err) )

  })
  .catch((err)=>{
      next(err);
  }) 

})


//////////////////////////////////////////////////


router.get('/stores/:id/edit', (req, res, next)=>{
  Store.findById(req.params.id)
  .then((theStore)=>{
    res.render('storeViews/editStore', {theItem: theStore})

  })
  .catch((err)=>{
      next(err);
  })
})


router.post('/stores/:id/update', (req, res, next)=>{
  Store.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    img: req.body.img,
    linkToPage: req.body.linkToPage
   })
   .then(()=>{
       res.redirect('/dashboard')
   })
   .catch((err)=>{
       next(err);
   })  
})

router.post('/stores/:id/delete', (req, res, next)=>{
  Store.findByIdAndRemove(req.params.id)
  .then((reponse)=>{
      res.redirect('/dashboard');
  })
  .catch((err)=>{
      next(err);
  })
//   User.findById(id)array of itemn of that user - in the array find the item that i want to delete and slice it form the array 
//   save user
})



module.exports = router;