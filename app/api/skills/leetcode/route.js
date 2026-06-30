import { NextResponse } from 'next/server';

const USERNAME = 'YXdB8UMU0q';

export async function GET() {
  try {
    const query = `query($u:String!){matchedUser(username:$u){username submitStatsGlobal{acSubmissionNum{difficulty count}} profile{ranking}}}`;
    const res   = await fetch('https://leetcode.com/graphql', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', Referer: 'https://leetcode.com' },
      body:    JSON.stringify({ query, variables: { u: USERNAME } }),
    });
    const data = await res.json();
    const user = data?.data?.matchedUser;
    if (!user) throw new Error('no user');

    const subs    = user.submitStatsGlobal?.acSubmissionNum || [];
    const get     = (d) => subs.find((s) => s.difficulty === d)?.count ?? '—';

    return NextResponse.json({
      platform: 'LEETCODE',
      username: user.username,
      stats: [
        { label: 'TOTAL SOLVED', value: String(get('All'))    },
        { label: 'EASY',         value: String(get('Easy'))   },
        { label: 'MEDIUM',       value: String(get('Medium')) },
        { label: 'HARD',         value: String(get('Hard'))   },
        { label: 'GLOBAL RANK',  value: user.profile?.ranking ? `#${Number(user.profile.ranking).toLocaleString()}` : '—' },
      ],
    });
  } catch {
    return NextResponse.json({
      platform: 'LEETCODE',
      username: USERNAME,
      stats: [
        { label: 'TOTAL SOLVED', value: '500+' },
        { label: 'EASY',         value: '150+' },
        { label: 'MEDIUM',       value: '280+' },
        { label: 'HARD',         value: '70+'  },
      ],
      fallback: true,
    });
  }
}
