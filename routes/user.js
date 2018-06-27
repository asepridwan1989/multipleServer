const router = require('express').Router()
const {signUp, signIn} = require('../controllers/user.controller')

router
    .post('/signup', signUp)
    .post('/signin', signIn)

module.exports = router
