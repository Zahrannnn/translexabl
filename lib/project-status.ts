// Project status checking utilities
interface ProjectStatusResponse {
  status: string;
  data: {
    id: number;
    program_name: string;
    is_active: boolean;
  };
}

interface ProjectStatusErrorResponse {
  error: string;
  message: string;
}

export class ProjectStatusError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProjectStatusError';
  }
}

/**
 * Check if the project is active by calling the external API
 * @param projectId The project ID to check (default: 3)
 * @returns Promise with the project status
 */
export async function checkProjectStatus(projectId: number = 3): Promise<ProjectStatusResponse> {
  try {
    const response = await fetch(
      `https://valid-app-production.up.railway.app/api/programs/${projectId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add timeout to prevent hanging requests
        signal: AbortSignal.timeout(10000), // 10 seconds timeout
      }
    );

    if (!response.ok) {
      throw new ProjectStatusError(`API request failed with status: ${response.status}`);
    }

    const data: ProjectStatusResponse = await response.json();

    if (data.status !== 'success') {
      throw new ProjectStatusError('API returned non-success status');
    }

    return data;
  } catch (error) {
    if (error instanceof ProjectStatusError) {
      throw error;
    }
    throw new ProjectStatusError(`Failed to check project status: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Verify if the project is currently active
 * @param projectId The project ID to check (default: 3)
 * @returns Promise<boolean> - true if active, false if inactive
 * @throws ProjectStatusError if the check fails
 */
export async function isProjectActive(projectId: number = 3): Promise<boolean> {
  const statusData = await checkProjectStatus(projectId);
  return statusData.data.is_active;
}

/**
 * Middleware function to check project status and block access if inactive
 * @param projectId The project ID to check (default: 3)
 * @returns Promise that resolves if active, throws if inactive
 */
export async function enforceProjectStatus(projectId: number = 3): Promise<void> {
  const isActive = await isProjectActive(projectId);
  
  if (!isActive) {
    throw new ProjectStatusError('Project access has been disabled. Please contact support.');
  }
}

/**
 * Get project status with error handling for UI components
 * @param projectId The project ID to check (default: 3)
 * @returns Object with status info and error state
 */
export async function getProjectStatusSafe(projectId: number = 3): Promise<{
  isActive: boolean;
  projectName?: string;
  error?: string;
}> {
  try {
    const statusData = await checkProjectStatus(projectId);
    return {
      isActive: statusData.data.is_active,
      projectName: statusData.data.program_name,
    };
  } catch (error) {
    return {
      isActive: false,
      error: error instanceof Error ? error.message : 'Failed to check project status',
    };
  }
} 