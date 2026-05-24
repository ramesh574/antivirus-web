import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import AntiVirusType from '@/lib/models/AntiVirusType';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const type = await AntiVirusType.findById(id);
    if (!type) {
      return NextResponse.json({ success: false, error: 'Antivirus type not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: type });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch antivirus type' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    const type = await AntiVirusType.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!type) {
      return NextResponse.json({ success: false, error: 'Antivirus type not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: type });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to update antivirus type' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const type = await AntiVirusType.findByIdAndDelete(id);
    if (!type) {
      return NextResponse.json({ success: false, error: 'Antivirus type not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: type });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to delete antivirus type' }, { status: 500 });
  }
}
