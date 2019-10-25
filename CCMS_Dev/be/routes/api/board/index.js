var createError = require('http-errors');
var { User, Board, Board_post } = require('../../../models');
const express = require('express');
const jwt = require('jsonwebtoken');
//const { isLoggedIn, isNotLoggedIn } = require('../../middlewares');
const router = express.Router();
const logger = require('../../../config/logger');

router.use('/comment', require('./comment'));
router.use(express.json())

router.get('/', async (req, res, next) => {
  
  try{
    logger.method('"/board"에 get실행')
    let result = await Board.findAll({
      include: [{
        model: Board_post,
      },{
        model: User,
      }],

      logging: (str) => {
        str = str.substr(21);
        logger.query(str)
      }
    })
    logger.method('"/board"에 get실행완료')
    await res.send({ posts: result })
  }
  catch(e){
    logger.error('"/board"에 get에서 ERROR' + ' : ' + e)
    res.send({ success: false, msg: e.message })
  }
});

router.post('/', async (req, res, next) => {
  var query;
  try {
    console.log(req.body)
    logger.method('"/board"에 post실행')
    const result = await Board.create({
      userId: req.body.userId,
      title: req.body.title,
      content: req.body.content,
      hit: 0,
      boardPostId: req.body.boardPostId,
    }, {
      logging: (str) => {

        str = str.substr(21);
        str = str.replace('?', `'${req.body.writer}'`);
        str = str.replace('?', `'${req.body.catagory}'`);
        str = str.replace('?', `'${req.body.title}'`);
        str = str.replace('?', `'${req.body.content}'`);
        str = str.replace('?', req.body.views);
        query = str
      }
    }).success(function(r){
      var id = result.get('id')
      query = query.replace('DEFAULT', id);
      logger.query(query)
      logger.method('"/board"에 post실행완료')
      res.send({ page: true })
    });
  }
  catch (e) {
    logger.error('"/board"에 post에서 ERROR' + ' : ' + e)
    res.send({ success: false, msg: e.message })
  }
});

router.put('/', async (req, res, next) => {
  try {
    logger.method('"/board"에 put실행')
    await Board.update(
      {
        title: req.body.title,
        content: req.body.content
      },
      {
        where: { id: req.body.id }, logging: (str) => {
          str = str.substr(21);
          logger.query(str)
        },
        returning: true
      },
    )
    logger.method('"/board"에 put실행완료')
    await res.send({ page: true })
  }
  catch (e) {
    logger.error('"/board"에 put에서 ERROR')
    res.send({ success: false, msg: e.message })
  }
});

router.delete('/', async (req, res, next) => {
  try {
    logger.method('"/board"에 delete실행')
    await Board.destroy(
      {
        where: { id: req.body.id },
        logging: (str) => { str = str.substr(21); logger.query(str) }
      }
    )
    logger.method('"/board"에 delete실행완료')
    await res.send({ page: true })
  }
  catch (e) {
    logger.error('"/board"에 delete에서 ERROR')
    res.send({ success: false, msg: e.message })
  }
});

router.all('*', function (req, res, next) {
  logger.error('"/board"에 없는 경로')
  next(createError(404, '그런 api 없어'));
});

module.exports = router;