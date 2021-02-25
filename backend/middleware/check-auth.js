const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // "Token Ex: Bearer tokenb"
    // we are storing this in one variable because our token is made from emailID and userId
    // (Check jwt.sign method for confirmation) and will pass this info to other request from this middleware
    const decodedToken = jwt.verify(token, "secret_this_should_be_longer");
    // Adding userData field to further request
    req.userData = { email: decodedToken.email, userId: decodedToken.userId };
    next();
  } catch (er) {
    res.status(401).json({
      message: "You are not authenticated"
    }
    )
  }
}
