const express = require('express');
const router  = express.Router();
const Item      = require('../models/item');

/* GET home page */

router.get('/items/new', (req, res, next) => {
  res.render('itemViews/newItem');
});


router.post('/items/create', (req, res, next)=>{
  const newItem = new Item({
   name: req.body.name,
   size: req.body.size,
   favColor: req.body.favColor,
   description: req.body.description,
   toBeFound: req.body.toBeFound,
  })

  newItem.save()
  .then((response)=>{
      res.redirect('/dashboard')
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
    toBeFound: req.body.toBeFound
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
  .then((reponse)=>{
      res.redirect('/dashboard');
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