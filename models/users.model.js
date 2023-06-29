const db = require("../db/connection")
exports.selectUserByUsername = (username) => {
    return db
        .query('SELECT * FROM users WHERE username = $1;', [username])
        .then((result) => {
            if (result.rows.length === 0) {
                return Promise.reject({ status: 404, msg: "User not found" })
            }
            return result.rows[0];
        })
}
