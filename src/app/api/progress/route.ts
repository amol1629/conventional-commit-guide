import { NextRequest, NextResponse } from 'next/server'
import { databaseService } from '@/services/database.service'

export async function POST(request: NextRequest) {
  try {
    const { userId, moduleId, moduleTitle, progress, videoId, watchTime } = await request.json()
    
    if (!userId || !moduleId || !moduleTitle || progress === undefined) {
      return NextResponse.json(
        { success: false, error: 'Required fields missing' },
        { status: 400 }
      )
    }

    const moduleProgress = await databaseService.updateModuleProgress(
      userId,
      moduleId,
      moduleTitle,
      progress,
      videoId,
      watchTime
    )

    // Update learning stats
    await databaseService.updateLearningStats(userId)

    return NextResponse.json({
      success: true,
      data: moduleProgress,
    })
  } catch (error) {
    console.error('Error in progress API:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const moduleId = searchParams.get('moduleId')
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }

    if (moduleId) {
      // Get specific module progress
      const progress = await databaseService.getModuleProgress(userId, moduleId)
      return NextResponse.json({
        success: true,
        data: progress,
      })
    } else {
      // Get all module progress
      const allProgress = await databaseService.getAllModuleProgress(userId)
      return NextResponse.json({
        success: true,
        data: allProgress,
      })
    }
  } catch (error) {
    console.error('Error in progress GET API:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
