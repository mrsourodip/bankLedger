const userModel = require('../ models/user.model')
const jwt = require("jsonwebtoken");



async function authMiddelware(req, res, next) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    // if no token return
    if(!token) {
        return res.status(401).json({
            message: "Unauthorzied access, token is missing",
            status: "failed"
        })
    }

    try {
        // if token found, verify token, find the userId from token and check from db, whether user exists
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await userModel.findById(decoded.userId);
        req.user = user;

        // attach to req, and return next
        return next();

    } catch(err) {
        return res.send(401).json({
            message: "Unauthorized access, token is invalid",
            status: "faied"
        })
    }
}

module.exports = {
    authMiddelware
}