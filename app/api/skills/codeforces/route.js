import { NextResponse } from 'next/server';

const HANDLE = 'arushbadhe';

export async function GET() {
  try {
    const [infoRes, ratingRes] = await Promise.all([
      fetch(`https://codeforces.com/api/user.info?handles=${HANDLE}`),
      fetch(`https://codeforces.com/api/user.rating?handle=${HANDLE}`),
    ]);
    const info   = await infoRes.json();
    const rating = await ratingRes.json();
    if (info.status !== 'OK') throw new Error('CF error');

    const user         = info.result[0];
    const contestCount = rating.status === 'OK' ? rating.result.length : '—';

    return NextResponse.json({
      platform: 'CODEFORCES',
      username: user.handle,
      stats: [
        { label: 'RATING',    value: String(user.rating    ?? '—') },
        { label: 'MAX RATING',value: String(user.maxRating ?? '—') },
        { label: 'RANK',      value: (user.rank    ?? '—').toUpperCase() },
        { label: 'MAX RANK',  value: (user.maxRank ?? '—').toUpperCase() },
        { label: 'CONTESTS',  value: String(contestCount) },
      ],
    });
  } catch {
    return NextResponse.json({
      platform: 'CODEFORCES',
      username: HANDLE,
      stats: [
        { label: 'RATING',   value: '1400+' },
        { label: 'MAX RATING', value: '1400+' },
        { label: 'RANK',     value: 'SPECIALIST' },
      ],
      fallback: true,
    });
  }
}
