const express = require('express');

const { isLoggedIn } = require('./middlewares');
const User = require('../models/user');
const Post = require('../models/post');
const router = express.Router();

router.post('/:id/follow', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    console.log(user);
    if (user) {
      await user.addFollowing(parseInt(req.params.id, 10));
      res.send('success');
    } else {
      res.status(404).send('no user');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete('/:id/unfollow', isLoggedIn, async(req,res,next) => {
  try{
    const user = await User.findOne({ where: { id: req.user.id}});
    if(user) {
      await user.removeFollowing(parseInt(req.params.id, 10));
      res.send('success');
    } else {
      res.status(404).send('no user');
    }
  } catch( error) {
    console.error(error);
    next(error);
  }
});

router.delete('/:id/unfollower', isLoggedIn, async(req,res,next) => {
  try{
    const user = await User.findOne({ where: { id: req.params.id}});
    if(user) {
      await user.removeFollowing(parseInt(req.user.id, 10));
      res.send('success');
    } else {
      res.status(404).send('no user');
    }
  } catch( error) {
    console.error(error);
    next(error);
  }
});

router.delete('/:id/delete', async(req,res,next) => {
  try{
      const user = await User.findOne({ where: { id: req.user.id}}); 
      if(user) {
          await user.removePost(parseInt(req.params.id, 10));
          await Post.destroy({where: {id : req.params.id}});
          res.send('success');
      } else {
          res.status(404).send('no user');
      }
      } catch(error) {
          console.error(error);
          next(error);
      }
});

router.post('/:id/like', async(req,res,next) => {
  try{
    const post = await Post.findOne({where: {id: req.params.id}});
    await post.addLiker(parseInt(req.user?.id,10));
    res.send('success');
  } catch(error) {
    console.error(error);
    next(error);
  }
})

router.delete('/:id/unlike', async(req,res,next) => {
  try{
    const post = await Post.findOne({where: {id: req.params.id}});
    await post.removeLiker(parseInt(req.user?.id,10));
    res.send('success');
  } catch(error) {
    console.error(error);
    next(error);
  }
})

router.post('/edit', async(req,res,next) => {
  const {nick} = req.body;
  try{
    const user = await User.findOne({where: { id : req.user.id}});
    console.log(user);
    await user.update({
      nick: nick,
    }) 
    res.redirect('/');
    } catch(error) {
    console.error(error);
    next(error);
    }
})




module.exports = router;