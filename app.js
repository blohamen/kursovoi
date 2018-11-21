const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const userModel  = require('./models/user');
const problemModel = require('./models/problem');
const app = express();
let expert = null; 
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/form', (req, res) => res.render('form'));

app.get('/registration', (req, res) => res.render('registration'));

app.get('/admin', async (req, res) => {
  const usersData = await userModel.find({});
  return res.render('admin', { users: usersData });
});

app.get('/user', async (req, res) => {
  const problemsData = await problemModel.find({});
  const usersData = await userModel.find({ rule: 'expert' });
  return res.render('user', { users:usersData, problems: problemsData });
});

app.get('/expert', async (req, res) => {
  const problems = JSON.stringify(await problemModel.find({})); // todo pass expert
  return res.render('expert', { problems, expert: JSON.stringify(expert) });
});

app.post('/registration', async (req,res) => {
  const { login, password } = req.body;
  const user = await userModel.findOne({login: new RegExp('^'+login+'$', "i")});
  if (!user) {
    userModel.create({
      login: login,
      password: password,
      rule: "user"
    });
    return res.redirect('/form');
  }
  return res.sendStatus(400);
});

app.post('/form', async (req,res) => {
  const { login, password } = req.body;
  const user = await userModel.findOne({
    login: new RegExp('^'+login+'$', "i"),
    password: new RegExp('^'+password+'$', "i")
  });
    if(!user) {
       return res.status(400).render('403');
    }
  switch (user.rule) {
    case 'admin': return res.redirect('/admin');
    case 'user': return res.redirect('/user');
    case 'expert': {
      expert = user;
      return res.redirect("/expert");
  }
}
});

app.post('/expert', bodyParser.json(), async (req, res) => {
  await userModel.findOneAndUpdate(expert.toObject(), req.body);
  return res.sendStatus(200);
});

app.post('/admin', bodyParser.json(), async (req, res) => {
  try {
    await userModel.findOneAndRemove(req.body);
    return res.sendStatus(200);
  } catch (e) {
    return res.sendStatus(500);
  }
});

app.use(function(req, res) {
  res.status(404).render("404");
});

module.exports = app;  