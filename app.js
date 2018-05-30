const express = require('express');
const bodyParser = require('body-parser');

const path = require('path');
 
const user  = require('./models/user');
const problem = require('./models/problem');
const app = express();
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/form', (req, res) => res.render('form'));



let expert; // идентификационная переменная (вместо cookie)
let admin;
app.get('/registration', (req, res) => res.render('registration'));
app.get('/admin', (req, res) => {
  if(!admin) res.render('403');
  user.find({})
  .then(data=>{
    res.render('admin', {users: data});
  })
});

app.get('/user', (req, res) => {
      problem.find({})
      .then(problems =>{
        user.find({rule:"expert"})
        .then(users =>{
          res.render('user', {users:users, problems: problems});
        })
      }) 
});

app.get('/expert', (req, res) => {
  if(!expert) res.render('403');
  problem.find({})
  .then(problems=>{
    res.render('expert', {problems: problems, expert:expert});
  });
});


app.post('/registration', (req,res) =>{
  const {login, password} = req.body;
  user.findOne({login: new RegExp('^'+login+'$', "i")}, function(err,User){
    if(!User) {
      user.create({
        login: login,
        password: password,
        rule: "user"
      });
      res.redirect('/form');
    }
    else{
    res.sendStatus(400);
    }
  });
})

app.post('/form', (req,res) =>{
  const {login, password} = req.body;
  user.findOne({
    login: new RegExp('^'+login+'$', "i"), 
    password: new RegExp('^'+password+'$', "i")
  }, function(err, User){
    if(User && User.rule === "admin"){
      admin = JSON.stringify(User);
     res.redirect('/admin');
  } else if(User && User.rule === "user"){
    res.redirect('/user');
  } else if(User && User.rule === "expert"){
    expert = JSON.stringify(User);
    res.redirect("/expert");  
  }
    else  {
     res.sendStatus(400);
    } 
  })
});

app.post('/expert', bodyParser.json(), function(req, res){
    user.findOneAndUpdate(JSON.parse(expert), req.body, function(err){
      if(err) res.sendStatus(500);
      return res.sendStatus(200);
    });
})

app.get('/', function (req, res) {
  res.render('index');
})
 
app.post('/admin', bodyParser.json(), function(req, res){
  user.findOneAndRemove(req.body, function(err){
    if(err) res.sendStatus(500);
  });
})

app.use(function(req, res,next) {
  res.status(404).render("404");
});

module.exports = app;  