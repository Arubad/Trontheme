import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    platform: 'STRIVER A2Z',
    widgetType: 'striver-a2z',
    stats: [
      { label: 'PROGRESS', value: '72%' },
      { label: 'MODULES', value: '20 / 28' },
      { label: 'SOLVED', value: '406 / 563' },
      { label: 'STREAK', value: '48 DAYS' },
    ],
    summary: {
      solvedProblems: 406,
      totalProblems: 563,
      solvedModules: 20,
      totalModules: 28,
      weeklyTarget: 35,
      currentWeekSolved: 22,
      currentTrack: 'Dynamic Programming',
      currentTrackProgress: 61,
    },
    tracks: [
      { name: 'Arrays', solved: 35, total: 35, status: 'complete' },
      { name: 'Strings', solved: 43, total: 44, status: 'in-progress' },
      { name: 'Linked List', solved: 31, total: 31, status: 'complete' },
      { name: 'Binary Search', solved: 32, total: 32, status: 'complete' },
      { name: 'Trees', solved: 38, total: 43, status: 'in-progress' },
      { name: 'Graphs', solved: 44, total: 54, status: 'in-progress' },
      {
        name: 'Dynamic Programming',
        solved: 34,
        total: 56,
        status: 'in-progress',
      },
      { name: 'Advanced', solved: 149, total: 268, status: 'in-progress' },
    ],
    milestones: [
      { label: 'NEXT MILESTONE', value: '450 SOLVED', eta: 'EST 2 WEEKS' },
      {
        label: 'CONTEST GOAL',
        value: '2 MOCK INTERVIEWS / WEEK',
        eta: 'ACTIVE',
      },
      { label: 'REVISION', value: 'A2Z ROUND-2 IN 30 DAYS', eta: 'QUEUED' },
    ],
    note: 'Structured DSA roadmap from foundations to interview-grade advanced patterns.',
  })
}
