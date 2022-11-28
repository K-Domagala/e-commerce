const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const users = require('./users');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
const cookieParser = require('cookie-parser')

const initializePassport = require('./passport-config');
const { response } = require('express');

app.set('port', 3001);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(session({
  secret: 'secrets',
  resave: true,
  saveUninitialized: true
}));
app.use(cookieParser('secrets'))
app.use(passport.initialize());
app.use(passport.session());
initializePassport(passport);

app.get('/',(request,response)=>{
  response.json({msg: 'Welcome to our e-commerce website!!'});
});

app.get('/profile', (req, res) => {
  //console.log(req);
 // if(req.user){
    console.log(req.user);
    res.json({user: req.user});
  // } else {
  //   res.json({user: null});
  // }
})

app.post("/login", (req, res, next) => {
  console.log('recieved req')
  passport.authenticate("local", (err, user, info) => {
    if (err) throw err;
    if (!user) res.json({message: "Username and password don't match"});
    else {
      req.logIn(user, (err) => {
        if (err) throw err;
        res.json(user);
      });
    }
  })(req, res, next);
});

app.use('/users', users);

app.listen(3001,()=>{
 console.log('Express server started at port 3001');
});