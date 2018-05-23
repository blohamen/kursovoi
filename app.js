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



let expert;

let problems;
problem.find({}, null, function (err, res) {
  problems = res;
});

app.get('/registration', (req, res) => res.render('registration'));
app.get('/admin', (req, res) => res.render('admin'));
app.get('/user', (req, res) => res.render('user'));
app.get('/expert', (req, res) => {
  res.render('expert', {problems: problems, expert:expert});
});


app.post('/registration', (req,res) =>{
  const {login, password} = req.body;
  user.findOne({login: new RegExp('^'+login+'$', "i")}, function(err,User){
    if(!User) {
      user.create({
        login: login,
        password: password,
        rule: false
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
    console.log(req.body);
    console.log(req.body.rating);
    res.end("HI");
})

app.get('/', function (req, res) {
  res.render('index');
})
 
module.exports = app; 