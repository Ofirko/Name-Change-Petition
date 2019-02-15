var spicedPg = require("spiced-pg");

var db = spicedPg("postgres:spicedling:password@localhost:5432/cities");

module.exports.getAllSigners = function getAllSigners() {
    return db.query("SELECT * FROM petition");
};

module.exports.addSigner = function addSigner(name) {
    db.query("INSERT INTO petition (name) VALUES($1)", [name]);
};
