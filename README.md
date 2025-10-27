# Metal Crafts Product Showcase Website

A professional B2B website for showcasing metal craft products with AI-powered product generation and multi-language support.

## 🌟 Features

### Core Features
- **Multi-language Support**: Chinese, English, and Arabic (targeting Middle Eastern customers)
- **AI Product Generation**: Upload product images and AI automatically generates product information
- **Batch Upload**: Upload multiple product images at once
- **SEO Optimized**: Each product gets a unique page with meta tags and sitemap
- **Quote System**: Customers can select multiple products and request quotes
- **Email Notifications**: Quote requests are sent to multiple department emails
- **Product Categories**: Incense Burner, Dry Fruit Box, Glass & Iron Fruit Plate, Iron Dining Table, Iron Ornaments
- **Image Magnifier**: Zoom in on product images for detailed viewing

### AI Features
- **AI Learning**: The system learns from your edits to improve future generations
- **Auto-publish**: Products can be automatically published or reviewed before publishing
- **Multi-language Generation**: AI generates product info in all 3 languages simultaneously

### Customer Features
- **Custom Image Upload**: Customers can upload their own product images in quote requests
- **Multi-product Selection**: Add multiple products to quote cart
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- OpenAI API key
- Email account for SMTP (Gmail, QQ Mail, etc.)

### Installation

1. Clone the repository
\`\`\`bash
git clone https://github.com/changle0245/gongyipindulizhan.git
cd gongyipindulizhan
\`\`\`

2. Install dependencies
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables
\`\`\`bash
cp .env.example .env
\`\`\`

Edit `.env` and fill in your credentials:
- `OPENAI_API_KEY`: Your OpenAI API key
- `SMTP_*`: Your email SMTP settings
- `ADMIN_EMAIL`: Where quote requests will be sent

4. Run the development server
\`\`\`bash
npm run dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

\`\`\`
├── app/                      # Next.js 14 App Router
│   ├── [locale]/            # Multi-language routes
│   │   ├── page.tsx         # Homepage
│   │   ├── products/        # Product pages
│   │   ├── quote/           # Quote request page
│   │   └── admin/           # Admin panel
│   └── api/                 # API routes
│       ├── quote/           # Quote email API
│       ├── ai-generate/     # AI generation API
│       ├── products/        # Product CRUD API
│       └── upload/          # Image upload API
├── components/              # React components
│   ├── ui/                  # UI components (Button, Card, etc.)
│   ├── layout/              # Header, Footer
│   └── products/            # Product-specific components
├── lib/                     # Utilities and business logic
│   ├── ai/                  # AI generation logic
│   ├── data/                # Data management
│   ├── email/               # Email sending
│   └── types.ts             # TypeScript types
├── messages/                # Translation files
│   ├── en.json              # English
│   ├── zh.json              # Chinese
│   └── ar.json              # Arabic
└── public/                  # Static files
    └── uploads/             # Uploaded product images
\`\`\`

## 🎯 Usage Guide

### For Administrators

#### 1. Batch Upload Products

1. Go to `/en/admin/upload` (or `/zh/admin/upload`, `/ar/admin/upload`)
2. Drag and drop or select multiple product images
3. Toggle "Auto-publish" ON to publish immediately, or OFF to review first
4. Click "Process Images"
5. AI will:
   - Analyze each image
   - Generate product name, description, specifications in 3 languages
   - Automatically publish to the website (if auto-publish is ON)

#### 2. Configure Email Addresses

Edit `data/config.json` to add multiple department emails:

\`\`\`json
{
  "emails": [
    {
      "department": "Sales Department",
      "email": "sales@yourcompany.com",
      "enabled": true
    },
    {
      "department": "Export Department",
      "email": "export@yourcompany.com",
      "enabled": true
    }
  ]
}
\`\`\`

#### 3. Customize AI Template

The AI learns from your edits. To improve AI accuracy:

1. Review AI-generated products
2. Edit and correct any information
3. The system automatically learns from your edits
4. Future generations will be more accurate

### For Customers

#### Request a Quote

1. Browse products on the homepage
2. Click "Add to Quote" on products you're interested in
3. Go to the Quote page
4. Fill in your information
5. Optionally upload custom product images
6. Submit the quote request
7. You'll receive a confirmation and the company will contact you

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub

2. Connect your GitHub repository to Vercel

3. Set environment variables in Vercel dashboard

4. Deploy!

### Custom Domain (Aliyun)

1. Purchase a domain from Aliyun
2. In Vercel, go to Settings → Domains
3. Add your domain
4. Update DNS records in Aliyun:
   - Add A record or CNAME record as instructed by Vercel
5. Wait for DNS propagation (can take up to 48 hours)

## 🔧 Configuration

### Email Setup

#### Gmail
1. Enable 2-factor authentication
2. Generate an App Password
3. Use the app password in `SMTP_PASSWORD`

#### QQ Mail
1. Go to Settings → Account
2. Enable SMTP service
3. Get authorization code
4. Use authorization code in `SMTP_PASSWORD`

### Product Categories

Edit `lib/data/categories.ts` to add or modify categories:

\`\`\`typescript
export const defaultCategories: Category[] = [
  {
    id: 'your-category-id',
    name: {
      en: 'English Name',
      zh: '中文名称',
      ar: 'الاسم العربي'
    },
    slug: 'your-category-slug',
    description: {
      en: 'English description',
      zh: '中文描述',
      ar: 'الوصف العربي'
    }
  }
];
\`\`\`

## 📊 SEO Optimization

- Each product has a unique URL: `/products/[id]`
- Dynamic meta tags for each product
- Automatic sitemap generation
- Multi-language SEO support
- Semantic HTML structure

## 🔐 Security

- Environment variables for sensitive data
- No credentials stored in code
- Secure file upload validation
- Email sanitization

## 🐛 Troubleshooting

### AI Generation Fails

- Check your `OPENAI_API_KEY` is valid
- Ensure you have credits in your OpenAI account
- Check image file size (max 10MB)

### Email Not Sending

- Verify SMTP credentials
- Check if SMTP port is correct (587 for TLS, 465 for SSL)
- Make sure "Less secure app access" is enabled (Gmail)
- Check spam folder

### Images Not Uploading

- Check `public/uploads` directory exists
- Verify file permissions
- Check file size limits

## 📝 License

This project is proprietary and confidential.

## 🤝 Support

For support, email support@yourcompany.com or contact your development team.

## 🎨 Customization

### Change Colors

Edit `app/globals.css` to customize the color scheme.

### Change Fonts

Edit `app/layout.tsx` to import different Google Fonts.

### Add More Languages

1. Add locale to `i18n.ts`
2. Create translation file in `messages/[locale].json`
3. Update type definitions in `lib/types.ts`

## 📈 Analytics

To add analytics (Google Analytics, etc.):

1. Install analytics package
2. Add tracking code to `app/layout.tsx`
3. Set up conversion tracking for quote submissions

---

Built with ❤️ using Next.js 14, TypeScript, and AI
