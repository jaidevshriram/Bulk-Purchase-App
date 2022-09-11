/*
 * Manage Session in Node.js and ExpressJS
 * Author : Shahid Shaikh
 * Version : 0.0.2
*/
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const redis = require('redis');
const redisStore = require('connect-redis')(session);
const client  = redis.createClient();
const router = express.Router();
const cors = require('cors');
const app = express();

app.use(session({
    secret: 'ssshhhhh',
    // create new redis store.
    store: new redisStore({ host: 'localhost', port: 6379, client: client,ttl : 260}),
    saveUninitialized: false,
    resave: false
}));

app.use(bodyParser.json());      
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/views'));

router.get('/',(req,res) => {
    let sess = req.session;
    if(sess.email) {
        return res.end('admin');
    }
});

router.use('/login',(req,res) => {
    req.session.email = req.body.email;
    res.end('done');
});

router.get('/admin',(req,res) => {
    console.log(req.session.key);
    console.log(req.session)
    if(req.session.email) {
        res.write(`<h1>Hello ${req.session.email} </h1><br>`);
        res.end('<a href='+'/logout'+'>Logout</a>');
    }
    else {
        res.write('<h1>Please login first.</h1>');
        res.end('<a href='+'/'+'>Login</a>');
    }
});

router.get('/logout',(req,res) => {
    req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        res.end('done')

    });

});

app.use('/', router);
app.use(cors());

app.listen(4000,() => {
    console.log(`App Started on PORT 4000`);
});