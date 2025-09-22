const jwt = require("jsonwebtoken");
const { signupSchema, signinSchema } = require("../middleware/validator");
const { doHash, doHashValidation } = require("../utils/hashing");
const User = require("../models/usersModel"); // <-- import your User model

exports.signup = async (req, res) => {
  try {
    const { error, value } = signupSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { fullName, email, password } = value;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await doHash(password, 12);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    const result = await newUser.save();
    result.password = undefined;

    return res.status(201).json({
      success: true,
      message: "Your account has been created successfully",
      result,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate
    const { error } = signinSchema.validate({ email, password });
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    // Find user
    const existingUser = await User.findOne({ email }).select("+password");
    if (!existingUser) {
      return res.status(401).json({
        success: false,
        message: "User does not exist",
      });
    }

    //  Check password
    const isMatch = await doHashValidation(password, existingUser.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Sign token (include role if you use RBAC)
    const token = jwt.sign(
      {
        id: existingUser._id,
        email: existingUser.email,
        role: existingUser.role,
        verified: existingUser.verified,
      },
      process.env.TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    // 5. Set cookie and respond
    res
      .cookie("Authorization", "Bearer " + token, {
        expires: new Date(Date.now() + 8 * 3600000),
        httpOnly: process.env.NODE_ENV === "production",
        secure: process.env.NODE_ENV === "production",
      })
      .json({
        success: true,
        message: "Login successful",
        token,
        user: {
          id: existingUser._id,
          fullName: existingUser.fullName,
          email: existingUser.email,
          role: existingUser.role,
        },
      });
  } catch (error) {
    console.error(error); // <-- don’t swallow errors
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
