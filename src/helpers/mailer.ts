import nodemailer from "nodemailer";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";

export const sendmail = async ({ email, emailType, userId }: any) => {
    try {
        // Create hash token
        const hashedToken = await bcrypt.hash(userId.toString(), 10);

        // Update user with token depending on email type
        if (emailType === "VERIFY") {
            await User.findByIdAndUpdate(
                userId,
                {
                    verifyToken: hashedToken,
                    verifyTokenExpiry: Date.now() + 3600000, // 1 hour
                },
                { new: true, runValidators: true }
            ).select("-password -__v");
        } else if (emailType === "RESET") {
            await User.findByIdAndUpdate(
                userId,
                {
                    forgotPasswordToken: hashedToken,
                    forgotPasswordExpiry: Date.now() + 3600000,
                },
                { new: true, runValidators: true }
            ).select("-password -__v");
        }

        // Create transport
        // Looking to send emails in production? Check out our Email API/SMTP product!
        var transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user:"573c61588ab096", // Your Mailtrap username
                pass: "6db22bde666f18", // Your Mailtrap password
            }
        });

        // Generate verification/reset URL
        const url =
            emailType === "VERIFY"
                ? `${process.env.DOMAIN}/verifyemail?token=${hashedToken}`
                : `${process.env.DOMAIN}/resetpassword?token=${hashedToken}`;

        // HTML email body
        const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${emailType === "VERIFY" ? "Verify Email" : "Reset Password"}</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
  <table width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px;">
    <tr>
      <td align="center">
        <h2 style="color: #333;">
          ${emailType === "VERIFY" ? "Verify Your Email Address" : "Reset Your Password"}
        </h2>
      </td>
    </tr>
    <tr>
      <td>
        <p style="color: #555;">
          Hi there,
        </p>
        <p style="color: #555;">
          Please ${emailType === "VERIFY" ? "verify your email" : "reset your password"
            } by clicking the button below.
        </p>
        <p style="text-align: center; margin: 30px 0;">
          <a href="${url}" 
             style="background-color: #007bff; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            ${emailType === "VERIFY" ? "Verify Email" : "Reset Password"}
          </a>
        </p>
        <p style="color: #999; font-size: 12px;">
          If you did not request this, please ignore this email.
        </p>
        <p style="color: #999; font-size: 12px;">
          &copy; 2025 Your Company. All rights reserved.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;

        // Define mail options
        const mailOptions = {
            from: process.env.MAIL_TRAP_USER,
            to: email,
            subject:
                emailType === "VERIFY"
                    ? "Verify your email address"
                    : "Reset your password",
            html: htmlContent,
        };

        // Send email
        const response = await transport.sendMail(mailOptions);
        return response;
    } catch (error: any) {
        throw Error(error.message);
    }
};
