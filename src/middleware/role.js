
//this middleware to check if user is role authorized or not
module.exports.role = (role) => (req, res, next) => {
    if (req.user.role === role) {
        return next();
    } else {
        return res.status(403).send({ message: `your aren't authorized, only ${role} role can perform this action ` })
    }
}

