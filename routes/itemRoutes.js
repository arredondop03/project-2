const express = require('express');
const router  = express.Router();
const Item      = require('../models/item');
const User      = require('../models/user');

/* GET home page */

router.get('/items/new', (req, res, next) => {
    Item.find()
    .then((allTheItems)=>{
        res.render('itemViews/newItem', {allTheItems});
    })
    .catch((err)=>{
        next(err);
    })
  
    // res.render('itemViews/newItem');
});


router.post('/items/create', (req, res, next)=>{
  const newItem = new Item({
   name: req.body.name,
   size: req.body.size,
   favColor: req.body.favColor,
   description: req.body.description,
   toBeFound: req.body.toBeFound,
//    owner: req.user._id

  })

  newItem.save()
  .then((response)=>{
      User.findById(req.user._id)
      .then( foundUser => {
          foundUser.myItems.push(newItem)
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


router.get('/items/:id/edit', (req, res, next)=>{
  Item.findById(req.params.id)
  .then((theItem)=>{
    res.render('itemViews/editItem', {theItem: theItem})

  })
  .catch((err)=>{
      next(err);
  })
})


router.post('/items/:id/update', (req, res, next)=>{
  Item.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    size: req.body.size,
    favColor: req.body.favColor,
    description: req.body.description,
    toBeFound: req.body.toBeFound,

   })
   .then(()=>{
       res.redirect('/dashboard')
   })
   .catch((err)=>{
       next(err);
   })  
})

router.post('/items/:id/delete', (req, res, next)=>{
    
  Item.findByIdAndRemove(req.params.id)
  .then((response)=>{
      User.findById(req.user._id)
      .then( foundUser => {          
        const position = foundUser.myItems.indexOf(req.params.id);
        foundUser.myItems.splice(position,1)
          foundUser.save()
          .then( (blah) => {
            //   console.log(' 0 0 0 0 0 0 ', blah)
              res.redirect('/dashboard');
          } )
          
      } )
      .catch( err => next(err) )
  })
  .catch((err)=>{
      next(err);
  })
})


// router.get('/items/:id', (req, res, next) => {
//    const id = req.params.id;
//    Item.findById(id)
//    .then((theBook)=>{    
//        res.render('bookDetails',  {theBook});
//    })
//    .catch((err)=>{
//       next(err); 
//    })
// });







module.exports = router;