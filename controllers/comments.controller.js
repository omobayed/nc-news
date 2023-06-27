const { selectArticleById } = require("../models/articles.model");
const { selectCommentsByArticleId } = require("../models/comments.model")

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
