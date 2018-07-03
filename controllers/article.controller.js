const jwt = require('jsonwebtoken')
const Article = require('../models/article.model')
const mongoose = require('mongoose')

module.exports = {
    getListSelf: (req, res)=>{
      console.log('post profile')
        const token = req.headers.token
        let verified = jwt.decode(token,process.env.TOKENKEY)
        const userId = verified.id
        Article.find({
            userId
        })
        .then(article=>{
          if(article.length > 0){
              res.status(200).json({
                  message: 'successfuly got data',
                  data: article
              })
          }else{
            res.status(200).json({
                message: 'you dont have any article'
            })
          }
        })
        .catch(err=>{
            res.status(403).json({
                message: 'invalid user'
            })
        })
    },

    addArticle: (req, res)=>{
        const token = req.headers.token
        let verified = jwt.decode(token,process.env.TOKENKEY)
        let userId = verified.id
        const username = req.body.username
        const title = req.body.title
        const content = req.body.content
        let newArticle = new Article({
            userId,
            username,
            title,
            content
        })
        newArticle.save()
            .then(result=>{
                res.status(201).json({
                    message: 'successfuly add new article',
                    data: result
                })
            })
            .catch(error=>{
                res.status(400).json({
                    message: 'failed to add new task'
                })
            })
    },

    editArticle: (req, res) => {
        const id = mongoose.Types.ObjectId(req.params.id)
        const token = req.headers.token
        let verified = jwt.decode(token,process.env.TOKENKEY)
        const userId = verified.id
        const title = req.body.title
        const content = req.body.content
        Article.findById(id, (err, article) => {
          if(err) {
            res.status(400).send({
              message: err.message
            })
          } else {
            if(article.userId == userId) {
              Article.update({
                _id: id
              }, {
                $set: req.body
              }, {
                overwrite: false
              }, (err, result) => {
                if(err) {
                  res.status(400).send({
                    message: 'failed to edit article'
                  })
                } else {
                  res.status(201).send({
                    message: 'successfuly edited article',
                    data: result
                  })
                }
              })
            } else {
              res.status(400).send({
                message: 'Invalid user'
              })
            }
          }
        })
      },

      deleteArticle: (req, res) => {
        const id = mongoose.Types.ObjectId(req.params.id)
        const token = req.headers.token
        let verified = jwt.decode(token,process.env.TOKENKEY)
        const userId = verified.id

        Article.findById(id, (err, article) => {
            if(err) {
                res.status(400).send({
                    message: 'article not found'
                })
            } else {
                if(article.userId == userId) {
                    Article.remove({
                        _id: id
                    }, (err) => {
                        if(err) {
                            res.status(400).send({
                                message: 'failed to delete article'
                            })
                        } else {
                            res.status(200).send({
                                message: 'article was successfuly deleted',
                                data: article
                            })
                        }
                    })
                } else {
                    res.status(400).send({
                        message: 'Invalid user'
                    })
                }
            }
        })
    },

    searchArticle: (req, res)=>{
        const titleQuery = req.query.title
        console.log(req.query.title)
        Article.find({
            title: {
                $regex: '.*' + titleQuery + '.*'
            }
        },(err,article)=>{
            if(err){
                res.status(400).send({
                    message: 'failed to get task'
                })
            }else {
                if(article.length > 0){
                    res.status(200).send({
                        message: 'article was succesfuly got',
                        data: article
                    })
                }else{
                    res.status(200).send({
                        message: 'nothing to show'
                    })
                }
            }
        })
    },
    getListAll: (req, res)=>{
        Article.find()
        .populate('userId')
        .then(article=>{
          console.log(article)
          if(article.length > 0){
              res.status(200).json({
                  message: 'successfuly got data',
                  data: article
              })
          }else{
                res.status(200).json({
                message: 'you dont have any article'
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
    getOneArticle: (req, res)=>{
        let id = mongoose.Types.ObjectId(req.params.id)
        Article.findOne({_id:id})
        .populate('userId')
        .then(article=>{
          console.log('article = = = ', article)
          res.status(200).json({
              message: 'successfuly got data',
              data: article
          })
        })
        .catch(err=>{
            console.log('error', err)
            res.status(403).json({
                message: 'invalid user'
            })
        })
    },
}
