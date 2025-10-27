import nodemailer from 'nodemailer';
import { QuoteRequest } from '../types';

// 创建邮件传输器
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

/**
 * 发送询价邮件
 */
export async function sendQuoteEmail(
  quoteRequest: QuoteRequest
): Promise<void> {
  const { customerName, email, company, phone, products, message } = quoteRequest;

  // 生成产品列表 HTML
  const productsListHtml = products
    .map(
      (p) => `
    <tr>
      <td style="padding: 10px; border: 1px solid #ddd;">${p.productName}</td>
      <td style="padding: 10px; border: 1px solid #ddd;">${p.quantity}</td>
    </tr>
  `
    )
    .join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #333; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th { background-color: #333; color: white; padding: 10px; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>新的询价申请</h1>
        </div>
        <div class="content">
          <h2>客户信息</h2>
          <p><strong>姓名:</strong> ${customerName}</p>
          <p><strong>邮箱:</strong> ${email}</p>
          ${company ? `<p><strong>公司:</strong> ${company}</p>` : ''}
          ${phone ? `<p><strong>电话:</strong> ${phone}</p>` : ''}

          <h2>询价产品</h2>
          <table>
            <thead>
              <tr>
                <th>产品名称</th>
                <th>数量</th>
              </tr>
            </thead>
            <tbody>
              ${productsListHtml}
            </tbody>
          </table>

          ${message ? `<h2>客户留言</h2><p>${message}</p>` : ''}
        </div>
        <div class="footer">
          <p>此邮件由工艺品展示系统自动发送</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
    subject: `新询价申请 - ${customerName}`,
    html: htmlContent,
    replyTo: email,
  };

  await transporter.sendMail(mailOptions);
}
