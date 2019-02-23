const express = require("express");
const app = express();
const db = require("./db");
const config = require("./config");
const spicedPg = require("spiced-pg");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const csurf = require("csurf");
var bcrypt = require("bcryptjs");

app.use(
    bodyParser.urlencoded({
        extended: false
    })
);

// app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
    res.redirect("/register");
});

app.use(
    cookieSession({
        secret: process.env.cookieSecret || config.cookieSecret,
        maxAge: 1000 * 60 * 60 * 24 * 7 * 2
    })
);

app.use(csurf());
app.use(function(req, res, next) {
    res.locals.csrfToken = req.csrfToken();
    next();
});

var hb = require("express-handlebars");
app.engine("handlebars", hb());

app.set("view engine", "handlebars");

//BCRYPT
function hashPassword(plainTextPassword) {
    return new Promise(function(resolve, reject) {
        bcrypt.genSalt(function(err, salt) {
            if (err) {
                return reject(err);
            }
            bcrypt.hash(plainTextPassword, salt, function(err, hash) {
                if (err) {
                    return reject(err);
                }
                resolve(hash);
            });
        });
    });
}
function checkPassword(textEnteredInLoginForm, hashedPasswordFromDatabase) {
    return new Promise(function(resolve, reject) {
        bcrypt.compare(
            textEnteredInLoginForm,
            hashedPasswordFromDatabase,
            function(err, doesMatch) {
                if (err) {
                    reject(err);
                } else {
                    resolve(doesMatch);
                }
            }
        );
    });
}

app.get("/signers/:cityname", (req, res) => {
    let city = req.params.cityname.toLowerCase();

    if (req.session.user == undefined) {
        res.redirect("/register");
    } else {
        db.getCitySigners(city)
            .then(quer => {
                for (var i = 0; i < quer.rows.length; i++) {
                    console.log(quer.rows[i].age);
                }
                res.render("signers", {
                    layout: "main",
                    results: quer.rows,
                    city: city.toUpperCase()
                });
            })
            .catch(err => {
                console.log(err);
            });
    }
});

app.get("/devUser", (req, res) => {
    db.getAllUsers().then(({ rows }) => {
        res.send(rows);
    });
});

app.get("/devSignatures", (req, res) => {
    db.getAllSigners().then(({ rows }) => {
        res.send(rows);
    });
});

app.get("/devProfiles", (req, res) => {
    db.getAllProfiles().then(({ rows }) => {
        res.send(rows);
    });
});

app.get("/register", (req, res) => {
    if (req.session.user != undefined) {
        res.redirect("/petition");
    } else {
        res.render("register", {
            layout: "main"
        });
    }
});

app.get("/login", (req, res) => {
    if (req.session.user != undefined) {
        res.redirect("/petition");
    } else {
        res.render("login", {
            layout: "main"
            //GIVE IT VALUES HERE
        });
    }
});

app.get("/logout", (req, res) => {
    if (req.session.user != undefined) {
        req.session.user = undefined;
        res.redirect("/register");
    } else {
        res.redirect("/petition");
    }
});

app.get("/profile", (req, res) => {
    console.log(req.session.profile);
    if (req.session.user == undefined) {
        res.redirect("/register");
    } else if (req.session.profile != undefined) {
        res.redirect("/profile/edit");
    } else {
        res.render("profile", {
            layout: "main"
            //GIVE IT VALUES HERE
        });
    }
});

app.get("/profile/edit", (req, res) => {
    if (req.session.user == undefined) {
        res.redirect("/register");
    } else {
        if (req.session.profile == undefined) {
            req.session.profile = {
                age: ""
                // , city: "", url: ""
            };
        }
        console.log("profile existing:", req.session.profile);
        res.render("edit", {
            layout: "main",
            fname: req.session.user.fname,
            lname: req.session.user.lname,
            email: req.session.user.email,
            age: req.session.profile.age,
            city: req.session.profile.city,
            url: req.session.profile.url
            //GIVE IT VALUES HERE
        });
    }
});

app.get("/petition", (req, res) => {
    if (req.session.user == undefined) {
        res.redirect("/register");
    } else {
        if (req.session.signed == undefined) {
            res.render("petition", {
                layout: "main"
                //GIVE IT VALUES HERE
            });
        } else {
            res.redirect("/thanks");
        }
    }
});

