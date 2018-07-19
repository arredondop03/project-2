const mongoose = require('mongoose')
const Schema = mongoose.Schema //remember to export
const passportEmail = require('passport-email') //this is to use email with passport


//User rules
const userSchema = new Schema({
  firstName:    String,
  lastName:     String,
  gender:       String,
  birthday:     Date,
  username:     String,
  password:     String,
  image:        String,
  shirt:        String,
  pants:        String,
  shorts:       String,
  shoes:        String,
  skirt:        String,
  sweater:      String,
  boxerBriefs:  {type: String, required: false},
  bra:          {type: String, required: false},
  panties:      {type: String, required: false},
  dress:        {type: String, required: false},
  jumper:       {type: String, required: false},

  myItems:      [{type: Schema.Types.ObjectId , ref: 'Item'}],
  favUsers:     [{type: Schema.Types.ObjectId, ref: 'Store'}],
  followers:    [{type: Schema.Types.ObjectId, ref: 'User'}],
  following:    [{type: Schema.Types.ObjectId, ref: 'User'}]
  },
  {
    usePushEach: true
  },
  { 
    timestamp: true
  }
)

const User = mongoose.model("User", userSchema) //creating user

module.exports = User  //exporting user