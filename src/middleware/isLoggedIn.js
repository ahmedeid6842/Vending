const jwt = require("jsonwebtoken")

// this middleware to ensure user will n't logged in if he already does
module.exports.isLoggedIn = async (req, res, next) => {
    /**
     * DONE: check if no access token provided then move to next middleware
     * DONE: verify provided, if verfied then user is logged in else isn't.
     */
    try {

        let accessJWT = req.cookies['accessjwt'];

        if (!accessJWT) {
            return next();
        }

        let user = jwt.verify(accessJWT, process.env.ACCESS_TOKEN_SECRET);

        return res.status(400).send({ message: `"userName": ${user.userName} already login, try to logout first` })
    } catch (err) {
        if (err.message === "jwt expired") {
            return next();
        } else if (err.message == "invalid signature") {
            return res.status(401).send({ path: "Access Token", message: "invalid token provided" });
        }
        return res.send(err.message)
    }
}