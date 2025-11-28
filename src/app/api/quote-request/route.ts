import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // In production, this would send an email via SendGrid/Resend
    // For now, we'll just log it and store in a simple JSON file or database
    
    console.log('📧 NEW QUOTE REQUEST:', {
      customer: body.name,
      email: body.email,
      company: body.company,
      phone: body.phone,
      product: body.productName,
      quantity: body.quantity,
      message: body.message,
      timestamp: new Date().toISOString()
    });

    // TODO: Send email notification
    // await sendEmail({
    //   to: 'sales@eustone.nl',
    //   subject: `Quote Request: ${body.productName}`,
    //   html: `...`
    // });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Quote request failed:', error);
    return NextResponse.json({ error: "Failed to submit quote request" }, { status: 500 });
  }
}



