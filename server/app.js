/**
 * Title: app.js
 * Author: Professor Krasso
 * Date: 8/5/2023
 */
'use strict'

// Require statements
const express = require('express')
const createServer = require('http-errors')
const path = require('path')
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const employeeRoute = require("./routes/employee");

//Create an options object containing a title and version number
const options = {
  definition: {
      openapi: "3.0.0",
      info: {
          title: "Nodebucket API",
          version: "1.0.0",
      },
  },
  //Set the object APIs to be in the routes folder
  apis: ['server/routes/*.js'],
};

//Declare an openapi specifications variable using the swaggerJsdoc library
const openapiSpecification = swaggerJsdoc(options);

// Create the Express app
const app = express()

//Wire the openapispecification variable to the app variable
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));


// Configure the app
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, '../dist/nodebucket')))
app.use('/', express.static(path.join(__dirname, '../dist/nodebucket')))

app.use("/api/employees", employeeRoute)

// error handler for 404 errors
app.use(function(req, res, next) {
  next(createServer(404)) // forward to error handler
})

// error handler for all other errors
app.use(function(err, req, res, next) {
  res.status(err.status || 500) // set response status code

  // send response to client in JSON format with a message and stack trace
  res.json({
    type: 'error',
    status: err.status,
    message: err.message,
    stack: req.app.get('env') === 'development' ? err.stack : undefined
  })
})

module.exports = app // export the Express application