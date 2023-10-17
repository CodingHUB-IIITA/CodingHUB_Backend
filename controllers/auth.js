const jwt = require("jsonwebtoken");
const Chat = require("../models/Chat");
const User = require("../models/user");
const { expressjwt: expressJwt } = require("express-jwt");
const { check, validationResult } = require("express-validator");

exports.signup = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const user = new User(req.body);
    console.log(user);
    user.save().then((user,err) => {
        // console.log(user);
        if (err || !user) {
            return res.status(400).json({ errors: err.errors });
        }
        res.json({
            name: user.name,
            email: user.email,
            id: user.id
        });
    });
};

exports.signin = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    User.findOne({ email }).then((user) => {
        if (!user) {
            return res.status(400).json({
                error: "User email does not exist"
            });
        }

        if (!user.authenticate(password)) {
            return res.status(400).json({
                error: "Email and password do not match"
            });
        }

        const token = jwt.sign({ id: user.id }, process.env.SECRET, {
            expiresIn: 36000000
        });

        res.cookie("token", token, {
            expires: new Date(Date.now() + 3600000)
        });

        const { _id, name, email, role } = user;
        return res.json({
            token,
            user: { _id, name, email, role }
        });
    }).catch((err) => {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    });
};

exports.isSignedIn = expressJwt({
    secret: process.env.SECRET,
    algorithms: ["HS256"],
    userProperty: "auth"
});

exports.isAuthenticated = (req, res, next) => {
    // console.log(req);
    const check = req.profile && req.auth && req.profile._id == req.auth.id;

    if (!check) {
        return res.status(401).json({
            error: "You are not authenticated"
        });
    }

    next();
};

exports.isAdmin = (req, res, next) => {
    // console.log(req.profile);
    if (req.profile.role != 2) {
        return res.status(401).json({
            error: "You are not admin"
        });
    }
    next();
};
exports.isModerator = (req, res, next) => {
    // console.log(req.profile);
    if (req.profile.role < 1) {
        return res.status(401).json({
            error: "You are not admin"
        });
       
    }
    next();
    
};

