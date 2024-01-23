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


/**
 * findEmployeeById
 * @swagger
 * /api/employees/{id}:
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
 *         description: Employee document
 *       '400':
 *         description: Employee ID must be a number
 *       '404':
 *         description: Unable to find employee with empId:
 *       '500':
 *         description: Server Exception
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
    //Output an error statement and pass err into next
    console.error("Error " + err);
    next(err);
  }
})

//Export router
module.exports = router