// Authentication utility functions

/**
 * Dispatches a custom event to notify components about authentication state changes
 * This is useful when login/logout occurs and we need to update the UI across components
 */
export const notifyAuthStateChange = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('authStateChanged'))
  }
}

/**
 * Gets user information from the authentication cookie
 * @returns User object or null if not authenticated
 */
export const getUserFromCookie = () => {
  if (typeof window === 'undefined') return null
  
  const cookies = document.cookie.split(';')
  const userCookie = cookies.find(cookie => cookie.trim().startsWith('user='))
  
  if (userCookie) {
    try {
      const userValue = userCookie.split('=')[1]
      return JSON.parse(decodeURIComponent(userValue))
    } catch (error) {
      console.error('Error parsing user cookie:', error)
      return null
    }
  }
  
  return null
}

/**
 * Checks if user is authenticated
 * @returns boolean indicating authentication status
 */
export const isAuthenticated = () => {
  return getUserFromCookie() !== null
} 