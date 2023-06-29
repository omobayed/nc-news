const { selectArticleById } = require("../models/articles.model");
const { selectCommentsByArticleId, insertCommentToArticle } = require("../models/comments.model");
const { selectUserByUsername } = require("../models/users.model");

exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    selectArticleById(article_id)
        .then((article) => {
            return selectCommentsByArticleId(article_id)
        })
        .then((comments) => {
            res.status(200).send({ comments })
        })
        .catch(next);
}

exports.addCommentToArticle = (req, res, next) => {
    const { article_id } = req.params;
    const { username, body } = req.body;

    selectArticleById(article_id)
        .then((article) => {
            return insertCommentToArticle(article_id, username, body)
        })
        .then((comment) => {
            res.status(201).send({ comment })
        })
        .catch(next);
}