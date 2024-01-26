///--------------------------------------------
//Title: config.js
//Author: Kyle Hochdoerfer
//Date: 01/17/24
//Description: Configuration file for nodebucket
//---------------------------------------------

"use strict"

const db = {
  username: "nodebucket_user",
  password: "s3cret",
  name: "nodebucket"
}

const config = {
  port: 3000,
  dbUrl: `mongodb+srv://${db.username}:${db.password}@cluster0.tydee4p.mongodb.net/nodebucket?retryWrites=true&w=majority`,
  dbname: db.name
}

module.exports = config;