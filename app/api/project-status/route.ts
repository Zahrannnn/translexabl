import { NextRequest, NextResponse } from 'next/server';
import { checkProjectStatus, getProjectStatusSafe } from '@/lib/project-status';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const projectId = parseInt(searchParams.get('projectId') || '3');

    // Use safe version for API endpoint to always return a response
    const statusInfo = await getProjectStatusSafe(projectId);

    return NextResponse.json({
      success: true,
      ...statusInfo,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        isActive: false,
        error: error instanceof Error ? error.message : 'Failed to check project status',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const projectId = body.projectId || 3;

    // Use strict version for POST to enforce project status
    const statusData = await checkProjectStatus(projectId);

    if (!statusData.data.is_active) {
      return NextResponse.json(
        {
          success: false,
          isActive: false,
          message: 'Project access has been disabled. Please contact support.',
          projectName: statusData.data.program_name,
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      isActive: true,
      projectName: statusData.data.program_name,
      message: 'Project is active',
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        isActive: false,
        error: error instanceof Error ? error.message : 'Failed to check project status',
      },
      { status: 500 }
    );
  }
} 