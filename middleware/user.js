const { Course, User } = require("../db");
async function userMiddleware(req, res, next) {
    try {
        const username = req.headers.username; 
        if (!username) {
            return res.status(401).json({
                error: "Username is missing in headers"
            });
        }
        const isUserExists = await User.findOne({
            userName: username
        });
        if (!isUserExists) {
            return res.status(409).json({
                error: "User Not Exist"
            });
        }
        else {
            next();
        }
    } catch (error) {
        res.status(500).json({
            error: "INTERNAL SERVER ERROR"
        });
    }
}

module.exports = userMiddleware;