//DONE: internal server errors with express-async-erros
const log = require("../utils/logger");

module.exports.errorHandler = async (error, req, res, next) => {
    log.error(error.stack)
    return res.status(500).send("something went wrong");
}