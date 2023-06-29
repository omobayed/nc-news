const db = require("../db/connection")

exports.selectCommentsByArticleId = (articleId) => {
    return db
        .query('SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC ;', [articleId])
        .then((result) => {
            return result.rows;
        })
}

exports.insertCommentToArticle = (articleId, username, body) => {
    return db
        .query(
            "INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *;",
            [articleId, username, body]
        )
        .then(({ rows }) => rows[0])
        .catch((error) => {
            return Promise.reject({ status: 404, msg: error.detail })
        });
}

exports.deleteCommentById = (comment_id) => {
    return db
        .query('DELETE FROM comments WHERE comment_id = $1 RETURNING *;', [comment_id])
        .then((result) => {
            if (result.rows.length === 0) {
                return Promise.reject({ status: 404, msg: "Comment not found" })
            }
            return result.rows[0]
        })
}