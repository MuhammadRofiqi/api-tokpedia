const db = require("../../database");

// validation
const delivery_service = require("../validations/delivery_service");

module.exports = class delivery_serviceController {
  static async getAll(req, res) {
    try {
      //get data qury params for paginations, query params ?
      const { page = 1, limit = 25, search = "" } = req.query;
      const { store_id } = req.params;

      const delivery_services = await db("delivery_services")
        .select("id", "name")
        .where({ store_id })
        .limit(+limit)
        .offset(+limit * +page - +limit)

      return res.json({
        success: true,
        message: "delivery_service successfully retrieved",
        delivery_services
      });
    } catch (error) {
      return res.boom.badRequest(error.message);
    }
  }

  static async getDetail(req, res) {
    try {
      const { id } = req.params;

      const delivery_service = await db("delivery_services").where({ id }).first();

      if (!delivery_service) {
        return res.boom.notFound("data not found");
      }

      return res.json({
        success: true,
        message: "data delivery_service successfully retrieved",
        delivery_service,
      });
    } catch (error) {
      return res.boom.badRequest(error.message);
    }
  }

  static async create(req, res) {
    try {
      //get data from body
      const { error, value } = delivery_service.validate(req.body);
      if (error) {
        return res.boom.badData("validate error");
      }

      const { store_id } = req.params;
      const { name } = value;
      
      await db.transaction(async function (trx) {
          //insert delivery_services
          await db("delivery_services")
            .transacting(trx)
            .insert({ store_id, name })
      });
        
      return res.status(201).json({
        success: true,
        message: "delivery_service successfully created",
      });
    } catch (error) {
      return res.boom.badRequest(error.message)
    }
  }

  static async update(req, res) {
    try {
      //get data from body
      const { error, value } = delivery_service.validate(req.body);
      if (error) {
        return res.boom.badData("Validate Error");
      }

      // check availeble delivery_service 
      const { id } = req.params;
      const check = await db("delivery_services").where({ id }).first();
      if (!check) {
        return res.boom.notFound("delivery_service is not found")
      }

      const { name } = value;

      await db.transaction(async function (trx) {
        //update data delivery_services
        await db("delivery_services")
          .where({ id })
          .transacting(trx)
          .update({ name });
      });

      return res.json({
        success: true,
        message: "delivery_service successfully updated",
      });
    } catch (error) {
      return res.boom.badRequest(error.message);
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const check = await db("delivery_services").where({ id }).first();

      if (!check) {
        return res.boom.notFound(`delivery_service with ${id} not found`);
      }

      await db("delivery_services").where({ id }).del();

      return res.json({
        success: true,
        message: "delivery_service successfully deleted",
      });
    } catch (error) {
      return res.boom.badRequest(error.message);
    }
  }
}