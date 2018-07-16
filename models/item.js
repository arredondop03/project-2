const mongoose = require('mongoose')
const Schema = mongoose.Schema //remember to export



const itemSchema = new Schema({
  // name: {type: String, enum: ["shirt", "pants"]},
  name: String,
  size: String,
  favColor: String,
  description: String,
  toBeFound: String,

},
  {timestamp: true}
)

const Item = mongoose.model("Item", itemSchema)

module.exports = Item