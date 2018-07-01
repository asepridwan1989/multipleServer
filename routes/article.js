var express = require('express');
var router = express.Router();
const {addArticle, getListSelf, deleteArticle, getListAll, searchArticle, editArticle} = require('../controllers/article.controller')
const {auth} = require('../middlewares/auth')
/* GET users listing. */
router.post('/', auth, addArticle);
router.get('/profile', auth, getListSelf)
router.get('/home', getListAll)
router.delete('/:id', auth,deleteArticle)
router.put('/:id', auth, editArticle)
router.get('/search', searchArticle)

module.exports = router;
