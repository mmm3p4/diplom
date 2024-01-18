const verifySignUp = require("../middleware/verifySignUp");
const express = require("express");
const controller = require("../controller/auth.controller");
const app = express.Router();
app.use((req, res, next) => {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept, Authorization"
    );
    console.log(req.params)
    next();
});
app.post(
    "/signup",
    [
        verifySignUp.checkDuplicateUsernameOrEmail,
        verifySignUp.checkRolesExisted
    ],
    controller.signup
);
app.post("/signin", controller.signin);
module.exports = app;