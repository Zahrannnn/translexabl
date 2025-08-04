import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDictionary } from '../dictionaries';
import { Metadata } from 'next';

interface TermsPageProps {
  params: Promise<{ locale: 'en' | 'fr' | 'ar' }>;
}

export async function generateMetadata({ params }: TermsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const messages = await getDictionary(locale);
  
  return {
    title: messages.termsAndConditions?.pageTitle || "Terms and Conditions | TransleXable",
    description: messages.termsAndConditions?.metaDescription || "Read our Terms and Conditions for using TransleXable translation services.",
  };
}

// Manual translation function
function getTranslation(messages: Record<string, unknown>, path: string): string {
  const result = path.split('.').reduce<unknown>((obj, key) => {
    return obj && typeof obj === 'object' && key in obj ? (obj as Record<string, unknown>)[key] : undefined;
  }, messages);
  return typeof result === 'string' ? result : path;
}

export default async function TermsAndConditionsPage({ params }: TermsPageProps) {
  const { locale } = await params;
  const messages = await getDictionary(locale);
  const t = (path: string) => getTranslation(messages, path);

  const lastUpdated = "January 1, 2025";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold gradient-text mb-4">
            Terms and Conditions
          </h1>
         
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Introduction */}
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="text-2xl gradient-text">1. Introduction</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none dark:prose-invert">
              <p>
                Welcome to TransleXable ("we," "our," or "us"). These Terms and Conditions ("Terms") govern your use of our translation platform and services. By accessing or using TransleXable, you agree to be bound by these Terms.
              </p>
            </CardContent>
          </Card>

          {/* Services */}
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="text-2xl gradient-text">2. Services</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none dark:prose-invert">
              <p>TransleXable provides AI-powered translation services including:</p>
              <ul>
                <li>Text translation using DeepL API and Gemini AI</li>
                <li>Document translation (PDF, DOCX, PowerPoint, SRT files)</li>
                <li>Real-time translation services</li>
                <li>Professional translation tools and features</li>
              </ul>
            </CardContent>
          </Card>

          {/* User Accounts */}
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="text-2xl gradient-text">3. User Accounts</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none dark:prose-invert">
              <p>To access certain features, you must create an account. You are responsible for:</p>
              <ul>
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Providing accurate and complete information</li>
                <li>Keeping your account information up to date</li>
              </ul>
            </CardContent>
          </Card>

          {/* Usage Guidelines */}
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="text-2xl gradient-text">4. Acceptable Use</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none dark:prose-invert">
              <p>You agree not to use our services to:</p>
              <ul>
                <li>Violate any laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Distribute malicious software or harmful content</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Upload content that is illegal, offensive, or harmful</li>
              </ul>
            </CardContent>
          </Card>

          {/* Payment Terms */}
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="text-2xl gradient-text">5. Payment and Billing</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none dark:prose-invert">
              <ul>
                <li>Payment is required for premium services and features</li>
                <li>All fees are non-refundable unless otherwise specified</li>
                <li>We may change our pricing with 30 days notice</li>
                <li>Accounts may be suspended for non-payment</li>
              </ul>
            </CardContent>
          </Card>

          {/* Intellectual Property */}
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="text-2xl gradient-text">6. Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none dark:prose-invert">
              <p>
                You retain ownership of content you upload. By using our services, you grant us a license to process and translate your content. Our platform, software, and technology remain our intellectual property.
              </p>
            </CardContent>
          </Card>

          {/* Privacy */}
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="text-2xl gradient-text">7. Privacy</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none dark:prose-invert">
              <p>
                Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your information.
              </p>
            </CardContent>
          </Card>

          {/* Limitation of Liability */}
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="text-2xl gradient-text">8. Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none dark:prose-invert">
              <p>
                TransleXable is provided "as is" without warranties. We shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our services.
              </p>
            </CardContent>
          </Card>

          {/* Termination */}
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="text-2xl gradient-text">9. Termination</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none dark:prose-invert">
              <p>
                We may terminate or suspend your account at any time for violation of these Terms. You may terminate your account at any time by contacting us.
              </p>
            </CardContent>
          </Card>

          {/* Changes to Terms */}
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="text-2xl gradient-text">10. Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none dark:prose-invert">
              <p>
                We reserve the right to update these Terms at any time. Continued use of our services constitutes acceptance of the updated Terms.
              </p>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="text-2xl gradient-text">11. Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none dark:prose-invert">
              <p>
                If you have questions about these Terms, please contact us at:
                <br />
                Email: legal@translexable.com
                <br />
                Address: TransleXable Legal Department
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 