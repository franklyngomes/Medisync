const UserModel = require("../model/UserModel");
const HttpCode = require("../helper/HttpCode");
const {
  hashPassword,
  comparePassword,
  AuthCheck,
  hmacProcess,
} = require("../middleware/Auth");
const transport = require("../helper/SendMail");
const dayjs = require("dayjs");
const jwt = require('jsonwebtoken')

class UserController {
  async Signup(req, res) {
    try {
      const {
        firstName,
        lastName,
        phone,
        email,
        dateOfBirth,
        password,
        role,
        designation,
      } = req.body;
      const hashed = hashPassword(password);
      const dob = dayjs(dateOfBirth);
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res.status(HttpCode.badRequest).json({
          status: false,
          message: "User with this email already exists!",
        });
      }
      const userData = new UserModel({
        firstName,
        lastName,
        phone,
        email,
        dateOfBirth: dob,
        password: hashed,
        role,
        designation,
      });
      if (req.file) {
        userData.image = req.file.path;
      }

      const codeValue = Math.floor(Math.random() * 1000000).toString();
      const sendVerificationCode = await transport.sendMail({
        from: process.env.NODEMAILER_EMAIL,
        to: userData.email,
        subject: "Verify your email address",
        html: "<h1> Verification Code </h1><br> <h2>" + codeValue + "</h2>",
      });
      if (sendVerificationCode.accepted[0] === userData.email) {
        const hashedCodeValue = hmacProcess(
          codeValue,
          process.env.HMAC_PROCESS_SECRET
        );
        userData.verificationCode = hashedCodeValue;
        userData.verificationCodeValidation = Date.now();
      }
      const data = await userData.save();
      const userRole = role.charAt(0).toUpperCase().concat(role.slice(1));
      return res.status(HttpCode.create).json({
        status: true,
        message: `${userRole} created successfully & verification code sent`,
      });
    } catch (error) {
      return res.status(HttpCode.serverError).json({
        status: false,
        message: error.message,
      });
    }
  }
  async VerifyEmail(req, res) {
    try {
      const { email, code } = req.body;
      const verificationCode = code.toString();
      const existingUser = await UserModel.findOne({ email }).select(
        "+verificationCode +verificationCodeValidation"
      );
      const userRole = existingUser.role
        .charAt(0)
        .toUpperCase()
        .concat(existingUser.role.slice(1));

      if (!email || !code) {
        return res.status(HttpCode.badRequest).json({
          status: false,
          message: "All fields are required!",
        });
      }
      if (!existingUser) {
        return res.status(HttpCode.notFound).json({
          status: false,
          message: `${userRole} not found!`,
        });
      }
      if (existingUser.verified) {
        return res.status(HttpCode.badRequest).json({
          status: false,
          message: `${userRole} is already verified!`,
        });
      }
      if (
        Date.now() - existingUser.verificationCodeValidation >
        10 * 60 * 1000
      ) {
        return res.status(HttpCode.badRequest).json({
          status: false,
          message: "Verification code expired!",
        });
      }
      const codeValue = hmacProcess(
        verificationCode,
        process.env.HMAC_PROCESS_SECRET
      );
      if (codeValue === existingUser.verificationCode) {
        existingUser.verified = true;
        existingUser.verificationCode = undefined;
        existingUser.verificationCodeValidation = undefined;
      } else {
        return res.status(HttpCode.badRequest).json({
          status: false,
          message: `Incorrect Code!`,
        });
      }
      await existingUser.save();
      return res.status(HttpCode.success).json({
        status: true,
        message: `${userRole} verified successfully!`,
      });
    } catch (error) {
      return res.status(HttpCode.serverError).json({
        status: false,
        message: error.message,
      });
    }
  }
  async Signin(req, res){
    try {
      const {email, password} = req.body
      if(!email || !password){
        return res.status(HttpCode.badRequest).json({
          status: false,
          message: "All fields are required"
        })
      }
      const user = await UserModel.findOne({email})
      if(!user){
        return res.status(HttpCode.notFound).json({
          status: false,
          message: "User not found!"
        });
      }
      const verifyPassword = comparePassword(password, user.password)
      if(!verifyPassword){
        return res.status(HttpCode.unauthorized).json({
          status: false,
          message: "Incorrect password!"
        });
      }
      const token = jwt.sign({
        firstName: user.firstName,
        lastName:user.lastName,
        email:user.Email,
        role:user.role,
        designation:user.designation
      }, process.env.JWT_SECRET_KEY, {expiresIn:"5hr"})
      return res.status(HttpCode.success).json({
        status: true,
        message: `Welcome ${user.designation}`,
        token: token
      })
    } catch (error) {
      return res.status(HttpCode.serverError).json({
        status: false,
        message: error.message,
      });
    }
  }
}
module.exports = new UserController();
