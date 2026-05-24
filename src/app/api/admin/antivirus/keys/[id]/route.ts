import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import AntiVirusKey from '@/lib/models/AntiVirusKey';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const key = await AntiVirusKey.findById(id);
    if (!key) {
      return NextResponse.json({ success: false, error: 'Antivirus key not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: key });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch antivirus key' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    if (body.expiryDate) {
      body.expiryDate = new Date(body.expiryDate);
    }
    const avKey = await AntiVirusKey.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!avKey) {
      return NextResponse.json({ success: false, error: 'Antivirus key not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: avKey });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to update antivirus key' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const avKey = await AntiVirusKey.findByIdAndDelete(id);
    if (!avKey) {
      return NextResponse.json({ success: false, error: 'Antivirus key not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: avKey });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to delete antivirus key' }, { status: 500 });
  }
}
