const express = require('express');
const User = require('../models/user');
const Applicant = require('../models/applicant');
const Drawing = require('../models/drawing');

const {isLoggedIn, isNotLoggedIn} = require('./middlewares');

const router = express.Router();

router.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});


router.post('/application', isLoggedIn, async (req, res, next) => {
    try {
      const exApplicant = await Applicant.findOne({ where: {UserId :  req.user.id}});
      if (exApplicant) {
        return res.render('error', { message: '이미 신청하셨습니다.' });
      }  
      const { mbti , kakaoId } = req.body;
      await Applicant.create({
        mbti,
        kakaoId,
        UserId: req.user.id,
        school: req.user.school,
        gender: req.user.gender,
      })
      return res.redirect('/');
    } catch (error) {
      console.error(error);
      return next(error);
    }
  });
  
  router.post('/drawing', isLoggedIn, async(req,res,next) => {
    try{
      const { drawing } = req.body;
      await Drawing.create({
        selectNum : drawing,
        price: drawing*1000,
        UserId: req.user.id,
      })
      return res.redirect('/')
    } catch{
      console.error(err);
      return next(error);
    }
  })

  
module.exports = router; 