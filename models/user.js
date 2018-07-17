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
  img:          String,
  shirt:        String,
  pants:        String,
  shorts:       String,
  shoes:        String,
  skirt:        String,
  sweater:      String,

  myItems:      [{type: Schema.Types.ObjectId, ref: 'Item'}],
  favStores:    [{name: String, storeImg: String}]},
  {timestamp: true}
)

const User = mongoose.model("User", userSchema) //creating user

module.exports = User  //exporting user