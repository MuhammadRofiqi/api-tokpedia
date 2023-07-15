const Joi = require("joi");

module.exports = Joi.object({
  name: Joi.string().required().trim().messages({
    "any.required": "name is required",
    "string.empty": "name cannot be empty",
    "string.base": "name must be a text",
  }),
});