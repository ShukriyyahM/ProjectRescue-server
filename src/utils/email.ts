import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM;

if (!RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is not defined");
}

if (!EMAIL_FROM) {
  throw new Error("EMAIL_FROM is not defined");
}

const resend = new Resend(RESEND_API_KEY);

export const sendPasswordResetEmail = async (
  email: string,
  resetToken: string
) => {
  const frontendUrl =
    process.env.FRONTEND_URL || "http://localhost:3000";

  const resetUrl =
    `${frontendUrl}/reset-password?token=${encodeURIComponent(resetToken)}`;

  const { data, error } = await resend.emails.send({
    from: EMAIL_FROM,
    to: [email],
    subject: "Reset your ProjectRescue password",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Reset your ProjectRescue password</h2>

        <p>We received a request to reset your password.</p>

        <p>
          Click the button below to create a new password:
        </p>

        <p>
          <a
            href="${resetUrl}"
            style="
              display: inline-block;
              padding: 12px 20px;
              background: #111827;
              color: #ffffff;
              text-decoration: none;
              border-radius: 6px;
            "
          >
            Reset Password
          </a>
        </p>

        <p>This link will expire in 15 minutes.</p>

        <p>
          If you did not request a password reset, you can safely ignore
          this email.
        </p>

        <p>— ProjectRescue</p>
      </div>
    `,
  });

  if (error) {
    throw new Error(
      `Failed to send password reset email: ${error.message}`
    );
  }

  return data;
};