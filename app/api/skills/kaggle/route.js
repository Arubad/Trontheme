import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    platform: 'KAGGLE',
    username: 'arushbadhe',
    stats: [
      { label: 'NOTEBOOKS',    value: '10+' },
      { label: 'TIER',         value: 'CONTRIBUTOR' },
      { label: 'COMPETITIONS', value: '5+' },
      { label: 'DATASETS',     value: '3+' },
    ],
    desc: 'Data science notebooks, competitions & datasets. Focused on ML & CV challenges.',
  });
}
