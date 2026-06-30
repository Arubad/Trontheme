import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export async function GET() {
  try {
    const contentsDir = path.join(process.cwd(), 'contents');

    if (!fs.existsSync(contentsDir)) {
      return NextResponse.json({ logs: [] });
    }

    const files = fs
      .readdirSync(contentsDir)
      .filter((f) => f.endsWith('.md'));

    const logs = files
      .map((filename) => {
        const slug = filename.replace(/\.md$/, '');
        const raw = fs.readFileSync(path.join(contentsDir, filename), 'utf-8');
        const { data } = matter(raw);
        return {
          slug,
          title: data.title || slug,
          date:  data.date  || '',
          tags:  Array.isArray(data.tags) ? data.tags : [],
        };
      })
      .sort((a, b) => String(b.date).localeCompare(String(a.date)));

    return NextResponse.json({ logs });
  } catch (err) {
    console.error('Logs API error:', err);
    return NextResponse.json({ logs: [] });
  }
}
