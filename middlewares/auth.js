const jwt = require('jsonwebtoken')

module.exports = {
    auth: function(req, res, next) {
      console.log('body==============>>>>',req.body)
        let token = req.headers.token
        console.log(token)
        if (token) {
            let verified = jwt.verify(token, process.env.TOKENKEY)
            if(verified) {
                next()
            } else {
                next("Unregistered user")
            }
        } else {
            next("No one was logged in")
        }
    },

    isAdmin: function(req, res, next) {
        let token = req.headers.token
        if (token) {
            let verified = jwt.verify(token, process.env.TOKENKEY)
            if(verified) {
                if(verified.role == 'admin'){
                    next()
                }else{
                    next("you are not admin")
                }
            } else {
                next("Unregistered user")
            }
        } else {
            next("No one was logged in")
        }
    }
}
