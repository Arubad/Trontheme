import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const username = 'Arubad'
    const headers = {
      'User-Agent': 'portfolio-site',
      Accept: 'application/vnd.github+json',
    }

    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, {
        headers,
        cache: 'no-store',
      }),
      fetch(
        `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
        { headers, cache: 'no-store' },
      ),
    ])

    const user = await userRes.json()
    const repos = await reposRes.json()

    const totalStars = Array.isArray(repos)
      ? repos.reduce((acc, r) => acc + (r.stargazers_count || 0), 0)
      : 0

    const topRepos = Array.isArray(repos)
      ? repos
          .filter((r) => !r.fork)
          .sort((a, b) => b.stargazers_count - a.stargazers_count)
          .slice(0, 4)
          .map((r) => ({
            name: r.name,
            stars: r.stargazers_count,
            lang: r.language || 'N/A',
          }))
      : []

    return NextResponse.json({
      platform: 'GITHUB',
      username,
      stats: [
        { label: 'PUBLIC REPOS', value: String(user.public_repos ?? '—') },
        { label: 'TOTAL STARS', value: String(totalStars) },
        { label: 'FOLLOWERS', value: String(user.followers ?? '—') },
        { label: 'FOLLOWING', value: String(user.following ?? '—') },
      ],
      topRepos,
    })
  } catch {
    return NextResponse.json({ error: true }, { status: 500 })
  }
}
