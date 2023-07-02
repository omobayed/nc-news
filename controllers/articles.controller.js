const articles = require("../db/data/test-data/articles");
const { selectArticleById, selectAllArticles, updateArticleVotes } = require("../models/articles.model");
const { selectTopicBySlug } = require("../models/topics.model");

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    selectArticleById(article_id)
        .then((article) => {
            res.status(200).send({ article })
        })
        .catch(next);
}

exports.getAllArticles = (req, res, next) => {
    const { topic, sort_by, order } = req.query;

    let promises = [selectAllArticles(topic, sort_by, order)]

    if (topic) {
        promises.push(selectTopicBySlug(topic));
    }

    Promise.all(promises)
        .then((results) => {
            const articles = results[0];
            res.status(200).send({ articles })
        })
        .catch(next);
}

exports.updateArticleById = (req, res, next) => {
    const { article_id } = req.params;
    const { inc_votes } = req.body;

    updateArticleVotes(article_id, inc_votes)
        .then((article) => {
            res.status(200).send({ article })
        })
        .catch(next);
}
