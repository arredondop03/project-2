const mongoose = require('mongoose')
const Schema = mongoose.Schema //remember to export


//Item rules
const storeSchema = new Schema({ //first parameter
  name: String,
  img: String,
  linkToPage: String,
  owner: [{type: Schema.Types.ObjectId, ref: 'User'}],
}, //second parameter
  {timestamp: true}
)

const Store = mongoose.model("Store", storeSchema) //creating Item

module.exports = Store //exporting to mongo