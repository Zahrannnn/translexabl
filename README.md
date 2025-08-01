# TransleXable 🌍

<div align="center">

![TransleXable Logo](https://img.shields.io/badge/TransleXable-Professional%20Translation%20Platform-blue?style=for-the-badge)

[![Next.js](https://img.shields.io/badge/Next.js-15.3.5-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)

**Breaking down language barriers with AI-powered translation technology**

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Usage](#-usage) • [API](#-api-documentation) • [Contributing](#-contributing)

</div>

---

## 📖 About

TransleXable is a comprehensive web platform that enables users to translate text and documents with precision using advanced AI technologies. Built with Next.js 15 and powered by DeepL Pro API and Google Gemini AI, it offers professional-grade translation services with support for tone selection, glossary terms, grammar review, and optional human review.

### 🎯 Mission
We believe that language should never be a barrier to human connection, business growth, or knowledge sharing. Our cutting-edge AI translation technology preserves the nuance, context, and emotion of human communication while bridging cultures and enabling global collaboration.

---

## ✨ Features

### 🔤 **Text & Document Translation**
- **Text Translation**: Instant translation of raw text with real-time preview
- **Document Support**: Translate PDFs, DOCX, PowerPoint (PPTX), and SRT subtitle files
- **Batch Processing**: Handle multiple documents efficiently

### 🎨 **Advanced Customization**
- **Tone Selection**: Choose from formal, informal, business, or friendly tones
- **Custom Glossary**: Add domain-specific terminology for consistent translations
- **Grammar Check**: Built-in grammar validation and correction
- **Context Awareness**: AI understands context for more accurate translations

### 👥 **Human Review System**
- **Professional Review**: Optional human review by qualified translators
- **Quality Assurance**: Manual quality control for critical documents
- **WhatsApp Integration**: Direct communication with human reviewers

### 💳 **Credit System & Payments**
- **Flexible Pricing**: Credit-based system (1 credit = 700 characters)
- **Payment Integration**: Secure payments via Paymob (Visa, MasterCard, local methods)
- **Crypto Support**: Cryptocurrency payment options available
- **No Expiration**: Credits never expire
- **Custom Packages**: Tailored pricing for organizations

### 🌐 **Internationalization**
- **Multi-language Support**: 50+ language pairs supported
- **RTL Support**: Full right-to-left language support (Arabic, Hebrew)
- **Localized Interface**: Available in English, Arabic, and French
- **Regional Pricing**: Localized pricing in Egyptian Pounds (EGP)

### 🚀 **Advanced Features**
- **Real-time Collaboration**: Team features for shared projects
- **API Access**: RESTful API for developers and integrations
- **Daily Free Limits**: Free tier with generous daily character limits
- **Project Status Tracking**: Monitor translation progress and history
- **Admin Dashboard**: Comprehensive management interface

---

## 🛠 Tech Stack

### **Frontend**
- **Framework**: Next.js 15.3.5 with App Router
- **Language**: TypeScript 5.0
- **Styling**: TailwindCSS 4.0
- **UI Components**: Radix UI primitives
- **Animations**: GSAP 3.13
- **State Management**: TanStack Query v5
- **Icons**: Lucide React

### **Backend & APIs**
- **API Routes**: Next.js API routes
- **Translation Services**: 
  - DeepL Pro API (primary)
  - Google Gemini AI (secondary)
- **Payments**: Paymob integration
- **Authentication**: Custom auth system
- **File Storage**: Local file system with temporary storage

### **Development & Tools**
- **Package Manager**: npm
- **Linting**: ESLint 9 with Next.js config
- **Type Safety**: Zod validation
- **Internationalization**: next-intl
- **Development**: Turbopack for fast development

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0 or higher
- **npm** or **yarn**
- **DeepL API Key** (Free or Pro)
- **Google Gemini API Key** (optional)
- **Paymob Account** (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/translexable.git
   cd translexable
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your environment variables:
   ```env
   # Translation APIs
   DEEPL_API_KEY=your_deepl_api_key_here
   GEMINI_API_KEY=your_gemini_api_key_here
   
   # Payment Integration
   PAYMOB_API_KEY=your_paymob_api_key
   PAYMOB_INTEGRATION_ID=your_integration_id
   PAYMOB_IFRAME_ID=your_iframe_id
   
   # Security
   NEXT_PUBLIC_HMAC_SECRET=your_webhook_secret
   
   # Application
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

### API Key Setup

#### DeepL API Key
1. Sign up at [DeepL Pro API](https://www.deepl.com/pro-api)
2. Choose your plan:
   - **Free**: 500,000 characters/month (key ends with `:fx`)
   - **Pro**: Paid plans with higher limits (standard UUID format)
3. The system automatically detects the correct endpoint

#### Google Gemini API
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your environment variables

---

## 📱 Usage

### Text Translation

1. **Navigate** to the text translation page
2. **Select** source and target languages
3. **Choose** your preferred tone (formal, informal, business, friendly)
4. **Add** custom glossary terms (optional)
5. **Enable** grammar check if needed
6. **Paste** your text
7. **Review** credit estimation
8. **Translate** and copy results

### Document Translation

1. **Upload** your document (PDF, DOCX, PPTX, SRT)
2. **Configure** translation settings
3. **Monitor** progress in real-time
4. **Download** translated document
5. **Access** via dashboard history

### Admin Features

- **User Management**: View and manage user accounts
- **Transaction Monitoring**: Track all payment transactions
- **Blog Management**: Create and edit blog posts
- **System Analytics**: View platform statistics

---

## 🔧 API Documentation

### Text Translation Endpoint

```http
POST /api/translate
Content-Type: application/json

{
  "text": "Hello, world!",
  "source_lang": "EN",
  "target_lang": "AR",
  "tone": "formal"
}
```

### Document Translation Endpoint

```http
POST /api/translate-document
Content-Type: multipart/form-data

{
  "file": <File>,
  "source_lang": "EN", 
  "target_lang": "AR",
  "tone": "business"
}
```

### Response Format

```json
{
  "translated_text": "مرحبا بالعالم!",
  "detected_source_language": "EN",
  "characters_used": 13,
  "credits_used": 1,
  "tone_applied": "formal"
}
```

---

## 🏗 Project Structure

```
translexabl/
├── app/                          # Next.js App Router
│   ├── [locale]/                # Internationalized routes
│   │   ├── about/               # About page
│   │   ├── admin/               # Admin dashboard
│   │   ├── dashboard/           # User dashboard
│   │   ├── pricing/             # Pricing plans
│   │   ├── translate-txt/       # Text translation
│   │   └── translate-docs/      # Document translation
│   └── api/                     # API routes
│       ├── auth/               # Authentication endpoints
│       ├── translate/          # Translation services
│       ├── paymob/            # Payment processing
│       └── admin/             # Admin operations
├── components/                  # Reusable React components
│   ├── auth/                   # Authentication components
│   ├── layout/                 # Layout components
│   └── ui/                     # UI primitives
├── hooks/                      # Custom React hooks
├── lib/                        # Utility libraries
├── messages/                   # Internationalization files
├── types/                      # TypeScript type definitions
└── uploads/                    # File upload storage
```

---

## 🌍 Internationalization

TransleXable supports multiple languages with full RTL support:

- **English** (default)
- **Arabic** (عربي) - RTL support
- **French** (Français)

### Adding New Languages

1. Create translation file in `messages/[locale].json`
2. Add locale to `i18n.ts` configuration
3. Update middleware routing in `middleware.ts`
4. Test RTL layout for right-to-left languages

---

## 💰 Pricing & Credits

### Credit System
- **1 Credit** = 700 characters of translation
- **No Expiration** - Credits never expire
- **Flexible Usage** - Works with all language pairs

### Pricing Tiers
- **Popular Pack**: Best value for regular users
- **Premium Pack**: Perfect for businesses
- **Custom Pack**: Choose your exact credit amount
- **Enterprise**: Custom pricing for organizations

---

## 🛡 Security & Privacy

- **Secure Payments**: PCI-compliant payment processing via Paymob
- **Data Protection**: Temporary file storage with automatic cleanup
- **API Security**: Rate limiting and authentication
- **HTTPS**: Encrypted data transmission
- **Privacy First**: No permanent storage of sensitive content

---

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Configure environment variables** in Vercel dashboard
3. **Deploy** automatically on push to main branch

### Self-Hosting

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

3. **Configure reverse proxy** (nginx/Apache)
4. **Set up SSL certificate**

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Add** tests if applicable
5. **Submit** a pull request

### Code Style

- **ESLint**: Follow the configured linting rules
- **TypeScript**: Maintain type safety
- **Prettier**: Use consistent formatting
- **Conventional Commits**: Follow commit message conventions

---

## 📊 Performance

- **Fast Loading**: Optimized with Next.js 15 and Turbopack
- **Efficient Translations**: Smart caching and batch processing
- **Responsive Design**: Mobile-first responsive interface
- **SEO Optimized**: Server-side rendering and meta optimization

---

## 🆘 Support

### Documentation
- **Translation Guide**: [TRANSLATION_TEST_README.md](TRANSLATION_TEST_README.md)
- **Project Status**: [PROJECT_STATUS_INTEGRATION.md](PROJECT_STATUS_INTEGRATION.md)

### Community
- **Issues**: [GitHub Issues](https://github.com/Zahrannnne/translexable/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Zahrannnn/translexable/discussions)
- **Email**: support@translexable.com

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **DeepL** for providing exceptional translation API
- **Google** for Gemini AI integration
- **Vercel** for hosting and deployment platform
- **Next.js Team** for the amazing framework
- **Open Source Community** for the incredible tools and libraries

---

<div align="center">

**Made with ❤️ by the TransleXable Team**

[Website](https://www.translexable.io/en) 

</div>
