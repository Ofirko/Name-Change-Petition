var spicedPg = require("spiced-pg");

var db = spicedPg(
    "postgres:ofirkatz:12345678@localhost:5432/wintergreen-petition"
);

module.exports.getAllSigners = function getAllSigners() {
    return db.query("SELECT * FROM signatures");
};

module.exports.addSigner = function addSigner(fname, lname, sigraphic) {
    return db.query(
        "INSERT INTO signatures (fname, lname, sigraphic) VALUES($1, $2, $3)",
        [fname, lname, sigraphic]
    );
};
