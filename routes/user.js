const express = require('express');
var router = express.Router();
const {getAllusers,getUser,getUserById,updateUser} = require("../controllers/user")

const{isSignedIn,isAuthenticated,isAdmin} = require("../controllers/auth")

// param
router.param("userId",getUserById);

// routes
router.get("/user/:userId",isSignedIn,isAuthenticated,isAdmin,getUser);

router.get("/users/:userId",isSignedIn,isAuthenticated,isAdmin,getAllusers)

router.put("/user/update/:userId",isSignedIn,isAuthenticated,isAdmin,updateUser)


module.exports = router;