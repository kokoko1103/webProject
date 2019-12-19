const express = require('express');
const next = require('next');
const morgan = require('morgan');
const dotenv = require('dotenv');
const session = require('express-session');
const cookie = require('cookie-parser');

const dev = process.env.NODE_ENV !== 'production';
const production = process.env.NODE_ENV === 'production';

const app = next({ dev });
const handle = app.getRequestHandler();
dotenv.config();

app.prepare().then(() => {
    const server = express();

    server.use(morgan('dev'));
    server.use(express.json());
    server.use(express.urlencoded({extended:true}));
    server.use(cookie(process.env.COOKIE_SECRET));
    server.use(session({
        resave : false,
        saveUninitialized : false,
        secret : process.env.COOKIE_SECRET,
        cookie : {
            httpOnly : true,
            secure : false
        }
    }));

    server.get('/hashtag/:tag', (req, res) => {
        return app.render(req, res, '/hashtag', { tag: req.params.tag });   //pages의 hashtag.js파일과 연결이 된다.
    });

    server.get('/user/:id', (req, res) => {
        return app.render(req, res, '/user', { id: req.params.id });    //pages의 user.js파일과 연결이 된다.
    });

    server.get('/locations/:id', (req, res) => {
        return app.render(req,res, '/locations', { id : req.params.id}); //pages의 location.js파일과 연결이 된다.
    });

    server.get('/post/:title', (req,res) => {
        return app.render(req,res, '/post', { title : req.params.title});   //pages의 post.js파일과 연결이 된다.
    })

    server.get('*', (req, res) => { // *는 모든요청을 받겠다는 것이다.
        return handle(req, res);
    });

    server.listen(1103, () => {
        console.log('1103에서 시작헌다.')
    });
});
