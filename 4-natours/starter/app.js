const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const app = express();

//////////MIDDLEWARES///////////
//3rd party middleware
app.use(morgan('dev'));
app.use(express.json()); //Middleware can modify the incoming request data it stands between request and response
app.use(express.static(`${__dirname}/public`)); //Middleware to serve static file from a folder

//Creating global middleware
//Middleware will aplly to EVERY request because we didn't specify any route
//Middleware will run in oreder defined by the code
//If this was in the end it wouldn't run because we have middleware that sends the response
app.use((req, res, next) => {
  console.log('Hello from the middleware!');
  //If we don't use next client will never get a response because the next function tells the code to go to the next stage
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

///////ROUTES//////
//Mounting routers //these are middleware only usable in the specific routes

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
