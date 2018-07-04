const jwt = require('jsonwebtoken')
const Question = require('../models/question.model')
const mongoose = require('mongoose')

module.exports = {
    getListSelf: (req, res)=>{
        const token = req.headers.token
        let verified = jwt.decode(token,process.env.TOKENKEY)
        const userId = verified.id
        Question.find({
            userId
        })
        .then(question=>{
          if(question.length > 0){
              res.status(200).json({
                  message: 'successfuly got data',
                  data: question
              })
          }else{
            res.status(200).json({
                message: 'you dont have any question'
            })
          }
        })
        .catch(err=>{
            res.status(403).json({
                message: 'invalid user'
            })
        })
    },

    addQuestion: (req, res)=>{
      console.log('siniiii',req.body)
        const token = req.headers.token
        let verified = jwt.decode(token,process.env.TOKENKEY)
        let userId = verified.id
        const username = req.body.username
        const title = req.body.title
        const question = req.body.question
        let newQuestion = new Question({
            userId,
            username,
            title,
            question
        })
        newQuestion.save()
            .then(result=>{
                res.status(201).json({
                    message: 'successfuly add new question',
                    data: result
                })
            })
            .catch(error=>{
                res.status(400).json({
                    message: 'failed to add new task'
                })
            })
    },

    editQuestion: (req, res) => {
        const id = mongoose.Types.ObjectId(req.params.id)
        const token = req.headers.token
        let verified = jwt.decode(token,process.env.TOKENKEY)
        const userId = verified.id
        const title = req.body.title
        const content = req.body.content
        Question.findById(id, (err, question) => {
          if(err) {
            res.status(400).json({
              message: err.message
            })
          } else {
            if(question.userId == userId) {
              Question.update({
                _id: id
              }, {
                $set: req.body
              }, {
                overwrite: false
              }, (err, result) => {
                if(err) {
                  res.status(400).json({
                    message: 'failed to edit question'
                  })
                } else {
                  res.status(201).json({
                    message: 'successfuly edited question',
                    data: result
                  })
                }
              })
            } else {
              res.status(400).json({
                message: 'Invalid user'
              })
            }
          }
        })
      },

      deleteQuestion: (req, res) => {
        const id = mongoose.Types.ObjectId(req.params.id)
        const token = req.headers.token
        let verified = jwt.decode(token,process.env.TOKENKEY)
        const userId = verified.id

        Question.findById(id, (err, question) => {
            if(err) {
                res.status(400).json({
                    message: 'question not found'
                })
            } else {
                if(question.userId == userId) {
                    Question.remove({
                        _id: id
                    }, (err) => {
                        if(err) {
                            res.status(400).json({
                                message: 'failed to delete question'
                            })
                        } else {
                            res.status(200).json({
                                message: 'question was successfuly deleted',
                                data: question
                            })
                        }
                    })
                } else {
                    res.status(400).json({
                        message: 'Invalid user'
                    })
                }
            }
        })
    },

    searchQuestion: (req, res)=>{
        const titleQuery = req.query.title
        console.log(req.query.title)
        Question.find({
            title: {
                $regex: '.*' + titleQuery + '.*'
            }
        },(err,question)=>{
            if(err){
                res.status(400).json({
                    message: 'failed to get question'
                })
            }else {
                if(question.length > 0){
                    res.status(200).json({
                        message: 'question was succesfuly got',
                        data: question
                    })
                }else{
                    res.status(200).json({
                        message: 'nothing to show'
                    })
                }
            }
        })
    },

    getListAll: (req, res)=>{
        Question.find()
        .populate('userId')
        .then(question=>{
          console.log('ini hasilnya',question)
          if(question.length > 0){
              res.status(200).json({
                  message: 'successfuly got data',
                  data: question
              })
          }else{
                res.status(200).json({
                message: 'you dont have any question'
            })
          }
        })
        .catch(err=>{
            console.log('error', err)
            res.status(403).json({
                message: 'invalid user'
            })
        })
    },

    getOneQuestion: (req, res)=>{
        let id = mongoose.Types.ObjectId(req.params.id)
        console.log('question = = = ', req.params.id)
        Question.findOne({_id:id})
        .populate('userId')
        .then(question=>{
          console.log('question = = = ', question)
          res.status(200).json({
              message: 'successfuly got data',
              data: question
          })
        })
        .catch(err=>{
            console.log('error', err)
            res.status(403).json({
                message: 'invalid user'
            })
        })
    },

  addAnswer: (req, res)=>{
    console.log(req.body)
    const token = req.headers.token
    const user = req.body.user
    const id = req.params.id
    const answer = req.body.answer
    const newAnswer = {
      user,
      answer
    }
    console.log('baruuuu',newAnswer)
    Question.findByIdAndUpdate(id, {
      $push: {
        answers: newAnswer
      }
    })
    .then(response => {
      res.status(200).json({
        message: 'Add answer to post success',
        data: response
      })
    })
    .catch(err => {
      res.status(400).json({
        message: 'Add answer to post failed',
        err: err.message
      })
    })
  },

  addVote: (req, res) => {
      const id = mongoose.Types.ObjectId(req.params.id)
      const vote = req.body.vote
      Question.findById(id, (err, question) => {
        if(err) {
          console.log(err)
          res.status(400).json({
            message: err.message
          })
        } else {
          console.log('sini mah udah')
            Question.update({
              _id: id
            }, {
              $set: {vote}
            }, {
              overwrite: false
            }, (err, result) => {
              if(err) {
                res.status(400).json({
                  message: 'failed to edit question'
                })
              } else {
                res.status(201).json({
                  message: 'successfuly edited question',
                  data: result
                })
              }
            })
        }
      })
    },
}
