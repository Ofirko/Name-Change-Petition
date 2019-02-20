var spicedPg = require("spiced-pg");
const config = require("./config");

var db = spicedPg(
    "postgres:" +
        config.user +
        ":" +
        config.pass +
        "@localhost:5432/wintergreen-petition"
);

//SIGNATURES TABLE

module.exports.getAllSigners = function getAllSigners() {
    return db.query(
        "SELECT users.fname AS fname, users.lname AS lname FROM users JOIN signatures ON users.id = signatures.user_id"
    );
};

module.exports.getCurrentUserSig = function getCurrentUserSig(id) {
    return db.query("SELECT * FROM signatures WHERE id = $1", [id]);
};

module.exports.addSigner = function addSigner(sigraphic, user_id, timestamp) {
    return db.query(
        "INSERT INTO signatures (sigraphic, user_id, timestamp) VALUES($1, $2, $3) RETURNING id",
        [sigraphic, user_id, timestamp]
    );
};

// USERS TABLE

module.exports.getAllUsers = function getAllUsers() {
    return db.query("SELECT * FROM users");
};

module.exports.addUser = function addUser(
    fname,
    lname,
    email,
    password,
    timestamp
) {
    return db.query(
        "INSERT INTO users (fname, lname, email, password, timestamp) VALUES($1, $2, $3, $4, $5) RETURNING *",
        [fname, lname, email, password, timestamp]
        // INTENDING IT TO RETURN CURRENT USER VALUES
    );
};

module.exports.fetchUser = function fetchUser(email) {
    return db.query("SELECT * FROM users WHERE email = $1 ", [email]);
    // INTENDING IT TO RETURN CURRENT USER VALUES
};
