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


/* const randomstring = require('randomstring');
let resetTokens = {};

async function generateToken(email) {
    // Generate a random 6-digit token
    const resetToken = randomstring.generate({ length: 6, charset: 'numeric' });

    // Store the token in the resetTokens object with a 5-minute expiration
    await updateResetTokens(email, {
        token: resetToken,
        expiration: Date.now() + 30 * 60 * 1000, // 10 minutes in milliseconds
    });

    return resetToken;
}

async function getResetToken(email) {
    return resetTokens[email];
}

async function deleteResetToken(email) {
    delete resetTokens[email];
}

async function updateResetTokens(email, data) {
    return new Promise((resolve) => {
        setImmediate(() => {
            resetTokens[email] = data;
            resolve();
        });
    });
}

module.exports = {
    generateToken,
    getResetToken,
    deleteResetToken,
};
 */