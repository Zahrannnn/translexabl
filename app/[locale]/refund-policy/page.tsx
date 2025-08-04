import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDictionary } from '../dictionaries';
import { Metadata } from 'next';

interface RefundPageProps {
  params: Promise<{ locale: 'en' | 'fr' | 'ar' }>;
}

export async function generateMetadata({ params }: RefundPageProps): Promise<Metadata> {
  const { locale } = await params;
  const messages = await getDictionary(locale);
  
  return {
    title: messages.refundPolicy?.pageTitle || "Refund Policy | TransleXable",
    description: messages.refundPolicy?.metaDescription || "Learn about TransleXable's refund policy and how to request refunds.",
  };
}

// Manual translation function
function getTranslation(messages: Record<string, unknown>, path: string): string {
  const result = path.split('.').reduce<unknown>((obj, key) => {
    return obj && typeof obj === 'object' && key in obj ? (obj as Record<string, unknown>)[key] : undefined;
  }, messages);
  return typeof result === 'string' ? result : path;
}

export default async function RefundPolicyPage({ params }: RefundPageProps) {
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
            Refund Policy
          </h1>
          <p className="text-xl text-muted-foreground">
            Last Updated: {lastUpdated}
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Introduction */}
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="text-2xl gradient-text">1. Refund Policy Overview</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none dark:prose-invert">
              <p>
                At TransleXable, we strive to provide excellent translation services. This Refund Policy outlines the circumstances under which refunds may be requested and the process for obtaining them.
              </p>
            </CardContent>
          </Card>

          {/* Refund Eligibility */}
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="text-2xl gradient-text">2. Refund Eligibility</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none dark:prose-invert">
              <h3 className="text-xl font-semibold mb-3">Eligible for Refunds:</h3>
              <ul>
                <li>Service failures due to technical issues on our end</li>
                <li>Billing errors or duplicate charges</li>
                <li>Cancellation within 24 hours of purchase (for subscription services)</li>
                <li>Significant quality issues with our AI translation services</li>
              </ul>
              
              <h3 className="text-xl font-semibold mb-3 mt-6">Not Eligible for Refunds:</h3>
              <ul>
                <li>Successful completion of translation services</li>
                <li>User error or misunderstanding of service features</li>
                <li>Dissatisfaction with translation results that meet quality standards</li>
                <li>Requests made more than 30 days after service completion</li>
              </ul>
            </CardContent>
          </Card>

          {/* Subscription Refunds */}
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="text-2xl gradient-text">3. Subscription Services</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none dark:prose-invert">
              <h3 className="text-xl font-semibold mb-3">Monthly Subscriptions:</h3>
              <ul>
                <li>Full refund available within 24 hours of initial purchase</li>
                <li>Pro-rated refunds may be considered for service failures</li>
                <li>Cancellation takes effect at the end of the current billing period</li>
              </ul>
              
              <h3 className="text-xl font-semibold mb-3 mt-6">Annual Subscriptions:</h3>
              <ul>
                <li>Full refund available within 7 days of purchase</li>
                <li>Pro-rated refunds for unused months in case of service failures</li>
                <li>Significant discount benefits are considered in refund calculations</li>
              </ul>
            </CardContent>
          </Card>

          {/* Pay-Per-Use Services */}
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="text-2xl gradient-text">4. Pay-Per-Use Services</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none dark:prose-invert">
              <p>For individual translation requests:</p>
              <ul>
                <li>Full refund if the service fails to complete the translation</li>
                <li>Partial refund for significantly poor translation quality</li>
                <li>No refund for successful translations that don't meet personal expectations</li>
                <li>Credit may be provided for future services in lieu of cash refunds</li>
              </ul>
            </CardContent>
          </Card>

          {/* Refund Process */}
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="text-2xl gradient-text">5. How to Request a Refund</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none dark:prose-invert">
              <h3 className="text-xl font-semibold mb-3">Step 1: Contact Support</h3>
              <p>Email us at support@translexable.com with the following information:</p>
              <ul>
                <li>Your account email address</li>
                <li>Transaction ID or payment reference</li>
                <li>Detailed reason for the refund request</li>
                <li>Supporting documentation (if applicable)</li>
              </ul>
              
              <h3 className="text-xl font-semibold mb-3 mt-6">Step 2: Review Process</h3>
              <ul>
                <li>We will acknowledge your request within 24 hours</li>
                <li>Our team will review your case within 3-5 business days</li>
                <li>Additional information may be requested</li>
              </ul>
              
              <h3 className="text-xl font-semibold mb-3 mt-6">Step 3: Resolution</h3>
              <ul>
                <li>Approved refunds are processed within 5-10 business days</li>
                <li>Refunds are issued to the original payment method</li>
                <li>You will receive confirmation of the refund status</li>
              </ul>
            </CardContent>
          </Card>

          {/* Processing Times */}
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="text-2xl gradient-text">6. Refund Processing Times</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none dark:prose-invert">
              <ul>
                <li><strong>Credit Cards:</strong> 5-10 business days</li>
                <li><strong>PayPal:</strong> 3-5 business days</li>
                <li><strong>Bank Transfers:</strong> 7-14 business days</li>
                <li><strong>Digital Wallets:</strong> 1-3 business days</li>
              </ul>
              <p className="mt-4">
                <em>Note: Processing times may vary depending on your financial institution and payment method.</em>
              </p>
            </CardContent>
          </Card>

          {/* Disputes */}
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="text-2xl gradient-text">7. Chargebacks and Disputes</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none dark:prose-invert">
              <p>
                We encourage you to contact us directly before initiating a chargeback with your bank or credit card company. Most issues can be resolved quickly through our support team, avoiding the lengthy dispute process.
              </p>
              <p>
                Chargebacks may result in account suspension until the matter is resolved.
              </p>
            </CardContent>
          </Card>

          {/* Exceptions */}
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="text-2xl gradient-text">8. Special Circumstances</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none dark:prose-invert">
              <h3 className="text-xl font-semibold mb-3">Service Credits:</h3>
              <p>
                In some cases, we may offer service credits instead of cash refunds. These credits can be used for future translations and do not expire for 12 months.
              </p>
              
              <h3 className="text-xl font-semibold mb-3 mt-6">Exceptional Cases:</h3>
              <p>
                We reserve the right to make exceptions to this policy in extraordinary circumstances, such as prolonged service outages or system failures.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="text-2xl gradient-text">9. Contact Support</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none dark:prose-invert">
              <p>
                For refund requests or questions about this policy:
                <br />
                <strong>Email:</strong> support@translexable.com
                <br />
                <strong>Subject Line:</strong> "Refund Request - [Your Transaction ID]"
                <br />
                <strong>Response Time:</strong> Within 24 hours
              </p>
            </CardContent>
          </Card>

          {/* Policy Updates */}
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="text-2xl gradient-text">10. Policy Updates</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none dark:prose-invert">
              <p>
                This Refund Policy may be updated from time to time. Material changes will be communicated via email to registered users. Continued use of our services constitutes acceptance of the updated policy.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 