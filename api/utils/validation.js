var validator = require("email-validator");
validator.validate("test@email.com");

function validateEmail(email) {
    validator.validate(email);
  // Implement email validation logic
  // Return true if email is valid, otherwise false
}

function validatePassword(password) {
  // Implement password validation logic
  // Return true if password is valid, otherwise false
}

module.exports = { validateEmail, validatePassword };
