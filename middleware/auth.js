const jwt = require("jsonwebtoken");
const  jstSecretKey  = require("../config/production").jwtSecret;

// * Desc: Middleware to check authentication
// * Testing: Passed ✔ (20-03-2022)

module.exports = (req, res, next) => {
    const token = req.header("x-auth-token");
    if (!token)
        return res.status(401).json({ msg: "No token, authorization denied" });

    try {
        const descoded = jwt.verify(token, jstSecretKey);
        req.user = descoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: "Token is not valid" });
    }
};
