# Project Status Integration

This document explains how to use the project status checking system to protect your application from unauthorized access.

## Overview

The system checks your external API endpoint `https://valid-app-production.up.railway.app/api/programs/3` to determine if the project is active. When `is_active` is `false`, the system can either block access entirely or show warning messages.

## Components

### 1. Core Utilities (`lib/project-status.ts`)

```typescript
// Check if project is active
const isActive = await isProjectActive(3);

// Get full project status
const status = await checkProjectStatus(3);

// Enforce project status (throws error if inactive)
await enforceProjectStatus(3);

// Safe version for UI components
const { isActive, projectName, error } = await getProjectStatusSafe(3);
```

### 2. API Routes (`/api/project-status`)

- **GET** `/api/project-status?projectId=3` - Check project status
- **POST** `/api/project-status` - Enforce project status with body `{ "projectId": 3 }`

### 3. React Hooks (`hooks/useProjectStatus.ts`)

```typescript
// Basic status monitoring
const { data, isLoading, error } = useProjectStatus(3, {
  refetchInterval: 5 * 60 * 1000, // Check every 5 minutes
});

// Enforce status (will error if inactive)
const { data, error } = useEnforceProjectStatus(3);
```

### 4. React Components (`components/ProjectStatusGuard.tsx`)

```typescript
// Block access when inactive
<ProjectStatusGuard projectId={3} blockAccess={true}>
  <YourProtectedContent />
</ProjectStatusGuard>

// Show warning but allow access
<ProjectStatusGuard projectId={3} blockAccess={false} showWarning={true}>
  <YourContent />
</ProjectStatusGuard>

// Simplified components
<ProjectAccessBlocker projectId={3}>
  <CriticalFeatures />
</ProjectAccessBlocker>

<ProjectWarningBanner projectId={3}>
  <RegularContent />
</ProjectWarningBanner>
```

## Integration Examples

### 1. Protect Entire Application (Current Setup)

In `app/[locale]/layout.tsx`, the entire application is protected:

```typescript
<ProjectStatusGuard projectId={3}>
  {children}
</ProjectStatusGuard>
```

### 2. Protect Specific API Routes

The middleware automatically protects these routes:
- `/api/translate*`
- `/api/user*`
- `/api/paymob*`

### 3. Protect Individual Pages

```typescript
// In any page component
export default function TranslatePage() {
  return (
    <ProjectAccessBlocker projectId={3}>
      <TranslationInterface />
    </ProjectAccessBlocker>
  );
}
```

### 4. Server-Side Protection

```typescript
// In API routes
import { enforceProjectStatus } from '@/lib/project-status';

export async function POST(request: NextRequest) {
  try {
    await enforceProjectStatus(3);
    // Continue with your logic
  } catch (error) {
    return NextResponse.json(
      { error: 'Project access denied' },
      { status: 403 }
    );
  }
}
```

### 5. Client-Side Monitoring

```typescript
function MyComponent() {
  const { data: status, error } = useProjectStatus(3);
  
  if (error) {
    return <div>Error checking project status</div>;
  }
  
  if (!status?.isActive) {
    return <div>Project is inactive</div>;
  }
  
  return <div>Project is active: {status.projectName}</div>;
}
```

## Configuration

### Change Project ID

Update the default project ID in multiple places:
1. `lib/project-status.ts` - Update default parameter values
2. `app/[locale]/layout.tsx` - Update the ProjectStatusGuard
3. `middleware.ts` - Update the project ID in the status check

### Customize Protected Routes

Edit `middleware.ts` to add or remove protected routes:

```typescript
const criticalRoutes = [
  '/api/translate',
  '/api/translate-document',
  '/api/translate-gemini',
  '/api/user',
  '/api/paymob',
  '/api/your-new-route' // Add new routes here
];
```

### Adjust Check Frequency

Modify the React Query settings in `hooks/useProjectStatus.ts`:

```typescript
refetchInterval: 2 * 60 * 1000, // Check every 2 minutes instead of 5
staleTime: 1 * 60 * 1000, // Consider stale after 1 minute
```

## Error Handling

The system includes comprehensive error handling:

1. **Network failures**: Graceful fallback with retry logic
2. **API errors**: Proper error messages and status codes
3. **Timeout protection**: 10-second timeout on API calls
4. **Loading states**: Proper loading indicators in UI components

## Security Features

1. **Middleware protection**: Server-side route protection
2. **Client-side guards**: UI-level access control
3. **API enforcement**: Direct API route protection
4. **Retry logic**: Handles temporary network issues
5. **Timeout protection**: Prevents hanging requests

## Testing

To test the system:

1. **Simulate inactive project**: Temporarily modify the API response
2. **Network failures**: Disable internet connection
3. **API errors**: Point to invalid endpoint
4. **Load testing**: Check performance with frequent status checks

## Troubleshooting

- **Status checks failing**: Check network connectivity and API endpoint
- **UI not updating**: Verify React Query is properly configured
- **Middleware not working**: Check route patterns in `middleware.ts`
- **Performance issues**: Adjust refresh intervals and caching settings 