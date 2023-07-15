const Joi = require("joi");

module.exports = Joi.object({
  name: Joi.string().required().trim().messages({
    "any.required": "name is required",
    "string.empty": "name cannot be empty",
    "string.base": "name must be a text",
  }),
  price: Joi.number().required().integer().messages({
    "any.required": "price is required",
    "number.base": "price must be a number",
  }),
  description: Joi.string().required().trim().messages({
    "any.required": "description is requiared",
    "string.empty": "description cannot be empty",
    "number.base": "description must be a number",
  }),
  storefront_id: Joi.number().optional().integer().messages({
    "any.required": "storefront id is required",
    "number.base": "storefront id must be a number",
  }),
  images: Joi.array().items(Joi.string().required()),
  product_variants: Joi.array().items(
    Joi.object({
      name: Joi.string().required().trim().messages({
        "any.required": "name is required",
        "string.empty": "name cannot be empty",
        "string.base": "name must be a text",
      }),
      stock: Joi.number().required().integer().messages({
        "any.required": "stock is required",
        "number.base": "stock must be a number",
      }),
    })
  ),
});