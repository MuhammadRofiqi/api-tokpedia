const db          = require("../../database");
const storeSchema = require("../validations/store");
const multer      = require("multer");
const upload      = require("../helpers/multer")("store").single("avatar")
const minio       = require("../helpers/minio");
const fs          = require("fs");
const base64      = require("base64-img");
const path        = require("path");

module.exports = class StoreController {
  static async getAll(req, res, next) {
    try {
      //get data qury params for paginations, query params ?
      const { page = 1, limit = 25, search = "", order = "asc" } = req.query;

      const stores = await db("stores")
        .limit(+limit)
        .offset(+limit * +page - +limit)
        .orderBy("created_at", order)
        .where("name", "like", `%${search}%`);

      return res.json({
        success: true,
        message: "Data stores successfully retrieved",
        stores,
      });
    } catch (error) {
      next(error);
    }
  }

  static async create (req, res) {
    try {
      const { value, error } = storeSchema.validate(req.body);
      if (error) {
        return res.boom.badData(error);
      }
      
      const { name, address, avatar } = value;
      const id = require("crypto").randomUUID();

      const filename = Date.now().toString();
      const image    = base64.imgSync(avatar, path.join(__dirname, "../../public/store"), filename);

      minio.fPutObject("tokopedia-bucket", filename, image, {
        "Content-Type": "image/png"
      }, async (err, result) => {
        await db.transaction(async function(trx){
          await db("stores")
            .transacting(trx)
            .insert({ 
              id,
              name,
              address,
              avatar: filename
            })
            .catch(err => {
              return res.booom.badRequest(err.message)
            });

          await db("users")
            .transacting(trx)
            .update({
              store_id: id
            })
            .where({ id : req.user.id })
            .catch(err => {
              return res.boom.badRequest(err.message)
            });

          // destroy file
          fs.unlinkSync(image);
    
          return res.status(201).json({
            success: true,
            message: "Store successfully created",
            result
          })
        });
      });
    } catch (error) {
      return res.boom.badRequest(error.message);
    }
  }

  static async update(req, res, next) {
    try {
      //get data from body
      const { error, value } = storesSchema.validate(req.body);
      if (error) {
        throw new Api422Error("Validate Error", error.details);
      }

      const { id } = req.params;
      const store = await db("stores").where({ id }).first();
      if (!store) {
        throw new Api404Error("Store is not found");
      }

      const { name, address } = value;

      await db.transaction(async function (trx) {
        //update data note
        await db("stores")
          .where({ id })
          .transacting(trx)
          .update({ name, address })
          .catch(trx.rollback);

        trx.commit;
      });
      return res.json({
        success: true,
        message: "Store successfully update",
      });
    } catch (error) {
      next(error);
    }
  }
  
  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      const store = await db("stores").where({ id }).first();

      if (!store) {
        return res.boom.notFound(`Store with ${id} not found`);
      }

      await db("stores")
      .where({ id })
      .del();

      return res.json({
        success: true,
        message: "Store successfully deleted",
      });
    } catch (error) {
      next(error);
    }
  }

  static async test(req, res, next) {
    try {
      if (error) {
        throw new Error("error")
      }
    } catch (error) {
      next(error);
    }
  }

  static async changeAvatar(req, res) {
    upload(req, res, async function(err) {
      if (err instanceof multer.MulterError) {
        return res.boom.badRequest(err);
      } else if (err) {
        return res.boom.badRequest(err.message);
      }

      minio.fPutObject("tokopedia-bucket", req.file.filename, req.file.path, {
        "Content-Type": req.file.mimetype
      }, async function(err, result) {
        await db.transaction(async function(trx) {
          await db("stores")
            .transacting(trx)
            .where({ id: req.user.store_id})
            .update({
              avatar: req.file.filename
            })
            .catch(err => {
              return res.boom.badRequest(err.message);
            })
        });

        return res.status(201).json({
          success: true,
          message: "avatar successfully updated",
          info: result
        });
      });
    });
  }
}