const mongoose = require('mongoose')
const Schema = mongoose.Schema

const questionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user"
  },
  title: {
    type: String,
    require: [true, 'title required']
  },
  question: {
    type: String,
    require: [true, 'content required']
  },
  answers: [
    {
      user: String,
      posted: {
        type: Date,
        default: new Date
      },
      answer: String,
      vote: {
        type: Number,
        default: 0
      }
    }
  ],
  vote: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

let question = mongoose.model('Question', questionSchema)

module.exports = question
