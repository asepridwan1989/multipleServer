const router = require('express').Router()
const {signUp, signIn, signInFB, LoginSteam} = require('../controllers/user.controller')
const steam = require('../middlewares/steam_auth');

router
    .post('/signup', signUp)
    .post('/signin', signIn)
    .post('/signinFB', signInFB,signIn)
    .get('/steam/authenticate', steam.authenticate(), function(req, res) {

    })
    .get('/verify', steam.verify(), LoginSteam)
module.exports = router
