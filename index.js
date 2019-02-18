const express = require("express");
const app = express();
const db = require("./db");
const spicedPg = require("spiced-pg");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);

// app.use(express.static(__dirname + "/public"));

// app.use(cookieSession({
//  secret: 'needs a link to a JSON file',
//  maxAge: 1000 * 60 * 60 * 24 * 7 * 2
// }));
//
//
//

var hb = require("express-handlebars");
app.engine("handlebars", hb());

app.set("view engine", "handlebars");

app.get("/petition", (req, res) => {
    res.render("petition", {
        //GIVE IT VALUES HERE
    });
});

app.get("/thanks", (req, res) => {
    res.render("thanks", {
        //GIVE IT VALUES HERE
    });
});

app.get("/signers", (req, res) => {
    db.getAllSigners().then(function(signers) {
        // console.log("signers are here", signers);
    });
    // .then(results => {
    //     console.log("results:", results);
    // })
    // .catch(err => {
    //     console.log(err);
    // });
});

app.post("/petition", (req, res) => {
    if (
        req.body.firstname == `` ||
        req.body.lastname == `` ||
        req.body.visual == ``
    ) {
        res.render("error", {});
    } else {
        db.addSigner(
            req.body.firstname,
            req.body.lastname,
            req.body.visual
        ).then(function(val) {
            console.log(val);
            res.redirect("/thanks");
        });
    }
});

app.use(express.static("./public"));

// app.get("/get-cities", (req, res) => {
//     db.getAllCities()
//         .then(results => {})
//         .catch(err => {
//             console.log(err);
//         });
// });
//
// app.post("/create-new-city", (req, res) => {
//     db.addCity("Berlin", "Germany").then(() => {});
// });
app.listen(8080, () => console.log("Listening!"));

// READ UP ON EVENT EMITTERS FOR SCRIPT.JS
