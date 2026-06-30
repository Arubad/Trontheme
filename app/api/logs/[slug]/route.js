import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export async function GET(_request, { params }) {
  try {
    const { slug } = params;

    // Basic path traversal guard
    if (!slug || slug.includes('..') || slug.includes('/')) {
      return NextResponse.json({ error: 'Invalid slug' }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'contents', `${slug}.md`);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(raw);

    return NextResponse.json({
      slug,
      title:   data.title || slug,
      date:    data.date  || '',
      tags:    Array.isArray(data.tags) ? data.tags : [],
      content,
    });
  } catch (err) {
    console.error('Log detail API error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
