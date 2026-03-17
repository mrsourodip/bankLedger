const express = require('express');
const authMiddelware = require("../middleware/auth.middleware");
const accountController = require("../controllers/account.controller")

const router = express.Router();

/**
 * - POST /api/accounts
 * - Create a new account
 * - Protected Route
 */
router.post("/", authMiddelware.authMiddelware, accountController.createAccountController);



module.exports = router;