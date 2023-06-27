const { getApi } = require("./controllers/app.controllers");
const { getAllTopics } = require("./controllers/topics.controller");
const { getArticleById, getAllArticles} = require("./controllers/articles.controller")
const { getCommentsByArticleId } = require("./controllers/comments.controller")
const { handlePsqlErrors, handleCustomErrors } = require("./errors");

const express = require("express");
const app = express();

app.get('/api', getApi);
app.get('/api/topics', getAllTopics);
app.get('/api/articles', getAllArticles)
app.get('/api/articles/:article_id', getArticleById)
app.get('/api/articles/:article_id/comments', getCommentsByArticleId)
app.all("*", (req, res) => {
    res.status(404).send({ msg: "Not found" });
})

app.use(handlePsqlErrors);
app.use(handleCustomErrors);

module.exports = app;