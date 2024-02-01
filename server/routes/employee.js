//--------------------------------------------
//Title: employee.js
//Author: Kyle Hochdoerfer
//Date: 01/17/24
//Description: Routing for employee API operations
//---------------------------------------------

//Use strict mode
"use strict"

//Declarations for express, router, and mongo
const express = require("express");
const router = express.Router();
const { mongo } = require("../utils/mongo");
const Ajv = require('ajv')
const { ObjectId } = require('mongodb')

const ajv = new Ajv()

//Task schema for for employee document
const taskSchema = {
  type: 'object',
  properties:{
    text: { type: 'string'}
  },
  required: ["text"],
  additionalProperties: false
}

//Tasks schema for validating todo and done lists
const tasksSchema = {
  type: 'object',
  required: ['todo', 'done'],
  additionalProperties: false,
  properties: {
    todo: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          _id: { type: 'string'},
          text: { type: 'string'}
        },
        required: ['_id', 'text'],
        additionalProperties: false,
      }
    },
    done: {
      type: 'array',
      items: {
        properties: {
          _id: { type: 'string'},
          text: { type: 'string'}
        },
        required: ['_id', 'text'],
        additionalProperties: false,
      }
    }
  }
}


/**
 * findEmployeeById
 * @swagger
 * /api/employees/{empId}:
 *   get:
 *     tags:
 *       - Employees
 *     description:  API for returning a employee document
 *     summary: returns an employee document
 *     parameters:
 *       - name: empId
 *         in: path
 *         required: true
 *         description: employee document id
 *         schema:
 *           type: number
 *     responses:
 *       '200':
 *         description: OK
 *       '400':
 *         description: Bad Request
 *       '404':
 *         description: Not Found
 *       '500':
 *         description: Internal Server Error
 */
router.get("/:empId", (req, res, next) => {
  try {

    //Hold the employee ID from the request in a variable
    let { empId } = req.params;
    empId = parseInt(empId, 10);

    //If the given ID is not a number, return an error
    if(isNaN(empId)) {
      const err = new Error("Employee ID must be a number")
      err.status = 400
      console.log("err", err);
      next(err);
      return;
    }

    //Check the database to get the employee document with the matching ID
    mongo(async db => {
      const employee = await db.collection("employees").findOne({empId});

      //If the employee is not found, return an error statement saying so
      if (!employee){
        const err = new Error("Unable to find employee with empId " + empId)
        err.status = 404;
        console.log("err", err)
        next(err)
        return;
      }

      //Send the matching employee document as a response
      res.send(employee)
    });

  } catch (err) {
    //Output an error statement and pass the error to the error handler
    console.error("Error " + err);
    next(err);
  }
})

/**
 * findAllTasks
 * @swagger
 * /api/employees/{empId}/tasks:
 *   get:
 *     tags:
 *       - Employees
 *     description:  API for returning all tasks objects from an employee document
 *     summary: returns an object containing employee ID and all Todo and Done tasks
 *     parameters:
 *       - name: empId
 *         in: path
 *         required: true
 *         description: employee document id
 *         schema:
 *           type: number
 *     responses:
 *       '200':
 *         description: OK
 *       '400':
 *         description: Bad Request
 *       '404':
 *         description: Not Found
 *       '500':
 *         description: Internal Server Error
 */
router.get("/:empId/tasks", (req, res, next) => {
  try {
    //Get the empId from the request and parse it as an int
    let { empId } = req.params;
    empId = parseInt(empId, 10)

    //If empId is not a number, trigger a 400 error with a message stating that it must be a number
    if(isNaN(empId)){
      const err = new Error('input must be a number')
      err.status = 400;
      console.error("err", err)
      next(err)
      return;
    }

    //Access the employee mongodb database
    mongo(async db => {
      //Create an employee object by finding the employee with the matching ID, and set it to contain empId, todo and done tasks
      const employee = await db.collection("employees").findOne(
        { empId },
        { projection: {empId: 1, todo: 1, done: 1}}
      )

      //If no employee with a matching ID was found, trigger a 404 error stating that so
      if (!employee){
        const err = new Error('Unable to find employee with empId ' + empId);
        err.status = 404;
        console.error("err", err);
        next(err);
        return
      }

      //Send the employee object as a response
      res.send(employee);

    }, next)
  } catch (err){
    //Output an error message and pass the error to the error handler
    console.error("err", err)
    next(err)
  }
})

