import nodemailer from 'nodemailer';
import { QuoteRequest } from '../types';
import { getEnabledEmails } from '../data/config';

/**
 * 创建邮件传输器
 */
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
}

/**
 * 发送询价邮件到所有配置的邮箱
 */
export async function sendQuoteEmail(
  quoteRequest: QuoteRequest
): Promise<void> {
  const { customerName, email, company, phone, products, message, customImages } = quoteRequest;

  // 获取所有启用的邮箱
  const recipients = getEnabledEmails();

  if (recipients.length === 0) {
    throw new Error('No email recipients configured');
  }

  // 生成产品列表 HTML
  const productsListHtml = products
    .map(
      (p) => `
    <tr>
      <td style="padding: 10px; border: 1px solid #ddd;">${p.productName}</td>
      <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${p.quantity}</td>
    </tr>
  `
    )
    .join('');

  // 生成客户上传的图片 HTML
  const customImagesHtml = customImages && customImages.length > 0
    ? `
      <h2>客户上传的产品图片</h2>
      <div style="display: flex; flex-wrap: wrap; gap: 10px;">
        ${customImages.map((img, index) => `
          <div style="border: 1px solid #ddd; padding: 5px;">
            <img src="${img}" alt="Customer Image ${index + 1}" style="max-width: 200px; max-height: 200px;" />
          </div>
        `).join('')}
      </div>
    `
    : '';

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
                <th style="text-align: left;">产品名称</th>
                <th style="text-align: center;">数量</th>
              </tr>
            </thead>
            <tbody>
              ${productsListHtml}
            </tbody>
          </table>

          ${customImagesHtml}

          ${message ? `<h2>客户留言</h2><p style="white-space: pre-wrap;">${message}</p>` : ''}
        </div>
        <div class="footer">
          <p>此邮件由工艺品展示系统自动发送</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: recipients.join(', '),
    subject: `New Quote Request - ${customerName} | 新询价申请 - ${customerName}`,
    html: htmlContent,
    replyTo: email,
  };

  await transporter.sendMail(mailOptions);
}
