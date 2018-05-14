const express = require('express');
const bodyParser = require('body-parser');

const path = require('path');
 
const user  = require('./models/post');
const app = express();
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/form', (req, res) => res.render('form'));

app.get('/registration', (req, res) => res.render('registration'));

app.post('/registration', (req,res) =>{
  const {login, password} = req.body;
  user.findOne({login: new RegExp('^'+login+'$', "i")}, function(err,User){
    if(err)res.sendStatus(400);
    if(!User) {
      user.create({
        login: login,
        password: password,
      });
      res.redirect('/form');
    }
    res.sendStatus(400);
  });
})

app.post('/form', (req,res) =>{
  const {login, password} = req.body;
  user.findOne({
    login: new RegExp('^'+login+'$', "i"), 
    password: new RegExp('^'+password+'$', "i")
  }, function(err, User){
    if(User){
      res.redirect('/');
  }
})
});
app.get('/', function (req, res) {
  res.render('index');
})
 
module.exports = app; 