app.get("/thanks", (req, res) => {
    if (req.session.user == undefined) {
        res.redirect("/register");
    }
    if (req.session.signed == undefined) {
        res.redirect("/petition");
    } else {
        db.getCurrentUserSig(req.session.signed)
            .then(function(cur) {
                let fname = req.session.user.fname;
                res.render("thanks", {
                    layout: "main",
                    current: cur.rows[0].sigraphic,
                    fname: fname.toUpperCase()
                });
            })
            .catch(err => {
                console.log(err);
            });
    }
});

app.get("/signers", (req, res) => {
    if (req.session.user == undefined) {
        res.redirect("/register");
    } else {
        db.getAllSigners()
            .then(quer => {
                for (var i = 0; i < quer.rows.length; i++) {
                    console.log(quer.rows[i].age);
                }
                console.log(quer.rows);
                res.render("signers", {
                    layout: "main",
                    results: quer.rows
                });
            })
            .catch(err => {
                console.log(err);
            });
    }
});

app.post("/petition", (req, res) => {
    if (req.body.visual == ``) {
        // console.log(
        //     "req.body.firstname:" +
        //         req.body.firstname +
        //         "req.body.lastname:" +
        //         req.body.lastname +
        //         "req.body.visual:" +
        //         req.body.visual
        // );
        res.render("petition", {
            layout: "main",
            error: "unsigned"
        });
    } else {
        let timestamp = new Date().getTime();
        console.log("user_id:" + req.session.user.id);
        db.addSigner(req.body.visual, req.session.user.id, timestamp).then(
            function(val) {
                console.log(val.rows[0].id);
                req.session.signed = val.rows[0].id;
                res.redirect("/thanks");
            }
        );
    }
});

app.post("/register", (req, res) => {
    if (
        req.body.firstname == `` ||
        req.body.lastname == `` ||
        req.body.email == `` ||
        req.body.password == ``
    ) {
        res.render("register", {
            layout: "main",
            err: "err"
            // errpass: errpass
        });
    } else {
        let timestamp = new Date().getTime();
        hashPassword(req.body.password)
            .then(hash => {
                db.addUser(
                    req.body.firstname,
                    req.body.lastname,
                    req.body.email,
                    hash,
                    timestamp
                )
                    .then(function(val) {
                        console.log(val.rows[0]);
                        req.session.user = val.rows[0];
                        res.redirect("/profile");
                    })
                    .catch(err => {
                        console.log(err.code);
                        res.render("register", {
                            layout: "main",
                            code: err.code
                        });
                    });
            })
            .catch(() => {
                res.render("register", {
                    layout: "main",
                    err: "err"
                    // errpass: errpass
                });
            });
    }
});

app.post("/login", (req, res) => {
    if (req.body.email == `` || req.body.password == ``) {
        res.render("login", {
            layout: "main",
            empty: "err"
        });
    } else {
        console.log(req.body.email);
        db.fetchUser(req.body.email)
            .then(function(data) {
                console.log("response:", data);
                checkPassword(req.body.password, data.rows[0].password)
                    .then(function(val) {
                        console.log("response2:", val);
                        if (val == true) {
                            req.session.user = data.rows[0];
                            res.redirect("/petition");
                        } else {
                            res.render("login", {
                                layout: "main",
                                mismatch: "err",
                                mail: req.body.email
                            });
                        }
                    })
                    .catch(err => console.log("error1", err));
            })
            .catch(err => console.log("error2", err));
    }
});

app.post("/profile", (req, res) => {
    if (req.body.age || req.body.city || req.body.homepage) {
        console.log("URL:", req.body.homepage);
        if (
            req.body.homepage != "" &&
            req.body.homepage.indexOf("http://") != 0 &&
            req.body.homepage.indexOf("https://") != 0
        ) {
            req.body.homepage = "http://" + req.body.homepage;
        }
        db.addUserProfile(
            req.body.age || null,
            req.body.city.toLowerCase(),
            req.body.homepage,
            req.session.user.id
        )
            .then(function(data) {
                req.session.profile = data.rows[0];
                res.redirect("/petition");
            })
            .catch(err => {
                console.log(err);
                res.render("error", {});
            });
    } else {
        res.redirect("/petition");
    }
});

