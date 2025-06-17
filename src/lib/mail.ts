// ===== lib/mail.ts =====
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendLoginNotification(email: string): Promise<void> {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: 'ログイン通知',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>ログイン通知</h2>
        <p>お客様のアカウントにログインが検出されました。</p>
        <p><strong>ログイン時刻:</strong> ${new Date().toLocaleString('ja-JP')}</p>
        <p>心当たりがない場合は、速やかにパスワードを変更してください。</p>
        <hr>
        <p style="font-size: 12px; color: #666;">
          このメールは自動送信されています。返信はできません。
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}
