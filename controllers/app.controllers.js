const { getEndpoints } = require("../models/app.model")

exports.getApi = (req, res) => {
    getEndpoints()
        .then((endpoints) => {
            res.status(200).send(endpoints)
        })
}