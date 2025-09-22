import { prisma } from './prisma'
import { requireAuth } from './auth-utils'

export async function getTodaysParticipation() {
  const user = await requireAuth()
  const today = new Date()
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)

  const sessions = await prisma.courseSession.findMany({
    where: {
      startAt: {
        gte: startOfDay,
        lt: endOfDay
      }
    },
    include: {
      course: true,
      participation: {
        where: {
          userId: user.id
        }
      }
    },
    orderBy: {
      startAt: 'asc'
    }
  })

  return sessions.map(session => ({
    id: session.id,
    courseName: session.course.name,
    case: session.case,
    startAt: session.startAt,
    endAt: session.endAt,
    participation: session.participation[0] || null
  }))
}

export async function getUserParticipation(userId: string, courseSessionId: string) {
  const user = await requireAuth()
  
  if (user.id !== userId) {
    throw new Error('Unauthorized: Cannot access another user\'s participation data')
  }

  const participation = await prisma.participation.findUnique({
    where: {
      userId_courseSessionId: {
        userId,
        courseSessionId
      }
    },
    include: {
      courseSession: {
        include: {
          course: true
        }
      }
    }
  })

  return participation
}

export async function verifyParticipationAccess(participationId: string) {
  const user = await requireAuth()
  
  const participation = await prisma.participation.findUnique({
    where: { id: participationId }
  })

  if (!participation || participation.userId !== user.id) {
    throw new Error('Unauthorized: Cannot access this participation record')
  }

  return participation
}

export async function getWeekParticipation(weekOffset: number = 0) {
  const user = await requireAuth()
  
  const today = new Date()
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - today.getDay() + (weekOffset * 7))
  startOfWeek.setHours(0, 0, 0, 0)
  
  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 6)
  endOfWeek.setHours(23, 59, 59, 999)

  const sessions = await prisma.courseSession.findMany({
    where: {
      startAt: {
        gte: startOfWeek,
        lte: endOfWeek
      }
    },
    include: {
      course: true,
      participation: {
        where: {
          userId: user.id
        }
      }
    },
    orderBy: {
      startAt: 'desc'
    }
  })

  return {
    weekStart: startOfWeek,
    weekEnd: endOfWeek,
    sessions: sessions.map(session => ({
      id: session.id,
      courseName: session.course.name,
      case: session.case,
      startAt: session.startAt,
      endAt: session.endAt,
      participation: session.participation[0] || null
    }))
  }
}

// Get course tracking data for history page top cards
export async function getCourseTrackingData() {
  const user = await requireAuth()
  
  // Get all courses with their latest session and participation data
  const courses = await prisma.course.findMany({
    include: {
      sessions: {
        where: {
          startAt: {
            lt: new Date() // Only past sessions
          }
        },
        include: {
          participation: {
            where: {
              userId: user.id
            }
          }
        },
        orderBy: {
          startAt: 'desc'
        }
      }
    }
  })

  const courseTrackings = courses.map(course => {
    const sessions = course.sessions
    if (sessions.length === 0) {
      return {
        courseName: course.name,
        sessionsSinceLastParticipation: 0,
        lastParticipationDate: null,
        lastQuality: null,
        status: 'good' as const
      }
    }

    // Find the most recent participation
    let lastParticipationIndex = -1
    let lastParticipation = null
    
    for (let i = 0; i < sessions.length; i++) {
      const participation = sessions[i].participation[0]
      if (participation && participation.participated) {
        lastParticipationIndex = i
        lastParticipation = participation
        break
      }
    }

    const sessionsSinceLastParticipation = lastParticipationIndex === -1 
      ? sessions.length 
      : lastParticipationIndex

    // Determine status based on sessions since last participation
    let status: 'excellent' | 'good' | 'attention' | 'critical'
    if (sessionsSinceLastParticipation === 0) {
      status = 'excellent'
    } else if (sessionsSinceLastParticipation <= 1) {
      status = 'good'
    } else if (sessionsSinceLastParticipation <= 2) {
      status = 'attention'
    } else {
      status = 'critical'
    }

    return {
      courseName: course.name,
      sessionsSinceLastParticipation,
      lastParticipationDate: lastParticipation?.createdAt || null,
      lastQuality: lastParticipation?.quality || null,
      status
    }
  })

  // Sort by status priority (critical first) then by sessions since participation
  const statusPriority = { critical: 0, attention: 1, good: 2, excellent: 3 }
  courseTrackings.sort((a, b) => {
    const priorityDiff = statusPriority[a.status] - statusPriority[b.status]
    if (priorityDiff !== 0) return priorityDiff
    return b.sessionsSinceLastParticipation - a.sessionsSinceLastParticipation
  })

  return courseTrackings
}

// Get paginated history data for infinite scroll
export async function getHistoryPageData(cursor?: Date, limit: number = 20) {
  const user = await requireAuth()
  
  const sessions = await prisma.courseSession.findMany({
    where: {
      startAt: {
        lt: cursor || new Date() // Before cursor or now
      }
    },
    include: {
      course: true,
      participation: {
        where: {
          userId: user.id
        }
      }
    },
    orderBy: {
      startAt: 'desc'
    },
    take: limit + 1 // Take one extra to check if there are more
  })

  const hasMore = sessions.length > limit
  const sessionData = hasMore ? sessions.slice(0, limit) : sessions

  // Group sessions by date
  const groupedSessions: { [date: string]: any[] } = {}
  
  sessionData.forEach(session => {
    const dateKey = session.startAt.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    })
    
    if (!groupedSessions[dateKey]) {
      groupedSessions[dateKey] = []
    }
    
    groupedSessions[dateKey].push({
      id: session.id,
      courseName: session.course.name,
      case: session.case,
      startAt: session.startAt,
      endAt: session.endAt,
      participation: session.participation[0] || null
    })
  })

  // Convert to array format
  const historyGroups = Object.entries(groupedSessions).map(([date, sessions]) => ({
    date,
    sessions
  }))

  const nextCursor = hasMore ? sessions[limit].startAt : null

  return {
    historyGroups,
    hasMore,
    nextCursor
  }
}

