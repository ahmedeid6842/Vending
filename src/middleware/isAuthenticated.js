const jwt = require("jsonwebtoken");
const { getUserService } = require("../services/user");
const { log } = require("../utils/logger");
// this middleware to ensure that incoming request from authenticated user
module.exports.isAuthenticated = async (req, res, next) => {
    /**
     * DONE: check if access token is provided or not
     * DONE: verify the token
     * DONE: check if userId in jwt matching any user [in case user deleted and access token still valid]
     * DONE: check if access token is expired , 
     */

    try {
        let accessJWT = req.cookies['accessjwt']
        if (!accessJWT) return res.status(400).send({ path: "Access Token", message: 'no token provided' });

        let user = jwt.verify(accessJWT, process.env.ACCESS_TOKEN_SECRET);

        user = await getUserService({ userName: user.userName });
        if (!user) return res.status(400).send({ path: "user", message: `"userName":${req.body.userName} not found` });

        req.user = user;
        next();
    } catch (err) {
        if (err.message === "jwt expired") {
            return res.status(440).send({ path: "Access Token", message: "your session is expired, login again" });
        } else if (err.message == "invalid signature") {
            return res.status(401).send({ path: "Access Token", message: "invalid token provided" });
        } else {
            log.error(err);
            return res.status(500).send("something went wrong")
        }
    }
}

