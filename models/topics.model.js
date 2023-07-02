const db = require("../db/connection")

exports.selectAllTopics = () => {
    return db
        .query("SELECT * FROM topics;")
        .then((result) => result.rows);
}

exports.selectTopicBySlug = (slug) => {
    return db
        .query("SELECT * FROM topics WHERE slug = $1;", [slug])
        .then((result) => {
            if (result.rows.length === 0) {
                return Promise.reject({ status: 404, msg: "Topic Not Found" })
            }
            return result.rows
        });
}