import { NextResponse } from 'next/server';

export async function GET() {
  const config = {
    api_key: process.env.PAYMOB_API_KEY ? 'Set' : 'Not set',
    integration_id: process.env.PAYMOB_INTEGRATION_ID ? 'Set' : 'Not set',
    iframe_id: process.env.PAYMOB_IFRAME_ID ? 'Set' : 'Not set',
    hmac_key: process.env.PAYMOB_HMAC_KEY ? 'Set' : 'Not set',
    base_url: process.env.PAYMOB_BASE_URL || 'Using default',
  };

  const isConfigured = Object.values(config).every(value => value !== 'Not set');

  return NextResponse.json({
    configured: isConfigured,
    config,
    webhook_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/paymob/webhook`,
    ngrok_webhook_url: process.env.NGROK_URL ? `${process.env.NGROK_URL}/api/paymob/webhook` : 'https://6bted074fdaa.ngrok-free.app/api/paymob/webhook',
  });
} 