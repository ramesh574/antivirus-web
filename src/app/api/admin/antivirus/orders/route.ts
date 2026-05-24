import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import AVOrder from '@/lib/models/AVOrder';

function generateOrderID(): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `AV-${dateStr}-${random}`;
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = await request.nextUrl;
    const status = searchParams.get('status');
    const filter: Record<string, unknown> = {};
    if (status) filter.orderStatus = status;

    const orders = await AVOrder.find(filter).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: orders });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { customerName, customerPhone, customerEmail, antivirusType, price, paymentMethod } = body;

    if (!customerName || !customerPhone || !customerEmail || !antivirusType || price === undefined) {
      return NextResponse.json(
        { success: false, error: 'customerName, customerPhone, customerEmail, antivirusType, and price are required' },
        { status: 400 }
      );
    }

    const order = await AVOrder.create({
      orderIDP: generateOrderID(),
      customerName,
      customerPhone,
      customerEmail,
      antivirusType,
      price,
      paymentMethod: paymentMethod || 'pending',
      paymentStatus: 'pending',
      orderStatus: 'pending',
    });
    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to create order' }, { status: 500 });
  }
}
