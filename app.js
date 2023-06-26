const express = require("express");
const { getAllTopics } = require("./controllers/topics.controller");
const {handlePsqlErrors ,handleCustomErrors}= require("./errors");

const app = express();

app.use(express.json());

app.get('/api/topics', getAllTopics);


app.use(handlePsqlErrors);
app.use(handleCustomErrors);

module.exports = app;