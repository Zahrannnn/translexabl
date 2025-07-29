import { useQuery } from '@tanstack/react-query';

interface ProjectStatusResponse {
  success: boolean;
  isActive: boolean;
  projectName?: string;
  error?: string;
  message?: string;
}

/**
 * React hook to check project status using React Query
 * @param projectId Project ID to check (default: 3)
 * @param options Configuration options
 * @returns Query result with project status
 */
export function useProjectStatus(
  projectId: number = 3,
  options: {
    enabled?: boolean;
    refetchInterval?: number;
    refetchOnWindowFocus?: boolean;
  } = {}
) {
  const {
    enabled = true,
    refetchInterval = 5 * 60 * 1000, // Check every 5 minutes
    refetchOnWindowFocus = true,
  } = options;

  return useQuery<ProjectStatusResponse>({
    queryKey: ['projectStatus', projectId],
    queryFn: async () => {
      const response = await fetch(`/api/project-status?projectId=${projectId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    },
    enabled,
    refetchInterval,
    refetchOnWindowFocus,
    staleTime: 2 * 60 * 1000, // Consider data stale after 2 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook to enforce project status - throws error if project is inactive
 * @param projectId Project ID to check (default: 3)
 * @returns Query result that will error if project is inactive
 */
export function useEnforceProjectStatus(projectId: number = 3) {
  return useQuery<ProjectStatusResponse>({
    queryKey: ['enforceProjectStatus', projectId],
    queryFn: async () => {
      const response = await fetch('/api/project-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectId }),
      });
      
      const data = await response.json();
      
      if (!response.ok || !data.success || !data.isActive) {
        throw new Error(data.message || data.error || 'Project access denied');
      }
      
      return data;
    },
    staleTime: 1 * 60 * 1000, // Consider data stale after 1 minute for enforcement
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    retry: 2,
    retryDelay: 1000,
  });
} 