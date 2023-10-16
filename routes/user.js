const express = require('express');
var router = express.Router();
const {getAllusers,getUser,getUserById,updateUser,storeHandles,updatePermissions} = require("../controllers/user")

const{isSignedIn,isAuthenticated,isAdmin} = require("../controllers/auth")

// param
router.param("userId",getUserById);

// routes
router.get("/user/:userId",isSignedIn,isAuthenticated,isAdmin,getUser);

router.get("/users/:userId",isSignedIn,isAuthenticated,isAdmin,getAllusers)

router.put("/user/update/:userId",isSignedIn,isAuthenticated,isAdmin,updateUser)

router.put("/user/storeHandle/:userId",isSignedIn,isAuthenticated,storeHandles)

router.put("/user/makeAdmin/:userId",isSignedIn,isAuthenticated,isAdmin,updatePermissions)

module.exports = router;