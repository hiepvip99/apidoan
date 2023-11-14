// tokenManager.js

const randomstring = require('randomstring');
let resetTokens = {};

function generateToken(email) {
    // Generate a random 6-digit token
    const resetToken = randomstring.generate({ length: 6, charset: 'numeric' });

    // Store the token in the resetTokens object with a 5-minute expiration
    resetTokens[email] = {
        token: resetToken,
        expiration: Date.now() + 30 * 60 * 1000, // 10 minutes in milliseconds
    };


    return resetToken;
}

function getResetToken(email) {
    return resetTokens[email];
}

function deleteResetToken(email) {
    delete resetTokens[email];
}

module.exports = {
    generateToken,
    getResetToken,
    deleteResetToken,
};
