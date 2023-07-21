const db = require("../db/connection")

exports.selectArticleById = (article_id) => {
    let queryStr = 'SELECT articles.*, COUNT(comment_id) AS comment_count ' +
        'FROM articles ' +
        'LEFT OUTER JOIN comments ON articles.article_id = comments.article_id ' +
        'WHERE articles.article_id = $1 ' +
        'GROUP BY articles.article_id';

    return db
        .query(queryStr, [article_id])
        .then((result) => {
            if (result.rows.length === 0) {
                return Promise.reject({ status: 404, msg: "Article not found" })
            }
            return result.rows[0]
        });
}

exports.selectAllArticles = (topic, sort_by, order) => {
    const validSortBy = ["title", "topic", "author", "created_at", "votes", "article_id", "comment_count"];
    const validOrder = ["desc", "asc"];

    const queryValues = [];
    let queryStr = 'SELECT articles.author, title, articles.article_id, topic, articles.created_at, article_img_url, articles.votes, COUNT(comment_id) AS comment_count ' +
        'FROM articles ' +
        'LEFT OUTER JOIN comments ON articles.article_id = comments.article_id ';

    if (topic) {
        queryStr += "WHERE articles.topic = $1 ";
        queryValues.push(topic);
    }

    queryStr += 'GROUP BY articles.article_id ';
    if (!order) {
        order = "desc";
    }
    else {
        if (!validOrder.includes(order)) {
            return Promise.reject({ status: 400, msg: "Bad Request" });
        }
    }

    if (sort_by) {
        if (!validSortBy.includes(sort_by)) {
            return Promise.reject({ status: 400, msg: "Bad Request" });
        }
        queryStr += `ORDER BY ${sort_by} ${order};`;
    }
    else {
        queryStr += `ORDER BY created_at ${order};`;
    }

    return db
        .query(queryStr, queryValues)
        .then((result) => {
            return result.rows;
        })
}

exports.updateArticleVotes = (article_id, inc_votes) => {
    return db
        .query(
            "UPDATE articles SET votes = votes + $2 WHERE article_id = $1 RETURNING *;",
            [article_id, inc_votes])
        .then((result) => {
            if (result.rows.length === 0) {
                return Promise.reject({ status: 404, msg: "Article not found" })
            }
            return result.rows[0];
        })
}
