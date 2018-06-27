const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user.model')


module.exports = {
    signUp: (req, res)=>{
        let name = req.body.name
        let email = req.body.email
        let password = req.body.password
        let user = new User({
            name, email, password
        })
        user.save((err,result)=>{
            if(err){
                let mail = ''
                let pass = ''
                if(err.errors.hasOwnProperty('email')){
                  mail = err.errors.email.message
                }
                if(err.errors.hasOwnProperty('password')){
                  pass = err.errors.password.message
                }
                let fail = {
                  mail,
                  pass
                }
                res.status(400).json({
                    message: fail
                })
            }else{
                res.status(201).json({
                    message: 'user was successfuly signed up',
                    data:result
                })
            }
        })
    },

    signIn: (req, res)=>{
        let email = req.body.email
        let password = req.body.password
        User.findOne({
            email
        },(err, dataUser)=>{
            if(err){
                res.status(400).json({
                    message:err
                })
            }else{
                if(!dataUser){
                    res.status(400).json({
                        message : 'email is not registered'
                    })
                }else{
                    let verify = bcrypt.compareSync(password, dataUser.password)
                    if(!verify){
                        res.status(400).json({
                            message: "password is not match"
                        })
                    }else{
                        let token = jwt.sign({
                            id: dataUser._id,
                            email: dataUser.email
                        }, process.env.TOKENKEY)
                        res.status(200).json({
                            message: 'successfuly logged in',
                            token:token,
                            dataUser:dataUser
                        })
                    }
                }
            }
        })
    }
}
