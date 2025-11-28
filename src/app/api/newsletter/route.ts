import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email }
    });

    if (existing) {
      if (!existing.isActive) {
        // Reactivate if they previously unsubscribed
        await prisma.newsletterSubscriber.update({
          where: { email },
          data: { isActive: true }
        });
        return NextResponse.json({ message: "Welcome back!" });
      }
      return NextResponse.json({ message: "You are already subscribed." });
    }

    await prisma.newsletterSubscriber.create({
      data: { email }
    });

    return NextResponse.json({ success: true, message: "Successfully subscribed!" });
  } catch (error) {
    console.error('Newsletter subscription failed:', error);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}



