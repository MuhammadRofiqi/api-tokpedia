require("dotenv").config();
const db = require("../../database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// email configuration
const nodemailer = require("nodemailer");

// schema validation
const register = require("../validations/auth/register");
const login = require("../validations/auth/login");
const changePassword = require("../validations/auth/change-password");
// const { log } = require("console");

module.exports = class AuthController {
  static async register(req, res) {
    try {
      // check and retrieve request

      const { value, error } = register.validate(req.body);
      if (error) {
        return res.boom.badData(error.message);
      }

      // check availabality user
      const user = await db("users").where({ email: value.email }).first();
      if (user) {
        return res.boom.badRequest("email already registered");
      }

      const id = require("crypto").randomUUID();

      await db.transaction(async function (trx) {
        await db("users")
          .insert({
            id,
            name: value.name,
            email: value.email,
            password: bcrypt.hashSync(value.password, 10),
          })
          .transacting(trx);
      });

      return res.status(201).json({
        success: true,
        message: "user successfully registered",
      });
    } catch (error) {
      return res.boom.badRequest(error.message);
    }
  }

  static async login(req, res) {
    try {
      // check error and retrieve request
      const { error, value } = login.validate(req.body);
      if (error) {
        return res.boom.badData(error.message);
      }

      // check user
      const user = await db("users").where({ email: value.email }).first();
      if (!user) {
        return res.boom.unauthorized("wrong email, please check again !!");
      }

      // check password
      if (!bcrypt.compareSync(value.password, user.password)) {
        return res.boom.unauthorized("wrong password, please check again !!");
      }

      const token = jwt.sign(
        {
          id: user.id,
          name: user.name,
          email: user.email,
          store_id: user.store_id,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: process.env.JWT_EXPIRED_TIME }
      );

      return res.json({
        success: true,
        message: "user successfully logged in",
        token: "Bearer ".concat(token),
      });
    } catch (error) {
      return res.boom.badRequest(error.message);
    }
  }

  static async forgotPassword(req, res) {
    try {
      const otp = require("crypto").randomInt(999999);
      const { email } = req.body;

      const user = await db("users").where({ email }).first();
      if (!user) {
        return res.boom.notFound("email is not registered");
      }

      await db.transaction(async function (trx) {
        await db("users").transacting(trx).where({ email }).update({
          otp,
        });
      });

      const transporter = nodemailer.createTransport({
        host: process.env.SIB_HOST,
        port: 2525,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.SIB_USER, // generated ethereal user
          pass: process.env.SIB_PASS, // generated ethereal password
        },
      });

      const info = await transporter.sendMail({
        from: process.env.SIB_USER, // sender address
        to: email, // list of receivers
        subject: "Change password | Tokopedia", // Subject line
        html: `<h2>Kode OTP Tokopedia</h2><br><p>${otp}</p>`, // html body
      });

      return res.json({
        success: true,
        message: "OTP Code successfully sended",
        info,
      });
    } catch (error) {
      return res.boom.badRequest(error.message);
    }
  }

  static async verifyOtp(req, res) {
    try {
      // get otp from params
      const { otp } = req.params;

      const user = await db("users").where({ otp }).first();
      if (!user) {
        return res.boom.notFound("OTP is wrong !!!");
      }

      return res.json({
        success: true,
        message: "OTP successfully verified",
      });
    } catch (error) {
      return res.boom.badRequest(error.message);
    }
  }

  static async changePassword(req, res) {
    try {
      // get otp from params
      const { otp } = req.params;

      // check validation and retrieve request
      const { error, value } = changePassword.validate(req.body);
      if (error) {
        return res.boom.badData(error.message);
      }

      if (value.password != value.confirm_password) {
        return res.boom.badRequest(
          "password is not same with confirm password"
        );
      }

      await db.transaction(async function (trx) {
        await db("users")
          .transacting(trx)
          .where({ otp })
          .update({
            otp: null,
            password: bcrypt.hashSync(value.password, 10),
          });
      });

      return res.json({
        success: true,
        message: "change password successfully",
      });
    } catch (error) {
      return res.boom.badRequest(error.message);
    }
  }
};
