const Joi = require("joi");

exports.signupSchema = Joi.object({
  fullName: Joi.string().min(6).max(50).required(),
  email: Joi.string()
    .min(6)
    .max(50)
    .required()
    .email({
      tlds: { allow: ["com", "net", "org"] },
    }),
  password: Joi.string()
    .required()
    .pattern(
      new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})")
    ),
});

exports.signinSchema = Joi.object({
  email: Joi.string()
    .min(6)
    .max(50)
    .required()
    .email({
      tlds: { allow: ["com", "net", "org"] },
    }),
  password: Joi.string()
    .required()
    .pattern(
      new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})")
    ),
});
