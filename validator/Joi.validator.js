const Joi = require('joi');

const validator = (schema) => (payload) =>schema.validate(payload,{abortEarly:false})

const signupSchemaRegister = Joi.object({
email: Joi.string().email().required().messages({
  'string.email': 'Please enter a valid email address'
}),
    password: Joi.string()
  .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{10,20}$"))
  .required()
  .messages({
    'string.pattern.base': 'Password must be 10-20 characters long and include uppercase, lowercase, digit, and special character.'
  })
,
    phone_num: Joi.number().min(1000000000).max(9999999999).required(),
    age:Joi.number().greater(18).required(),
    role:Joi.string(),
    name:Joi.string().required(),
    role: Joi.string().valid('user', 'admin').default('user')


})

const signupSchemaLogin = Joi.object({
email: Joi.string().email().required().messages({
  'string.email': 'Please enter a valid email address'
}),
    password: Joi.string()
  .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{10,20}$"))
  .required()
  .messages({
    'string.pattern.base': 'Password must be 10-20 characters long and include uppercase, lowercase, digit, and special character.'
  })


})

exports.validateSignup = validator(signupSchemaRegister)

exports.validateSignin = validator(signupSchemaLogin)
