'use server'

import { getWeekParticipation } from '@/lib/participation'

export async function getWeekData(weekOffset: number) {
  try {
    const weekData = await getWeekParticipation(weekOffset)
    return { success: true, data: weekData }
  } catch (error) {
    console.error('Error fetching week data:', error)
    return { success: false, error: 'Failed to fetch week data' }
  }
}