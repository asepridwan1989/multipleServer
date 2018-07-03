const mongoose = require('mongoose')
const Schema = mongoose.Schema

const commentSchema = new Schema({
  postId: {
    type: Schema.Types.ObjectId,
    ref: "article"
  },
  title: {
    type: String,
    require: [true, 'title required']
  },
  content: {
    type: String,
    require: [true, 'content required']
  },
}, {
  timestamps: true
})

let article = mongoose.model('Article', articleSchema)

module.exports = article
