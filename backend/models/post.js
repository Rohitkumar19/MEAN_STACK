const mongoose = require('mongoose')

//we need to create this model because it helps that in saving it to database
const postSchema = mongoose.Schema({
  title: {type: String, required: true},
  content: {type:String, required: true},
  imagePath: {type: String, required: true},
  creator: {type: mongoose.Schema.Types.ObjectId, ref:'User', required: true}
  //ref property is used to indicated that(mongoose.Schema.Types.ObjectId this id) is of User
})

module.exports = mongoose.model("POST", postSchema)
