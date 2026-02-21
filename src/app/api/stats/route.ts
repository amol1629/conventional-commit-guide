import { NextRequest, NextResponse } from 'next/server'
import { databaseService } from '@/services/database.service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }

    const stats = await databaseService.getLearningStats(userId)
    const achievements = await databaseService.getUserAchievements(userId)
    const recentActivity = await databaseService.getAllModuleProgress(userId)

    // Get achievement details
    const achievementDetails = await Promise.all(
      achievements.map(async (achievement) => {
        return await databaseService.getAchievementDetails(achievement.achievementId)
      })
    )

    return NextResponse.json({
      success: true,
      data: {
        stats: stats || {
          userId,
          totalModules: 0,
          completedModules: 0,
          totalProgress: 0,
          totalTimeSpent: 0,
          streak: 0,
          lastActivity: new Date(),
          achievements: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        achievements: achievementDetails.filter(Boolean),
        recentActivity: recentActivity.slice(0, 5), // Last 5 activities
      },
    })
  } catch (error) {
    console.error('Error in stats API:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Update learning stats
    const stats = await databaseService.updateLearningStats(userId)

    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error('Error in stats POST API:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
