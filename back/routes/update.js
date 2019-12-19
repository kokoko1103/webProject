const express = require('express');
const db = require('../models');
const multer = require('multer');
const path = require('path');
const { isLoggedIn } = require('./middleware');

const router = express.Router();

const upload = multer({
    storage: multer.diskStorage({
      destination(req, file, done) {
        done(null, 'uploads');
      },
      filename(req, file, done) {
        const ext = path.extname(file.originalname);
        const basename = path.basename(file.originalname, ext); // 제로초.png, ext===.png, basename===제로초
        done(null, basename + new Date().valueOf() + ext);
      },
    }),
    limits: { fileSize: 20 * 1024 * 1024 },
  });

router.patch('/:id/post', isLoggedIn, upload.none(),async (req, res, next) => {
    try{
        await db.Post.update({
            content:req.body.content
        },{
            where:{ id: req.params.id}
        });
        const updatePost = await db.Post.findOne({
            where:{ id : req.params.id},
            include:[{
                model: db.User,
                attributes:['id','nickname','RegionId']
            },{
                model: db.Image
            },{
                model: db.User,
                as:'Like',
                through:'Likers',
                
            }]
        })
    }catch(e) {
        console.log(e);
        next(e);
    }
});

module.exports = router;