/**
 * createTask
 * @openapi
 * /api/employees/{empId}/tasks:
 *   post:
 *     tags:
 *       - Employees
 *     name: createTask
 *     description: API for adding a new task object to an employee document
 *     summary: Creates a new task object
 *     requestBody:
 *       description: Task information
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Created
 *       '400':
 *         description: Bad Request
 *       '404':
 *         description: Not Found
 *       '500':
 *         description: Internal Server Error
 */
router.post("/:empId/tasks", (req, res, next) => {
  try {
    //Get the employee ID from the request and parse it as an int
    let { empId } = req.params;
    empId = parseInt(empId, 10)

    //If the employee ID isn't a number, trigger an error with a message stating so
    if(isNaN(empId)){
      const err = new Error("Input must be a number");
      err.status = 400;
      console.error("err", err);
      next(err)
      return
    }

    //Get the text from the request body, then use ajv to validate it
    const { text } = req.body;
    const validator = ajv.compile(taskSchema)
    const isValid = validator({ text })

    //If the provided text does not fit the required schema, trigger a 400 Bad Request error
    if(!isValid){
      const err = new Error("Bad Request")
      err.status = 400;
      err.errors = validator.errors;
      console.error("err", err)
      next(err)
      return
    }

    //Query the employee database
    mongo( async db => {
      //Find the employee with the ID provided in the request and store the document in an employee object
      const employee = await db.collection('employees').findOne({empId})

      //If no employee is found, trigger a 404 error stating that the employee could not be found
      if (!employee){
        const err = new Error('Unable to find employee with empId ' + empId)
        err.status = 404;
        console.error("err", err);
        next(err)
        return
      }

      //Create a task object with an id and text
      const task = {
        _id: new ObjectId(),
        text
      }

      //Update the employee database, pushing the task object onto the todo array for the employee with the provided ID
      const result = await db.collection('employees').updateOne(
        { empId },
        { $push: { todo : task }}
      )

      //If the database was not successfully modified, trigger a 500 error stating that the task could not be created
      if(!result.modifiedCount){
        const err = new Error("Unable to create task for empId " + empId)
        err.status = 500
        console.error("err", err)
        next(err)
        return
      }

      //Send a successful 201 response with the id of the created task
      res.status(201).send({ id: task._id})
    }, next)

  } catch(err) {
    //If an error occurs, output a message to the console and pass the error to the error handler
    console.error('err', err)
    next(err);
  }
});

/**
 * updateTask
 * @openapi
 * /api/employees/{empId}/tasks:
 *   put:
 *     tags:
 *       - Employees
 *     name: updateTask
 *     description: API for updating an existing document in MongoDB.
 *     summary: Updates an employee's todo and done lists.
 *     parameters:
 *       - name: empId
 *         in: path
 *         required: true
 *         description: Id to filter the collection by.
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Updated task arrays
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - todo
 *               - done
 *             properties:
 *               todo:
 *                 type: array
 *                 items:
 *                    type: object
 *                    properties:
 *                      _id:
 *                        type: string
 *                      text:
 *                        type: string
 *               done:
 *                 type: array
 *                 items:
 *                    type: object
 *                    properties:
 *                      _id:
 *                        type: string
 *                      text:
 *                        type: string
 *     responses:
 *       '204':
 *         description: Task Updated
 *       '400':
 *         description: Bad Request
 *       '404':
 *         description: Not FOund
 *       '500':
 *         description: Internal Server Error
 */
