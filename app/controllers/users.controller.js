const db     = require("../../database");
const multer = require("multer");
const upload = require("../helpers/multer")("user").single("avatar");
const minio  = require("../helpers/minio");

module.exports = class UserController {
  static async getDetail(req, res) {
    try {
      const user = await db("users AS u")
      .leftJoin("stores AS s", "s.id", "u.store_id")
      .select("u.id AS id_user", "u.name", "u.email", "u.avatar", "u.created_at", "u.updated_at", "s.id AS id_store", "s.name AS name_store", "s.address", "s.avatar AS store_avatar", "s.created_at AS createdAt", "s.updated_at AS updatedAt")
      .where({ "u.id": req.user.id })
      .first();
      // return console.log(user);

      const avatar_user  = await minio.presignedUrl("GET", "tokopedia-bucket", user.avatar);
      const avatar_store = await minio.presignedUrl("GET", "tokopedia-bucket", user.store_avatar);

      return res.json({
        success: true,
        message: "data user successfully retrieved",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: avatar_user,
          created_at: user.created_at,
          updated_at: user.updated_at,
          store: {
            id: user.id_store,
            name: user.name_store,
            address: user.address,
            avatar: avatar_store,
            created_at: user.createdAt,
            updated_at: user.updatedAt,
          }
        }
      })
    } catch (error) {
      return res.boom.badRequest(error.message);
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
        if (err) {
          return res.boom.badRequest(err.message);
        }

        await db.transaction(async function(trx) {
          await db("users")
            .transacting(trx)
            .where({ id: req.user.id })
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