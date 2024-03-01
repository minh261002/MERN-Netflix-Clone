const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token;

    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
            if (err) {
                res.status(401).json("Token không hợp lệ"); 
            } else {
                req.user = user;
                next();
            }
        });
    } else {
        res.status(403).json('Không được phép');
    }
}

module.exports = verifyToken;
