var express = require('express');
var router = express.Router();
const mailController = require('../controllers/mail.controller');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.post('/email', mailController.sendNotification);

module.exports = router;
