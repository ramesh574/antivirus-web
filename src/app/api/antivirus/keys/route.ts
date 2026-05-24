import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import AntiVirusKey from '@/lib/models/AntiVirusKey';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = await request.nextUrl;
    const typeIDF = searchParams.get('antivirustypeIDF');
    const isActive = searchParams.get('isActive');
    const isIssue = searchParams.get('isIssue');

    const filter: Record<string, unknown> = {};
    if (typeIDF) filter.antivirustypeIDF = typeIDF;
    if (isActive !== null) filter.isActive = isActive === 'true';
    if (isIssue !== null) filter.isIssue = isIssue === 'true';

    const keys = await AntiVirusKey.find(filter).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: keys });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch antivirus keys' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { antivirustypeIDF, key, isActive, isIssue, orderIDF, expiryDate, validityInMonths } = body;

    if (!antivirustypeIDF || !key || !expiryDate || !validityInMonths) {
      return NextResponse.json(
        { success: false, error: 'antivirustypeIDF, key, expiryDate, and validityInMonths are required' },
        { status: 400 }
      );
    }

    const avKey = await AntiVirusKey.create({
      antivirustypeIDF,
      key,
      isActive: isActive ?? true,
      isIssue: isIssue ?? false,
      orderIDF: orderIDF ?? '',
      expiryDate: new Date(expiryDate),
      validityInMonths,
    });
    return NextResponse.json({ success: true, data: avKey }, { status: 201 });
  } catch (e) {
    const err = e as { code?: number };
    if (err.code === 11000) {
      return NextResponse.json({ success: false, error: 'Antivirus key already exists' }, { status: 409 });
    }
    return NextResponse.json({ success: false, error: 'Failed to create antivirus key' }, { status: 500 });
  }
}
