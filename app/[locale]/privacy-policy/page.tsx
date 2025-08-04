import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDictionary } from '../dictionaries';
import { Metadata } from 'next';

interface PrivacyPageProps {
  params: Promise<{ locale: 'en' | 'fr' | 'ar' }>;
}

export async function generateMetadata({ params }: PrivacyPageProps): Promise<Metadata> {
  const { locale } = await params;
  const messages = await getDictionary(locale);
  
  return {
    title: messages.privacyPolicy?.pageTitle || "Privacy Policy | TransleXable",
    description: messages.privacyPolicy?.metaDescription || "Learn how TransleXable protects your privacy and handles your data.",
  };
}

// Manual translation function
function getTranslation(messages: Record<string, unknown>, path: string): string {
  const result = path.split('.').reduce<unknown>((obj, key) => {
    return obj && typeof obj === 'object' && key in obj ? (obj as Record<string, unknown>)[key] : undefined;
  }, messages);
  return typeof result === 'string' ? result : path;
}

export default async function PrivacyPolicyPage({ params }: PrivacyPageProps) {
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
            Privacy Policy
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
                At TransleXable, we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our translation services.
              </p>
            </CardContent>
          </Card>

          {/* Information We Collect */}
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="text-2xl gradient-text">2. Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none dark:prose-invert">
              <h3 className="text-xl font-semibold mb-3">Personal Information</h3>
              <ul>
                <li>Name and email address when you create an account</li>
                <li>Payment information for premium services</li>
                <li>Profile information you choose to provide</li>
              </ul>
              
              <h3 className="text-xl font-semibold mb-3 mt-6">Usage Information</h3>
              <ul>
                <li>Content you upload for translation</li>
                <li>Translation history and preferences</li>
                <li>Device information and IP address</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </CardContent>
          </Card>

          {/* How We Use Information */}
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="text-2xl gradient-text">3. How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none dark:prose-invert">
              <p>We use your information to:</p>
              <ul>
                <li>Provide and improve our translation services</li>
                <li>Process your translations using AI technology</li>
                <li>Manage your account and billing</li>
                <li>Send important service notifications</li>
                <li>Analyze usage patterns to enhance user experience</li>
                <li>Prevent fraud and ensure security</li>
              </ul>
            </CardContent>
          </Card>

          {/* Data Processing and AI */}
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="text-2xl gradient-text">4. AI and Data Processing</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none dark:prose-invert">
              <p>
                We use third-party AI services (DeepL API and Gemini AI) to process your translations. Your content is:
              </p>
              <ul>
                <li>Processed securely through encrypted connections</li>
                <li>Not stored permanently by our AI providers</li>
                <li>Used solely for translation purposes</li>
                <li>Deleted from our systems after processing (unless saved by you)</li>
              </ul>
            </CardContent>
          </Card>

          {/* Data Sharing */}
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="text-2xl gradient-text">5. Information Sharing</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none dark:prose-invert">
              <p>We do not sell your personal information. We may share information in these circumstances:</p>
              <ul>
                <li>With AI service providers for translation processing</li>
                <li>With payment processors for billing</li>
                <li>When required by law or to protect our rights</li>
                <li>In connection with a business transfer or merger</li>
                <li>With your explicit consent</li>
              </ul>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="text-2xl gradient-text">6. Data Security</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none dark:prose-invert">
              <p>We implement robust security measures including:</p>
              <ul>
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security audits and monitoring</li>
                <li>Access controls and authentication</li>
                <li>Secure data centers and infrastructure</li>
                <li>Employee training on data protection</li>
              </ul>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="text-2xl gradient-text">7. Your Privacy Rights</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none dark:prose-invert">
              <p>You have the right to:</p>
              <ul>
                <li>Access your personal data</li>
                <li>Correct inaccurate information</li>
                <li>Delete your account and data</li>
                <li>Export your data</li>
                <li>Object to certain processing activities</li>
                <li>Withdraw consent where applicable</li>
              </ul>
            </CardContent>
          </Card>

          {/* Cookies */}
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="text-2xl gradient-text">8. Cookies and Tracking</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none dark:prose-invert">
              <p>
                We use cookies and similar technologies to enhance your experience, analyze usage, and provide personalized services. You can control cookie settings through your browser preferences.
              </p>
            </CardContent>
          </Card>

          {/* International Transfers */}
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="text-2xl gradient-text">9. International Data Transfers</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none dark:prose-invert">
              <p>
                Your data may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information during international transfers.
              </p>
            </CardContent>
          </Card>

          {/* Data Retention */}
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="text-2xl gradient-text">10. Data Retention</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none dark:prose-invert">
              <p>
                We retain your personal data only as long as necessary for the purposes outlined in this policy or as required by law. Translation content is typically deleted after processing unless you choose to save it.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="text-2xl gradient-text">11. Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none dark:prose-invert">
              <p>
                If you have questions about this Privacy Policy or want to exercise your rights, contact us at:
                <br />
                Email: privacy@translexable.com
                <br />
                Address: TransleXable Privacy Team
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 