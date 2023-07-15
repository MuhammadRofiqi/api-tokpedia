const db = require("../../database");

// validation
const storefront = require("../validations/storefront");

module.exports = class StorefrontController {
  static async getAll(req, res) {
    try {
      //get data qury params for paginations, query params ?
      const { page = 1, limit = 25, search = "" } = req.query;

      const storefronts = await db("storefronts")
      .select("id", "name")
        .limit(+limit)
        .offset(+limit * +page - +limit)
        .where("name", "like", `%${search}%`)
        .first();

      return res.json({
        success: true,
        message: "storefront successfully retrieved",
        storefronts,
      });
    } catch (error) {
      return res.boom.badRequest(error.message);
    }
  }

  static async getDetail(req, res) {
    try {
      const id = req.params.id;
      const storefront = await db("storefronts AS s")
        .leftJoin("products AS p", "p.storefront_id", "s.id")
        .select(
          "s.id",
          "s.name",
          "s.created_at",
          "s.updated_at",
          "p.id AS id_product",
          "p.name AS name_product",
          "p.price",
          "p.stock",
          "p.description"
        )
        .where({ "s.id": id })

        // return console.log(storefront[0]);

        if (storefront[0] == undefined) {
          return res.boom.notFound("data not found");
        }

      return res.json({
        success: true,
        message: "data storefront successfully retrieved",
        storefront: {
          id: storefront[0].id,
          name: storefront[0].name,
          products: storefront.map((e) => {
            return {
              id: e.id_product,
              name: e.name_product,
              price: e.price,
              stock: e.stock,
              description: e.description,
            };
          }),
          created_at: storefront[0].created_at,
          updated_at: storefront[0].updated_at,
        },
      });
    } catch (error) {
      return res.boom.badRequest(error.message);
    }
  }

  static async create(req, res) {
    try {
            //get data from body
            const { error, value } = storefront.validate(req.body);
            if (error) {
              return res.boom.badData("validate error");
            }
            const { store_id } = req.params;
            const { name } = value;
            await db.transaction(async function (trx) {
              //insert storefronts
              await db("storefronts")
                .transacting(trx)
                .insert({ store_id, name })
                .catch(trx.rollback);
      
              trx.commit;
            });
      
            return res.status(201).json({
              success: true,
              message: "storefront successfully created",
            });
    } catch (error) {
      return res.boom.badRequest(error.message)
    }
  }

  static async update(req, res) {
    try {
      //get data from body
      const { error, value } = storefront.validate(req.body);
      if (error) {
        return res.boom.badData("Validate Error");
      }

      // check availeble storefront 
      const { id } = req.params;
      const check = await db("storefronts").where({ id }).first();
      if (!check) {
        return res.boom.notFound("storefront is not found")
      }

      const { name } = value;

      await db.transaction(async function (trx) {
        //update data storefronts
        await db("storefronts")
          .where({ id })
          .transacting(trx)
          .update({ name })
          .catch(trx.rollback);

        trx.commit;
      });
      return res.json({
        success: true,
        message: "storefront successfully updated",
      });
    } catch (error) {
      return res.boom.badRequest(error.message);
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const check = await db("storefronts").where({ id }).first();

if (!check) {
        return res.boom.notFound(`storefront with ${id} not found`);
      }

      await db("storefronts").where({ id }).del();

      return res.json({
        success: true,
        message: "storefront successfully deleted",
      });
    } catch (error) {
      return res.boom.badRequest(error.message);
    }
  }
}