router.put('/:empId/tasks', (req, res, next) => {
  try{
    //Set the empId based on the req.params and parse it as an int
    let { empId } = req.params;
    empId = parseInt(empId, 10);
    console.log('empId', empId);

    //If empId is not a number, cause an error stating so
    if(isNaN(empId)){
      const err = new Error("Input must be a number");
      err.status = 400;
      console.error("err", err);
      next(err)
      return
    }

    //Use AJV to create a validator using the tasksSchema and set a variable to determine if the request is valid
    const validator = ajv.compile(tasksSchema)
    const isValid = validator(req.body)

    //If the request doesn't fit the required format, cause an error stating that it was a bad request
    if(!isValid){
      const err = new Error("Bad Request")
      err.status = 400;
      err.errors = validator.errors;
      console.error("err", err)
      next(err)
      return
    }

    //Query the database to find an employee with the requested ID
    mongo(async db => {
      const employee = await db.collection('employees').findOne({ empId })

      //If no employee is found, cause an error stating so
      if (!employee){
        const err = new Error('Unable to find employee with empId ' + empId)
        err.status = 404;
        console.error("err", err);
        next(err)
        return
      }

      //Once the employee is found, update the employee document and use set to change the task arrays
      const result = await db.collection('employees').updateOne(
        { empId },
        { $set: {todo: req.body.todo, done: req.body.done}}
      )

      //If the result variable was not successfully modified, cause an error stating that no tasks were updated
      if(!result.modifiedCount){
        const err = new Error('Unable to update tasks for EmpId ' + empId)
        err.status = 500
        console.error('err', err)
        next(err)
        return;
      }

      //Send a successful 204 response
      res.status(204).send()
    }, next)

  } catch (err) {
    //If an error occurs, send it to the console and the error handler
    console.error('err', err)
    next(err);
  }
})

/**
 * deleteTask
 * @openapi
 * /api/employees/{empId}/tasks/{taskId}:
 *   delete:
 *     tags:
 *       - Employees
 *     name: deleteTask
 *     description: API for deleting a document from MongoDB.
 *     summary: Removes a document from MongoDB.
 *     parameters:
 *       - name: empId
 *         in: path
 *         required: true
 *         description: Id of the employee whose task is being deleted.
 *         schema:
 *           type: string
 *       - name: taskId
 *         in: path
 *         required: true
 *         description: Id of the task is being deleted.
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: Task deleted
 *       '400':
 *         description: Bad Request
 *       '404':
 *         description: Not Found
 *       '500':
 *         description: Internal Server Error
 */
router.delete("/:empId/tasks/:taskId", (req, res, next) => {
  try{
    //Get the empId and taskId from the req.params and parse empId as an int
    let { empId, taskId } = req.params
    empId = parseInt(empId, 10)

    //If the received empId is not a number, cause an error saying so
    if(isNaN(empId)){
      const err = new Error("Input must be a number");
      err.status = 400;
      console.error("err", err);
      next(err)
      return
    }

    //Query the database for an employee with the matching id number
    mongo(async db => {
      const employee = await db.collection('employees').findOne({ empId })

      //If no matching employee is found, cause an error saying that the employee could not be found
      if (!employee){
        const err = new Error('Unable to find employee with empId ' + empId)
        err.status = 404;
        console.error("err", err);
        next(err)
        return
      }

      //If the todo or done lists are not present, initialize them as an empty array
      if(!employee.todo) employee.todo = []
      if(!employee.done) employee.done = []

      //Filter the todo and done arrays to delete the task
      const todo = employee.todo.filter(task => task._id.toString() !== taskId.toString())
      const done = employee.done.filter(task => task._id.toString() !== taskId.toString())

      //Update the collection with the result of the deletion
      const result = await db.collection('employees').updateOne(
        { empId },
        { $set: { todo: todo, done: done}}
      )

      //Send a 204 success as a response
      res.status(204).send()
    }, next)
  } catch(err){
    //In the event of an error, send it to the console and to the error handler
    console.error('err', err)
    next(err)
  }
})

//Export router
module.exports = router