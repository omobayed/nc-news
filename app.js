const { getApi } = require("./controllers/app.controllers");
const { getAllTopics } = require("./controllers/topics.controller");
const { getArticleById, getAllArticles } = require("./controllers/articles.controller")
const { getCommentsByArticleId, addCommentToArticle } = require("./controllers/comments.controller")
const { handlePsqlErrors, handleCustomErrors, handleServerErrors } = require("./errors");

const express = require("express");
const app = express();
app.use(express.json());

app.get('/api', getApi);
app.get('/api/topics', getAllTopics);
app.get('/api/articles', getAllArticles)
app.get('/api/articles/:article_id', getArticleById)
app.get('/api/articles/:article_id/comments', getCommentsByArticleId)
app.post('/api/articles/:article_id/comments', addCommentToArticle)
app.all("*", (req, res) => {
    res.status(404).send({ msg: "Not found" });
})

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors)

module.exports = app;