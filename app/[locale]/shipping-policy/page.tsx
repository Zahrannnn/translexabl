import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDictionary } from '../dictionaries';
import { Metadata } from 'next';

interface ShippingPageProps {
  params: Promise<{ locale: 'en' | 'fr' | 'ar' }>;
}

export async function generateMetadata({ params }: ShippingPageProps): Promise<Metadata> {
  const { locale } = await params;
  const messages = await getDictionary(locale);
  
  return {
    title: messages.shippingPolicy?.pageTitle || "Shipping Policy | TransleXable",
    description: messages.shippingPolicy?.metaDescription || "Learn about TransleXable's digital delivery and service provision policy.",
  };
}

// Manual translation function
function getTranslation(messages: Record<string, unknown>, path: string): string {
  const result = path.split('.').reduce<unknown>((obj, key) => {
    return obj && typeof obj === 'object' && key in obj ? (obj as Record<string, unknown>)[key] : undefined;
  }, messages);
  return typeof result === 'string' ? result : path;
}

export default async function ShippingPolicyPage({ params }: ShippingPageProps) {
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
            Shipping Policy
          </h1>
         
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Introduction */}
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="text-2xl gradient-text">1. Digital Service Delivery</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none dark:prose-invert">
              <p>
                TransleXable provides digital translation services. As we offer digital products and services, there is no physical shipping involved. This policy explains how our digital services are delivered to you.
              </p>
            </CardContent>
          </Card>

          {/* Service Delivery Methods */}
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="text-2xl gradient-text">2. How Services Are Delivered</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none dark:prose-invert">
              <h3 className="text-xl font-semibold mb-3">Instant Access Services:</h3>
              <ul>
                <li>Account access is granted immediately upon successful registration</li>
                <li>Subscription features are activated instantly after payment confirmation</li>
                <li>API access is provided within minutes of account verification</li>
              </ul>
              
              <h3 className="text-xl font-semibold mb-3 mt-6">Translation Results:</h3>
              <ul>
                <li>Text translations are delivered instantly through our web interface</li>
                <li>Document translations are processed and made available for download</li>
                <li>Large files may take several minutes depending on size and complexity</li>
                <li>Translation history is accessible through your account dashboard</li>
              </ul>
            </CardContent>
          </Card>

          {/* Delivery Timeframes */}
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="text-2xl gradient-text">3. Delivery Timeframes</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none dark:prose-invert">
              <h3 className="text-xl font-semibold mb-3">Text Translation:</h3>
              <ul>
                <li>Short texts (up to 1,000 characters): Instant</li>
                <li>Medium texts (1,000-10,000 characters): 1-5 seconds</li>
                <li>Long texts (10,000+ characters): 5-30 seconds</li>
              </ul>
              
              <h3 className="text-xl font-semibold mb-3 mt-6">Document Translation:</h3>
              <ul>
                <li>PDF files (up to 50 pages): 2-10 minutes</li>
                <li>DOCX files: 1-5 minutes</li>
                <li>PowerPoint presentations: 3-15 minutes</li>
                <li>SRT subtitle files: 1-3 minutes</li>
              </ul>
              
              <h3 className="text-xl font-semibold mb-3 mt-6">Account Services:</h3>
              <ul>
                <li>Account activation: Immediate</li>
                <li>Email verification: Instant (check spam folder)</li>
                <li>Password resets: Within 5 minutes</li>
                <li>Subscription activation: Immediate after payment</li>
              </ul>
            </CardContent>
          </Card>

          {/* Download and Access */}
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="text-2xl gradient-text">4. Downloading Your Translations</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none dark:prose-invert">
              <h3 className="text-xl font-semibold mb-3">Available Formats:</h3>
              <ul>
                <li>Original format preserved (PDF, DOCX, PPTX, SRT)</li>
                <li>Additional export options (TXT, HTML where applicable)</li>
                <li>High-quality formatting and layout preservation</li>
              </ul>
              
              <h3 className="text-xl font-semibold mb-3 mt-6">Download Instructions:</h3>
              <ul>
                <li>Access your completed translations through the dashboard</li>
                <li>Click the download button next to your translated document</li>
                <li>Files remain available for download for 30 days</li>
                <li>Premium users get extended storage for 90 days</li>
              </ul>
            </CardContent>
          </Card>

          {/* Service Availability */}
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="text-2xl gradient-text">5. Service Availability</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none dark:prose-invert">
              <h3 className="text-xl font-semibold mb-3">24/7 Availability:</h3>
              <ul>
                <li>Our translation services are available 24 hours a day, 7 days a week</li>
                <li>No geographical restrictions for service delivery</li>
                <li>Accessible from any device with internet connection</li>
              </ul>
              
              <h3 className="text-xl font-semibold mb-3 mt-6">Planned Maintenance:</h3>
              <ul>
                <li>Scheduled maintenance windows are announced 48 hours in advance</li>
                <li>Maintenance typically occurs during low-usage periods</li>
                <li>Emergency maintenance may occur with minimal notice</li>
              </ul>
            </CardContent>
          </Card>

          {/* Technical Requirements */}
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="text-2xl gradient-text">6. Technical Requirements</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none dark:prose-invert">
              <h3 className="text-xl font-semibold mb-3">System Requirements:</h3>
              <ul>
                <li>Stable internet connection (minimum 1 Mbps recommended)</li>
                <li>Modern web browser (Chrome, Firefox, Safari, Edge)</li>
                <li>JavaScript enabled</li>
                <li>Cookies enabled for account functionality</li>
              </ul>
              
              <h3 className="text-xl font-semibold mb-3 mt-6">File Size Limits:</h3>
              <ul>
                <li>Text input: Up to 100,000 characters per request</li>
                <li>Document files: Maximum 50MB per file</li>
                <li>Multiple files: Up to 10 files per batch upload</li>
              </ul>
            </CardContent>
          </Card>

          {/* Delivery Issues */}
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="text-2xl gradient-text">7. Delivery Issues and Support</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none dark:prose-invert">
              <h3 className="text-xl font-semibold mb-3">Common Issues:</h3>
              <ul>
                <li>Slow processing times during peak usage</li>
                <li>Browser compatibility issues</li>
                <li>Network connectivity problems</li>
                <li>File format compatibility issues</li>
              </ul>
              
              <h3 className="text-xl font-semibold mb-3 mt-6">Getting Help:</h3>
              <ul>
                <li>Check our FAQ section for quick solutions</li>
                <li>Contact support via email: support@translexable.com</li>
                <li>Live chat support for premium users</li>
                <li>Response time: Within 24 hours</li>
              </ul>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="text-2xl gradient-text">8. Secure Delivery</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none dark:prose-invert">
              <p>All digital deliveries are secured with:</p>
              <ul>
                <li>SSL/TLS encryption for all data transmission</li>
                <li>Secure authentication for account access</li>
                <li>Encrypted storage of translated documents</li>
                <li>Regular security audits and monitoring</li>
                <li>Secure download links with expiration dates</li>
              </ul>
            </CardContent>
          </Card>

          {/* International Service */}
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="text-2xl gradient-text">9. Global Service Delivery</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none dark:prose-invert">
              <p>
                Our digital services are available worldwide with no additional delivery charges. Service quality and speed are consistent across all regions, though local internet infrastructure may affect individual user experience.
              </p>
              
              <h3 className="text-xl font-semibold mb-3 mt-6">Regional Considerations:</h3>
              <ul>
                <li>Services comply with local data protection regulations</li>
                <li>Multiple language interface options available</li>
                <li>Currency conversion handled automatically</li>
                <li>Local payment methods supported where available</li>
              </ul>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="text-2xl gradient-text">10. Support Contact</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none dark:prose-invert">
              <p>
                For questions about service delivery or technical issues:
                <br />
                <strong>Email:</strong> support@translexable.com
                <br />
                <strong>Response Time:</strong> Within 24 hours
                <br />
                <strong>Emergency Support:</strong> Available for enterprise customers
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 