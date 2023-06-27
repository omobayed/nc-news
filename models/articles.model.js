const db = require("../db/connection")

exports.selectArticleById = (article_id) => {
    return db
        .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
        .then((result) => {
            if (result.rows.length === 0) {
                return Promise.reject({ status: 404, msg: "Not found" })
            }
            return result.rows[0]
        });
}

exports.selectAllArticles = () => {
    const queryStr = 'SELECT articles.author, title, articles.article_id, topic, articles.created_at, article_img_url, articles.votes, COUNT(comment_id) AS comment_count ' +
        'FROM articles ' +
        'LEFT OUTER JOIN comments ON articles.article_id = comments.article_id ' +
        'GROUP BY articles.article_id ' +
        'ORDER BY created_at DESC;'

    return db
        .query(queryStr)
        .then((result) => {
            return result.rows;
        })
}
