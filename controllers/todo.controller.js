const jwt = require('jsonwebtoken')
const Todo = require('../models/todo.model')
const mongoose = require('mongoose')

module.exports = {
    getList: (req, res)=>{
        const token = req.headers.token
        let verified = jwt.decode(token,process.env.TOKENKEY)
        const userId = verified.id
        Todo.find({
            userId
        })
        .then(todo=>{
          if(todo.length > 0){
              res.status(200).json({
                  message: 'successfuly got data',
                  data: todo
              })
          }else{
            res.status(200).json({
                message: 'you dont have any task'
            })
          }
        })
        .catch(err=>{
            res.status(403).json({
                message: 'invalid user'
            })
        })
    },

    addTask: (req, res)=>{
        const token = req.headers.token
        let verified = jwt.decode(token,process.env.TOKENKEY)
        const userId = verified.id
        const task = req.body.task
        let newTask = new Todo({
            userId,
            task
        })
        newTask.save()
            .then(result=>{
                res.status(201).json({
                    message: 'successfuly add new task',
                    data: result
                })
            })
            .catch(error=>{
                res.status(400).json({
                    message: 'failed to add new task'
                })
            })
    },

    editTask: (req, res) => {
        const id = mongoose.Types.ObjectId(req.params.id)
        const task = req.body.task
        const token = req.headers.token
        let verified = jwt.decode(token,process.env.TOKENKEY)
        const userId = verified.id
        const completeStat = req.body.completeStat
        Todo.findById(id, (err, todo) => {
          if(err) {
            res.status(400).send({
              message: err.message
            })
          } else {
            if(todo.userId == userId) {
              Todo.update({
                _id: id
              }, {
                $set: req.body
              }, {
                overwrite: false
              }, (err, result) => {
                if(err) {
                  res.status(400).send({
                    message: 'failed to edit task'
                  })
                } else {
                  res.status(201).send({
                    message: 'successfuly edited task',
                    data: todo
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

      deleteTask: (req, res) => {
        const id = mongoose.Types.ObjectId(req.params.id)
        const token = req.headers.token
        let verified = jwt.decode(token,process.env.TOKENKEY)
        const userId = verified.id

        Todo.findById(id, (err, todo) => {
            if(err) {
                res.status(400).send({
                    message: 'task not found'
                })
            } else {
                if(todo.userId == userId) {
                    Todo.remove({
                        _id: id
                    }, (err) => {
                        if(err) {
                            res.status(400).send({
                                message: 'failed to delete task'
                            })
                        } else {
                            res.status(200).send({
                                message: 'task was successfuly deleted',
                                data: todo
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

    searchTask: (req, res)=>{
        const taskQuery = req.query.task
        const token = req.headers.token
        let verified = jwt.decode(token,process.env.TOKENKEY)
        const userId = verified.id
        Todo.find({
            userId,
            task: {
                $regex: '.*' + taskQuery + '.*'
            }
        },(err,todo)=>{
            if(err){
                res.status(400).send({
                    message: 'failed to get task'
                })
            }else {
                if(todo.length > 0){
                    res.status(200).send({
                        message: 'task was succesfuly got',
                        data: todo
                    })
                }else{
                    res.status(200).send({
                        message: 'nothing to show'
                    })
                }
            }
        })
    },

    showComplete: (req, res)=>{
        console.log('complete masuk sini')
        const token = req.headers.token
        let verified = jwt.decode(token,process.env.TOKENKEY)
        const userId = verified.id
        Todo.find({
            userId,
            completeStat: 'completed'
        })
        .then(todo=>{
            if(todo.length > 0){
                res.status(200).json({
                    message: 'successfuly got data',
                    data: todo
                })
            }else{
              res.status(200).json({
                  message: 'there is no completed task'
              })
            }
        })
        .catch(err=>{
            res.status(403).json({
                message: 'invalid user'
            })
        })
    },

    showUncomplete: (req, res)=>{
        const token = req.headers.token
        let verified = jwt.decode(token,process.env.TOKENKEY)
        const userId = verified.id
        Todo.find({
            userId,
            completeStat: 'uncomplete'
        })
        .then(todo=>{
            if(todo.length > 0){
                res.status(200).json({
                    message: 'successfuly got data',
                    data: todo
                })
            }else{
              res.status(200).json({
                  message: 'there is no uncomplete task'
              })
            }
        })
        .catch(err=>{
            res.status(403).json({
                message: 'invalid user'
            })
        })
    },
}
