const express = require("express");
const { getApi } = require("./controllers/app.controllers");
const { getAllTopics } = require("./controllers/topics.controller");
const { handlePsqlErrors, handleCustomErrors } = require("./errors");
const app = express();

app.get('/api', getApi);
app.get('/api/topics', getAllTopics);
app.all("*", (req, res) => {
    res.status(404).send({ msg: "Not found" });
})

app.use(handlePsqlErrors);
app.use(handleCustomErrors);

module.exports = app;