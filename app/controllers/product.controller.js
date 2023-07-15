const db     = require("../../database");
const upload = require("../helpers/base64");
const minio  = require("../helpers/minio");
const schema = require("../validations/product");
const fs     = require("fs");

module.exports = class ProductController {
  static async create(req, res) {
    // get data from params
    const { store_id } = req.params;
    // check validation and retrieve data from body
    const { value, error } = schema.validate(req.body);
    if (error) {
      return res.boom.badData(error.message);
    }

    // retrieve data
    const { name, price, description, storefront_id, images, product_variants } = value;

    // generate id for product
    const id = require("crypto").randomUUID();

    await db.transaction(async function(trx) {
      // add product
      await db("products")
        .transacting(trx)
        .insert({ id, store_id, name, price, description, storefront_id })
        .catch(err => {
          return res.boom.badRequest(err.message);
        });

      // add product images
      images.forEach(async function(d) {
        const { filename, image } = upload("product", d);

        await minio.fPutObject("tokopedia-bucket", filename.concat(".png"), image, {
          "Content-Type": "image/png"
        }, async function() {
          await db("product_images")
            .insert({ product_id: id, image: filename })
            .catch(err => {
              return res.boom.badRequest(err.message);
            })
          
          fs.unlinkSync(image);
        });
        
      });

      let total_stock = 0;

      product_variants.forEach(async function(d) {
        total_stock += d.stock;
        d.product_id = id;

        await db("product_variants")
          .insert(d)
          .catch(err => {
            return res.boom.badRequest(err.message);
          });
      });

      await db("products")
        .transacting(trx)
        .where({ id })
        .update({
          stock: total_stock
        })
        .catch(err => {
          return res.bomm.badRequest(err.message);
        });
    });

    return res.status(201).json({
      success: true,
      message: "product successfully added"
    });
  }
}