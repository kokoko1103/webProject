const express = require('express');
const db = require('../models');

const router = express.Router();

router.get('/:tag', async(req, res, next) => {
    try{
        let where={};
        if(parseInt(req.query.lastId, 10)){
            where={
                id:{
                    [db.Sequelize.Op.lt]:parseInt(req.query.lastId,10),
                }
            }
        }
        const result = await db.Post.findAll({
            where,
            include:[{
                model: db.Hashtag,
                where: { name: decodeURIComponent(req.params.tag) },    //주소창에 영어가 아닌 한글, 특수문자가 올경우 외계어로 오는데 이거를 정상적으로 불러오기 위해서 decodedURIComponent를 사용한다.
            },{
                model: db.User,
                attributes:['id', 'nickname','RegionId']
            },{
                model: db.Image,
            },{
                model:db.User,
                through: 'Like',
                as: 'Likers',
                attributes: ['id']
            },{
                model: db.Post,
                as: 'Retweet',
                include:[{
                    model: db.User,
                    attributes:['id', 'nickname','RegionId']
                },{
                    model: db.Image
                }]
            }],
            order:[['createdAt','DESC']],
            limit: parseInt(req.query.limit,10)
        });
        console.log('간다ㅏㄹㅁ아라밍럼이ㅏ러미아러');
        console.log('req.query.lastId',req.query.lastId);
        return res.json(result)
    }catch(err){
        console.log(err);
        next(err);
    }
});

module.exports = router;