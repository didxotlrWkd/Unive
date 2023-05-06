const express = require('express');
const User = require('../models/user');
const Applicant = require('../models/applicant');

const {isLoggedIn, isNotLoggedIn} = require('./middlewares');
const drawNumber = require('../drawingNum');

const router = express.Router();

router.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

router.get('/', async(req,res,next) => {
    res.render('main', {
        title: 'Unive',
    });     
});

router.get('/application',isLoggedIn,(req,res) => {
  res.render('application', {
    title: 'Application'
  });
});

router.get('/join',isNotLoggedIn, (req,res) => {
  res.render('join', {
    title: 'Unive 회원가입',
  });
});

router.get('/drawing',isLoggedIn, (req,res) => {
  res.render('drawing', {
    title: '번호 뽑기',
  });
});

router.get('/result', isLoggedIn, async(req,res,next) => {
  try{
    await drawNumber();
    const user = await User.findOne({
      where: { id: req.user.id},
    });
    const drawings = await user.getDrawing({
      include: [{
        model: Applicant,
        attributes: ['mbti', 'kakaoId'],
      }]
    });
    res.render('result', { title: '번호 목록 - Unive', drawings});
  } catch(error) {
    console.error(error);
    next(error);
  }
});


module.exports = router; 