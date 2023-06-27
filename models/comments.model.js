const db = require("../db/connection")

exports.selectCommentsByArticleId = (articleId) => {
    return db
        .query('SELECT * FROM comments WHERE article_id = $1;', [articleId])
        .then((result) => {
            // if (result.rows.length === 0) {
            //     return Promise.reject({ status: 404, msg: "Not found" })
            // }
            return result.rows;
        })
}