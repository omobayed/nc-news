const { getEndpoints } = require("../models/app.model")

exports.getApi = (req, res, next) => {
    getEndpoints()
        .then((endpoints) => {
            res.status(200).send(endpoints)
        })
        .catch(next);
}