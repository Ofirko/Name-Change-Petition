const express = require("express");
const app = express();
const db = require("./db");

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

app.post("/petition", (req, res) => {
    // res.redirect("/thanks");
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
