var express = require('express');
var router = express.Router();
const {addQuestion, getListSelf, deleteQuestion, getListAll, searchQuestion, editQuestion, getOneQuestion, addAnswer,addVote} = require('../controllers/question.controller')
const {auth} = require('../middlewares/auth')
/* GET users listing. */
router.post('/', auth, addQuestion);
router.get('/profile', auth, getListSelf)
router.get('/home', getListAll)
router.delete('/:id', auth,deleteQuestion)
router.put('/:id', auth, editQuestion)
router.get('/search', searchQuestion)
router.get('/view/:id', getOneQuestion)
router.put('/add-answer/:id', addAnswer);
router.put('/vote/:id', addVote);
module.exports = router;
