import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', '3k_local_copy.tsv');
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'TSV file not found in repository.' }, { status: 404 });
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    return new NextResponse(fileContent, {
      status: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}