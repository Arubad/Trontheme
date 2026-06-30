import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    platform: 'NEETCODE 150',
    widgetType: 'neetcode-150',
    stats: [
      { label: 'SOLVED', value: '124' },
      { label: 'CATEGORIES', value: '12 / 18' },
      { label: 'TOTAL', value: '150' },
      { label: 'STREAK', value: '31 DAYS' },
    ],
    summary: {
      solvedProblems: 124,
      totalProblems: 150,
      solvedCategories: 12,
      totalCategories: 18,
      revisionQueue: 26,
      weeklyTarget: 18,
      currentWeekSolved: 11,
      strongestArea: 'Trees & BST',
      strongestAreaProgress: 92,
    },
    categories: [
      { name: 'Arrays & Hashing', solved: 9, total: 9, status: 'complete' },
      { name: 'Two Pointers', solved: 5, total: 5, status: 'complete' },
      { name: 'Stack', solved: 7, total: 7, status: 'complete' },
      { name: 'Binary Search', solved: 6, total: 7, status: 'in-progress' },
      { name: 'Trees', solved: 14, total: 15, status: 'in-progress' },
      {
        name: 'Heap / Priority Queue',
        solved: 8,
        total: 9,
        status: 'in-progress',
      },
      { name: 'Backtracking', solved: 8, total: 9, status: 'in-progress' },
      { name: '1-D DP', solved: 10, total: 12, status: 'in-progress' },
      { name: '2-D DP', solved: 8, total: 11, status: 'in-progress' },
      { name: 'Graphs', solved: 9, total: 13, status: 'in-progress' },
    ],
    milestones: [
      { label: 'NEXT CHECKPOINT', value: '130 / 150', eta: 'EST 6 DAYS' },
      { label: 'MOCK INTERVIEWS', value: '3 THIS MONTH', eta: 'SCHEDULED' },
      { label: 'REVISION ROUND', value: 'BLIND 75 RECAP', eta: 'IN QUEUE' },
    ],
    note: 'Curated FAANG interview prep: Arrays, Two Pointers, Sliding Window, Trees, Graphs, DP, Backtracking.',
  })
}
