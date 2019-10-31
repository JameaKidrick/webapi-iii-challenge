/******************************** SERVER SETUP ********************************/
const express = require('express'); // import express
const server = express(); // create server
const helmet = require('helmet'); // import helmet (install: npm i helmet)
const morgan = require('morgan'); // import morgan (install: npm i morgan)

// import both routers
const postRouter = require('./posts/postRouter');
const userRouter = require('./users/userRouter');

//custom global middleware
const logger = (req, res, next) => { // ADD MORGAN? AND MAKE LOCAL
  console.log(
    `The Logger: [${new Date().toISOString()}] ${req.method} to ${req.url}`
  )
  next();
};

server.use(helmet()); // security: prevents header from showing that we are using express
server.use(express.json());
server.use(logger);
server.use(morgan('dev'));

server.use('/api/posts', postRouter)
server.use('/api/users', userRouter)

server.get('/', (req, res) => { // ADD LOGGER
  res.send(`<h2>Let's write some Middleware!</h2>`)

})
module.exports = server;
