///--------------------------------------------
//Title: mongo.js
//Author: Kyle Hochdoerfer
//Date: 01/17/24
//Description: File for connecting to mongoDB database
//---------------------------------------------

//Use strict mode
"use strict;"

//Require mongoClient
const { MongoClient } = require("mongodb")
const config = require("./config")

//Store a db connection URL as a variable
const MONGO_URL = config.dbUrl;

//Connect to the database and output a message saying so to the console
const mongo = async(operations, next) => {
  try {
    console.log("Connecting to db...")

    //Connect to MongoDB
    const client = await MongoClient.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    //Set database as nodebucket
    const db = client.db(config.dbname);
    console.log("Connected to db.")

    //Await the connection to the database, and output a message stating its connected once successful
    await operations(db);
    console.log("Operation was successful")

    //Close client
    client.close()

  } catch (err) {
    //Upon failure to connect, set error status to 500 and create an error variable
    const error = new Error("Error connecting to db: ", err);
    error.status = 500;

    //Output an error message to the console, and provide the error variable to next
    console.log("Error connecting to db: ", err);
    next(error);
  }
}

//Export the mongo module
module.exports = { mongo }