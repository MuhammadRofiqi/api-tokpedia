const Joi = require("joi");

module.exports = Joi.object({
  name: Joi.string().required().trim().messages({
    "any.required": "name is required",
    "string.empty": "name cannot be empty",
    "string.base": "name must be a text",
  }),
  address: Joi.string().required().trim().messages({
    "any.required": "address is required",
    "string.empty": "address cannot be empty",
    "string.base": "address must be a text",
  }),
  avatar: Joi.string().required().trim().messages({
    "any.required": "avatar is required",
    "string.empty": "avatar cannot be empty",
    "string.base": "avatar must be a text",
  }),
});