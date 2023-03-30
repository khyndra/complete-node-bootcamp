const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');

//Environment variables are user to define in which environment developer is running
console.log(app.get('env')); //development //set by express
//! When we end our project we should change the NODE_ENV=production
//console.log(process.env); //variables used by nodeJS
//To connect config.env file to our node we install dotenv package and require it

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
