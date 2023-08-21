const jwt = require("jsonwebtoken");

const shoesController = {
  getAll(req, res) {
    // Access the token from the request
    const token = req.cookies.token; // Example using cookie

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      // Verify and decode the token
      const decodedToken = jwt.verify(token, "secretKey");
      const userId = decodedToken.userId;

      // Perform actions for authorized user
      // ...

      res.json({ message: "Authorized user" });
    } catch (error) {
      console.error("Error verifying token: ", error);
      return res.status(401).json({ error: "Invalid token" });
    }
  },
};

module.exports = shoesController;
