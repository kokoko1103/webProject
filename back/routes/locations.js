const express = require('express');
const db = require('../models');
const router = express.Router();

router.get('/:id', async(req, res, next) => {
    try {
        let where= {};
        console.log('req.query.lastId',req.query.lastId);
        if(parseInt(req.query.lastId, 10)){
            where = {
              id:{
                [db.Sequelize.Op.lt]:parseInt(req.query.lastId,10),
              }
            }
          }
        const location = await db.Post.findAll({
            where,
            include:[{
                model:db.User,
                where:{RegionId : parseInt(req.params.id, 10)},
                attributes:['id','nickname','RegionId']
            },{
                model: db.Image
            },{
                model:db.User,
                through:'Like',
                as:'Likers',
                attributes:['id','nickname']
            }],
            order: [['createdAt', 'DESC']], // DESC는 내림차순, ASC는 오름차순
            limit: parseInt(req.query.limit),
        });
        console.log(location);
        return res.json(location);
    } catch (e) {
        console.log(e);
        next(e);
    }
});

module.exports = router;