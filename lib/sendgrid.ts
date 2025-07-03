import sgMail from "@sendgrid/mail";

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY が設定されていません");
}
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendOtpEmail(to: string, otp: string) {
  const msg = {
    to,
    from: process.env.SENDGRID_DEFAULT_FROM!,
    subject: "【学転】認証コードのご案内",
    text: `認証コード：${otp}`,
    html: `<p>以下のコードを入力してください：</p><h2>${otp}</h2>`,
  };
  await sgMail.send(msg);
}