'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-utils'

export async function createParticipation(courseSessionId: string, participated: boolean, quality: number, note?: string) {
  const user = await requireAuth()
  
  if (quality < 0 || quality > 3) {
    throw new Error('Quality must be between 0 and 3')
  }

  try {
    const participation = await prisma.participation.upsert({
      where: {
        userId_courseSessionId: {
          userId: user.id,
          courseSessionId: courseSessionId
        }
      },
      update: {
        participated,
        quality,
        note: note || null,
        updatedAt: new Date()
      },
      create: {
        userId: user.id,
        courseSessionId: courseSessionId,
        participated,
        quality,
        note: note || null
      },
      include: {
        courseSession: {
          include: {
            course: true
          }
        }
      }
    })

    revalidatePath('/dashboard')
    revalidatePath('/history')
    return { success: true, participation }
  } catch (error) {
    console.error('Error creating/updating participation:', error)
    throw new Error('Failed to save participation')
  }
}

export async function updateParticipation(participationId: string, participated: boolean, quality: number, note?: string) {
  const user = await requireAuth()
  
  if (quality < 0 || quality > 3) {
    throw new Error('Quality must be between 0 and 3')
  }

  const existingParticipation = await prisma.participation.findUnique({
    where: { id: participationId }
  })

  if (!existingParticipation || existingParticipation.userId !== user.id) {
    throw new Error('Unauthorized: Cannot update this participation record')
  }

  try {
    const participation = await prisma.participation.update({
      where: { id: participationId },
      data: {
        participated,
        quality,
        note: note || null,
        updatedAt: new Date()
      },
      include: {
        courseSession: {
          include: {
            course: true
          }
        }
      }
    })

    revalidatePath('/dashboard')
    revalidatePath('/history')
    return { success: true, participation }
  } catch (error) {
    console.error('Error updating participation:', error)
    throw new Error('Failed to update participation')
  }
}

export async function deleteParticipation(participationId: string) {
  const user = await requireAuth()

  const existingParticipation = await prisma.participation.findUnique({
    where: { id: participationId }
  })

  if (!existingParticipation || existingParticipation.userId !== user.id) {
    throw new Error('Unauthorized: Cannot delete this participation record')
  }

  try {
    await prisma.participation.delete({
      where: { id: participationId }
    })

    revalidatePath('/dashboard')
    revalidatePath('/history')
    return { success: true }
  } catch (error) {
    console.error('Error deleting participation:', error)
    throw new Error('Failed to delete participation')
  }
}