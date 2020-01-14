var jwt = require('jsonwebtoken');
var config = require('./config');

module.exports = (req, res, next) => {
    try {

        const jwttoken = req.body.jwttoken || req.query.jwttoken || req.params.jwttoken || req.headers.jwttoken;
        if (jwttoken) {
            const decoded = jwt.verify(jwttoken, config.secret)
            req.decoded_data = decoded;
            next()
        }
        else {
            res.status(200).json({ success: false, message: "invalid jwttoken" })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "invalid jwttoken" })
    }
}