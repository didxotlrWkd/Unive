const express = require('express');
const {isLoggedIn, isNotLoggedIn} = require('./middlewares');
const {Post , User , Hashtag} = require('../models');

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.followerCount = req.user ? req.user.Followers.length : 0;
  res.locals.followingCount = req.user ? req.user.Followings.length : 0;
  res.locals.followingIdList = req.user ? req.user.Followings.map(f => f.id) : [];
  next();
});


router.get('/profile', isLoggedIn, async(req,res,next) => {
    try{
        const posts = await Post.findAll({
            include: [{
                model: User,
                attributes: ['id', 'nick'],
                
            }, 
             {
                model: User,
                attributes: ['id','nick'],
                as: 'Liker',
            }
        ],
            order: [['createdAt', 'DESC']],
            where: {UserId : req.user.id}, 
        });
        res.render('profile', {
            title: '내 정보 - NodeBird',
            twits: posts,
            likes: posts.map(v => v.Liker.map(v => v.id)),
        });
        
    } catch(err) {
        console.error(err);
        next(err);
    }
});

router.get('/join' , isNotLoggedIn, (req,res) => {
    res.render('join', {title: '회원가입 - NodeBird'});
});

router.get('/edit', isLoggedIn, (req,res) => {
    res.render('edit',{title: '프로필 수정'});
});

router.get('/', async(req,res,next) => {
    try{
        const posts = await Post.findAll({
            include: [{
                model: User,
                attributes: ['id', 'nick'],
            }, {
                model: User,
                attributes: ['id','nick'],
                as: 'Liker',
            }],
            order: [['createdAt', 'DESC']],

        });
      
        res.render('main', {
            twits: posts,
            likes: posts.map(v => v.Liker.map(v => v.id)),
        });
        
    } catch(err) {
        console.error(err);
        next(err);
    }
});




router.get('/hashtag', async(req,res,next)=> {
    const query = req.query.hashtag;
    if(!query) {
        return res.redirect('/');
    }
    try {
        const hashtag = await Hashtag.findOne({where: {title: query}});
        let posts = [];
        console.log(query + ' is comming');
        if(hashtag) {
            posts = await hashtag.getPosts({ include: [{model:User},{model:User, as:'Liker'}]});
        }
        console.log(posts);
        return res.render('main' , {
            title: `${query} || NodeBird`,
            twits: posts,
            likes: posts.map(v => v.Liker.map(v => v.id)).reverse(),
        });
    } catch(error) {
        console.error(error);
        return next(error);
    }
});



module.exports = router;
