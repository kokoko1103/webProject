const express = require('express');
const db = require('../models');

const router = express.Router();

router.get('/', async (req, res, next) => { // GET /api/posts
  try {
    let where = {};
    console.log('req.query.lastId',req.query.lastId);
    if(parseInt(req.query.lastId, 10)){
      where = {
        id:{
          [db.Sequelize.Op.lt]:parseInt(req.query.lastId,10),
        }
      }
    }
    const posts = await db.Post.findAll({
      where,
      include: [{
        model: db.User,
        attributes: ['id', 'nickname','RegionId'],
      },{
        model: db.Image,
      },{
        model: db.User,
        as : 'Likers',
        through: 'Like',
        attributes:['id']
      },{
        model: db.Post,
        as : 'Retweet',
        include: [{
          model: db.User,
          attributes:['id', 'nickname']
        },{
          model: db.Image
        }]
      }],
      order: [['createdAt', 'DESC']], // DESC는 내림차순, ASC는 오름차순
      limit: parseInt(req.query.limit),
    });
    res.json(posts);
  } catch (e) {
    console.error(e);
    next(e);
  }
});


module.exports = router;