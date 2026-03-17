const { default: mongoose } = require("mongoose");
const userModel = require("../ models/user.model");
const jwt = require("jsonwebtoken");
const emailService = require("../services/email.service")
/**
 * - user register controller
 * - POST /api/auth/register
 */
async function userRegisterController(req, res) {
  try {
    const { email, password, name } = req.body;

    const doesEmailExist = await userModel.findOne({
      email: email,
    });
    if (doesEmailExist) {
      return res.status(422).json({
        message: "User already exists with email",
        status: "failed",
      });
    }

    const user = await userModel.create({
      email,
      password,
      name,
    });

    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "3d" },
    );

    res.cookie("token", token);
    res.status(201).json({
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
      },
      token,
    });

    await emailService.sendRegistrationEmail(user.email, user.name);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}


/**
 * - user login controller
 * - POST /api/auth/login
 */
async function userLoginController(req, res) {
    try {
    const {email, password} = req.body;

    const user = await userModel
    .findOne({ email })
    .select("+password")

    if(!user) {
        return res.status(401).json({
            "message": "Email or password is invalid",
            "status": "failed"
        })
    }

    const isPasswordCorrect = user.comparePassword(password);

    if(!isPasswordCorrect) {
        return res.status(401).json({
            "message": "Email or password is invalid",
            "status": "failed"
        })
    }

    const token = jwt.sign({
        userId: user._id,
    }, process.env.JWT_SECRET, {expiresIn: "3d"})

    res.cookie("token", token);

    res.status(200).json({
        user: {
            _id: user._id,
            email: user.email,
            name: user.name
        },
        token
    })
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
  userRegisterController,
  userLoginController
};
