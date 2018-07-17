const mongoose = require('mongoose')
const Schema = mongoose.Schema //remember to export


//Item rules
const itemSchema = new Schema({ //first parameter
  name: {type: String, enum: ["shirt", "pants"]},
  size: String,
  favColor: String,
  description: String,
  toBeFound: String,
}, //second parameter
  {timestamp: true}
)

const Item = mongoose.model("Item", itemSchema) //creating Item

module.exports = Item //exporting to mongo