const config = require('./config');
const database = require("./database");
const app = require("./app");

database().then(info =>{
  console.log(`Connected to ${info.host}:${info.port}/${info.name}`);
  app.listen(config.PORT, () => 
  console.log(`Listen server on ${config.PORT} port`));
})
.catch(() =>{
  console.error("Unable to connect to database");
  process.exit(1);
});


