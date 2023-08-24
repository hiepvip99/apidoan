// const jwt = require("jsonwebtoken");
// const { validateEmail, validatePassword } = require("../utils/validation");
const db = require("../databases/db");

const authController = {
  login(req, res) {
    const { email, password } = req.body;

    // Validate email and password
    if (!validateEmail(email) || !validatePassword(password)) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Check if the email and password match a user in the database
    const query = "SELECT * FROM users WHERE email = ? AND password = ?";
    db.query(query, [email, password], (error, results) => {
      if (error) {
        console.error("Error executing database query: ", error);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (results.length === 0) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Generate and return a JWT token
      const user = results[0];
      const token = jwt.sign({ userId: user.id }, "secretKey");
      res.json({ token });
    });
  },
};

module.exports = authController;
