import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import AntiVirusType from '@/lib/models/AntiVirusType';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    const types = await AntiVirusType.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: types });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch antivirus types' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { antivirustypeIDP, isActive } = body;

    if (!antivirustypeIDP) {
      return NextResponse.json({ success: false, error: 'antivirustypeIDP is required' }, { status: 400 });
    }

    const type = await AntiVirusType.create({ antivirustypeIDP, isActive: isActive ?? true });
    return NextResponse.json({ success: true, data: type }, { status: 201 });
  } catch (e) {
    const err = e as { code?: number };
    if (err.code === 11000) {
      return NextResponse.json({ success: false, error: 'Antivirus type already exists' }, { status: 409 });
    }
    return NextResponse.json({ success: false, error: 'Failed to create antivirus type' }, { status: 500 });
  }
}
