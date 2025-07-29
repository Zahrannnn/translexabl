'use client';

import { useProjectStatus } from '@/hooks/useProjectStatus';
import { ReactNode } from 'react';

interface ProjectStatusGuardProps {
  children: ReactNode;
  projectId?: number;
  fallback?: ReactNode;
  showWarning?: boolean;
  blockAccess?: boolean;
}

export function ProjectStatusGuard({
  children,
  projectId = 3,
  fallback,
  showWarning = true,
  blockAccess = true,
}: ProjectStatusGuardProps) {
  const { data: status, isLoading, error } = useProjectStatus(projectId);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Checking project status...</span>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 m-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Failed to verify project status
            </h3>
            <div className="mt-2 text-sm text-red-700">
              {error.message || 'Unable to connect to project verification service.'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If project is inactive and we should block access
  if (status && !status.isActive && blockAccess) {
    return fallback || (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 m-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Access Restricted
            </h3>
            <div className="mt-2 text-sm text-red-700">
              Project access has been disabled. Please contact support to restore access.
              {status.projectName && (
                <div className="mt-1 font-medium">
                  Project: {status.projectName}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show warning banner if project is inactive but not blocking
  if (status && !status.isActive && showWarning && !blockAccess) {
    return (
      <div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 m-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Project Status Warning
              </h3>
              <div className="mt-1 text-sm text-yellow-700">
                This project is currently marked as inactive. Some features may be limited.
              </div>
            </div>
          </div>
        </div>
        {children}
      </div>
    );
  }

  // Project is active or status check is disabled, render children
  return <>{children}</>;
}

// Simplified version for specific use cases
export function ProjectAccessBlocker({ children, projectId = 3 }: { children: ReactNode; projectId?: number }) {
  return (
    <ProjectStatusGuard
      projectId={projectId}
      blockAccess={true}
      showWarning={false}
    >
      {children}
    </ProjectStatusGuard>
  );
}

export function ProjectWarningBanner({ children, projectId = 3 }: { children: ReactNode; projectId?: number }) {
  return (
    <ProjectStatusGuard
      projectId={projectId}
      blockAccess={false}
      showWarning={true}
    >
      {children}
    </ProjectStatusGuard>
  );
} 