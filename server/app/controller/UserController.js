const UserModel = require("../model/UserModel");
const HttpCode = require("../helper/HttpCode");
const {
  hashPassword,
  comparePassword,
  AuthCheck,
  hmacProcess,
} = require("../middleware/Auth");
const transport = require("../helper/SendMail");
const jwt = require("jsonwebtoken");

class UserController {
  async Signup(req, res) {
    try {
      const {
        firstName,
        lastName,
        phone,
        email,
        password,
        role,
        designation,
        doctorId,
      } = req.body;
      const hashed = hashPassword(password);
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res.status(HttpCode.badRequest).json({
          status: false,
          message: "User with this email already exists!",
        });
      }
      // 2. Create verification token (expires in 10 mins)
      const verificationToken = jwt.sign(
        { email },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "10m" }
      );
      const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
      // 3. Create new user with verified: false
      const userData = new UserModel({
        firstName,
        lastName,
        phone,
        email,
        password: hashed,
        role,
        designation,
        doctorId: role === "Doctor" ? doctorId : undefined,
        verificationToken,
        verificationTokenExpires: Date.now() + 10 * 60 * 1000,
      });
      await userData.save();
      // 4. Send verification email
      await transport.sendMail({
        from: `Medisync <${process.env.NODEMAILER_EMAIL}>`,
        to: email,
        subject: "Verify Your Email - Medisync",
        html: `
  <body style="margin: 0; padding: 0; background-color: #f4f4f5;">
    <table
      align="center"
      border="0"
      cellpadding="0"
      cellspacing="0"
      width="100%"
      style="padding: 40px 0;"
    >
      <tr>
        <td align="center">
          <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            border="0"
            style="max-width: 500px; background-color: #ffffff; border-radius: 12px; padding: 40px 20px; font-family: Arial, sans-serif;"
          >
            <tr>
              <td align="center" style="padding-bottom: 20px;">
                <img
                  src="http://localhost:5000/public/images/logo-png.png"
                  width="150"
                  height="60"
                  alt="Logo"
                />
              </td>
            </tr>
            <tr>
              <td align="center" style="font-size: 24px; font-weight: bold; color: #111827; padding-bottom: 10px;">
                <h4>Hello ${firstName}, Please verify your email</h4>
              </td>
            </tr>
            <tr>
              <td align="center" style="font-size: 14px; color: #6b7280; padding-bottom: 30px;">
                To use Medisync, click the verification button. This helps keep your account secure.
              </td>
            </tr>
            <tr>
              <td align="center">
                <a
                  href=${verificationLink}
                  style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 24px; font-size: 14px; font-weight: bold; border-radius: 6px;"
                >
                  Verify Email
                </a>
              </td>
            </tr>
            <tr>
              <td align="center" style="font-size: 12px; color: #6b7280; padding-top: 30px;">
                You're receiving this email because you have an account in Medisync. If you are not sure why you're receiving this, please contact us by replying to this email.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
        `,
      });
      return res.status(HttpCode.create).json({
        status: true,
        message: `${role} created successfully & verification email sent`,
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
      const { token } = req.query;
      if (!token) {
        return res.status(HttpCode.badRequest).json({
          status: false,
          message: "Verification token is required!",
        });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const email = decoded.email;

      const existingUser = await UserModel.findOne({ email });

      if (!existingUser) {
        return res.status(HttpCode.notFound).json({
          status: false,
          message: "User not found!",
        });
      }
      if (existingUser.verified) {
        return res.status(HttpCode.badRequest).json({
          status: false,
          message: "User is already verified!",
        });
      }
      existingUser.verified = true;
      await existingUser.save();
      return res.status(HttpCode.success).json({
        status: true,
        message: "Email verified successfully!",
      });
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(HttpCode.unauthorized).json({
          status: false,
          message: "Verification token has expired!",
        });
      }
      return res.status(HttpCode.serverError).json({
        status: false,
        message: error.message,
      });
    }
  }
  async Signin(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(HttpCode.badRequest).json({
          status: false,
          message: "All fields are required",
        });
      }
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(HttpCode.notFound).json({
          status: false,
          message: "User not found!",
        });
      }
      const verifyPassword = comparePassword(password, user.password);
      if (!verifyPassword) {
        return res.status(HttpCode.unauthorized).json({
          status: false,
          message: "Incorrect password!",
        });
      }
      const token = jwt.sign(
        {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.Email,
          role: user.role,
          designation: user.designation,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "5hr" }
      );
      return res.status(HttpCode.success).json({
        status: true,
        message: `Welcome ${user.designation}`,
        token: token,
      });
    } catch (error) {
      return res.status(HttpCode.serverError).json({
        status: false,
        message: error.message,
      });
    }
  }
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      const existingUser = await UserModel.findOne({ email });
      if (!existingUser) {
        return res.status(HttpCode.badRequest).json({
          status: false,
          message: "User not found!",
        });
      }
      const codeValue = Math.floor(Math.random() * 1000000).toString();
      let info = await transport.sendMail({
        from: process.env.NODEMAILER_EMAIL,
        to: existingUser.email,
        subject: "Reset your password",
        html: "<h1>" + codeValue + "</h1>",
      });
      if (info.accepted[0] === existingUser.email) {
        const hashedCodeValue = hmacProcess(
          codeValue,
          process.env.HMAC_PROCESS_SECRET
        );
        existingUser.forgotPasswordCode = hashedCodeValue;
        existingUser.forgotPasswordCodeValidation = Date.now();
        await existingUser.save();
        return res.status(HttpCode.success).json({
          status: true,
          message: "Reset password code sent!",
        });
      }
    } catch (error) {
      return res.status(HttpCode.serverError).json({
        status: false,
        message: error.message,
      });
    }
  }
  async resetPassword(req, res) {
    try {
      const { email, code, newPassword } = req.body;
      const codeValue = code.toString();
      const existingUser = await UserModel.findOne({ email }).select(
        "+forgotPasswordCode +forgotPasswordCodeValidation"
      );
      if (!existingUser) {
        return res.status(HttpCode.notFound).json({
          status: false,
          message: "User not found!",
        });
      }
      if (
        !existingUser.forgotPasswordCode ||
        !existingUser.forgotPasswordCodeValidation
      ) {
        return res.status(HttpCode.badRequest).json({
          status: false,
          message: "Something went wrong!",
        });
      }
      if (
        Date.now() - existingUser.forgotPasswordCodeValidation >
        5 * 60 * 1000
      ) {
        return res.status(HttpCode.badRequest).json({
          status: false,
          message: "Reset password code expired!",
        });
      }
      const hashedCodeValue = hmacProcess(
        codeValue,
        process.env.HMAC_PROCESS_SECRET
      );
      if (hashedCodeValue === existingUser.forgotPasswordCode) {
        const hashed = hashPassword(newPassword);
        existingUser.password = hashed;
        existingUser.forgotPasswordCode = undefined;
        existingUser.forgotPasswordCodeValidation = undefined;
        await existingUser.save();
      }
      return res.status(HttpCode.success).json({
        status: true,
        message: "Password reset successful",
      });
    } catch (error) {
      return res.status(HttpCode.internalServerError).json({
        status: false,
        message: error.message,
      });
    }
  }
}
module.exports = new UserController();
