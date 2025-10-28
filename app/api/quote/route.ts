import { NextRequest, NextResponse } from 'next/server';
import { sendQuoteEmail } from '@/lib/email/nodemailer';
import { QuoteRequest } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body: QuoteRequest = await request.json();

    // 验证必需字段
    if (!body.customerName || !body.email || !body.products || body.products.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 发送邮件
    await sendQuoteEmail(body);

    return NextResponse.json(
      { message: 'Quote request sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending quote:', error);
    return NextResponse.json(
      { error: 'Failed to send quote request' },
      { status: 500 }
    );
  }
}