app.post("/profile/edit", (req, res) => {
    if (req.body.age == "") {
        req.body.age = null;
    }
    if (req.body.password == ``) {
        editProfile(req.session.user.password);
    } else {
        hashPassword(req.body.password)
            .then(hashed => {
                editProfile(hashed);
            })
            .catch(err => {
                console.log("error 1:", err);
                res.render("edit", {
                    layout: "main",
                    fname: req.session.user.fname,
                    lname: req.session.user.lname,
                    email: req.session.user.email,
                    age: req.session.profile.age,
                    city: req.session.profile.city,
                    url: req.session.profile.url,
                    err: "err",
                    errpass: errpass
                });
            });
    }
    function editProfile(hash) {
        console.log("URL:", req.body.url);
        if (
            req.body.url != "" &&
            req.body.url.indexOf("http://") != 0 &&
            req.body.url.indexOf("https://") != 0
        ) {
            req.body.url = "http://" + req.body.url;
        }
        db.editUser(req.body.firstname, req.body.lastname, req.body.email, hash)
            .then(data => {
                req.session.user.fname = data.rows[0].fname;
                req.session.user.lname = data.rows[0].lname;
                req.session.user.email = data.rows[0].email;
                db.editProfile(
                    req.body.age,
                    req.body.city.toLowerCase(),
                    req.body.url,
                    req.session.user.id
                )
                    .then(data => {
                        req.session.profile.age = data.rows[0].age;
                        req.session.profile.city = data.rows[0].city;
                        req.session.profile.url = data.rows[0].url;
                        res.redirect("/petition");
                    })
                    .catch(err => {
                        console.log("error 2:", err);
                        res.render("edit", {
                            layout: "main",
                            fname: req.session.user.fname,
                            lname: req.session.user.lname,
                            email: req.session.user.email,
                            age: req.session.profile.age,
                            city: req.session.profile.city,
                            url: req.session.profile.url,
                            errdb: "profile"
                        });
                    });
            })
            //     function(val) {
            //     console.log(val.rows[0]);
            //     req.session.user = val.rows[0];
            //     res.redirect("/profile");
            // }

            .catch(err => {
                console.log("error 3:", err);
                res.render("edit", {
                    layout: "main",
                    fname: req.session.user.fname,
                    lname: req.session.user.lname,
                    email: req.session.user.email,
                    age: req.session.profile.age,
                    city: req.session.profile.city,
                    url: req.session.profile.url,
                    errdb: "user"
                });
            });
    }
});

app.post("/thanks", (req, res) => {
    db.deleteCurrentUserSig(req.session.signed)
        .then(() => {
            req.session.signed = undefined;
            res.redirect("/petition");
        })
        .catch(err => {
            console.log(err);
        });
});

app.use(express.static("./public"));

app.listen(process.env.PORT || 8080, () => console.log("Listening!"));

//

//
//
//
// Change the query that retrieves information from the users table by email address
// so that it also gets data from the signatures table.
// Thus you will be able to know whether the user has signed the petition or not as soon as they log in.
//
// NOTA BENE: Before you put the url a user specifies into the href attribute of a link,
// you must make sure that it begins with either "http://" or "https://".
// This is not just to ensure that the link goes somewhere outside of your site, althoug that is a benefit.
// It is also important for security. Since browsers support Javascript URLs,
// we must make sure that a malicious user can't create a link that runs Javascript code when other users click on it.
//  You can decide whether to check the url when the user inputs it (before you insert it into the database)
//   or when you get it out of the database (before you pass it to your template).
//   If it doesn't start with "http://" or "https://", do not put it in an href attribute.

//
//layout doesnt work for city pages
//
// ADD HELMET, X-Frame-Options, Content-Security-Policy
//BUILD MAIN
//FIX ERROR HANDLEBAR

//When you want to end the session (i.e, log out the user), you can set req.session to null.
//
//
//
//
//PROFILE fields in this form are optional.

//LOGIN PAGE DOESNT WORK
// You should add to this object properties that you are likely to use frequently,
// such as the user's first name, last name, and signature id if the user has signed the petition.
//
// You need to be able to map signatures to users and users to signatures.(user_id)
// You can check for the presence of this object to determine if the user is logged in.
// After users register or log in, you should attach a user object to request.session.
// Both the registration and log in forms can have several errors so you have to be able to
// reload them with error information displayed.
// READ UP ON EVENT EMITTERS FOR SCRIPT.JS
