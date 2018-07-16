const mongoose = require('mongoose')
const Schema = mongoose.Schema //remember to export



const userSchema = new Schema({
  email:        String,
  username:     String,
  password:     String,
  firstName:    String,
  lastName:     String,
  gender:       String,
  img:          String,
  myItems:      [{type: Schema.Types.ObjectId, ref: 'Item'}],
  favStores:    [{name: String, storeImg: String}]},
  {timestamp: true}
)

const User = mongoose.model("User", userSchema)

module.exports = User