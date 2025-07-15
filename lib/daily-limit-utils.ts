interface DailyUsage {
  count: number
  date: string
}

const DAILY_LIMIT = 600
const COOKIE_NAME = 'daily_usage'

export const getDailyUsage = (): DailyUsage => {
  if (typeof document === 'undefined') {
    return { count: 0, date: getCurrentDate() }
  }

  const cookies = document.cookie.split(';')
  const usageCookie = cookies.find(cookie => cookie.trim().startsWith(`${COOKIE_NAME}=`))
  
  if (usageCookie) {
    try {
      const cookieValue = usageCookie.split('=')[1]
      const decoded = decodeURIComponent(cookieValue)
      const usage: DailyUsage = JSON.parse(decoded)
      
      // Check if it's a new day
      if (usage.date !== getCurrentDate()) {
        // Reset usage for new day
        const newUsage = { count: 0, date: getCurrentDate() }
        setDailyUsage(newUsage)
        return newUsage
      }
      
      return usage
    } catch (error) {
      console.error('Error parsing daily usage cookie:', error)
      // Reset if corrupted
      const newUsage = { count: 0, date: getCurrentDate() }
      setDailyUsage(newUsage)
      return newUsage
    }
  }
  
  // No cookie found, create new
  const newUsage = { count: 0, date: getCurrentDate() }
  setDailyUsage(newUsage)
  return newUsage
}

export const setDailyUsage = (usage: DailyUsage): void => {
  if (typeof document === 'undefined') return

  const cookieValue = encodeURIComponent(JSON.stringify(usage))
  // Set cookie to expire at midnight
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)
  
  document.cookie = `${COOKIE_NAME}=${cookieValue}; expires=${tomorrow.toUTCString()}; path=/; SameSite=Strict`
}

export const updateDailyUsage = (charactersUsed: number): DailyUsage => {
  const currentUsage = getDailyUsage()
  const newUsage = {
    count: currentUsage.count + charactersUsed,
    date: currentUsage.date
  }
  setDailyUsage(newUsage)
  return newUsage
}

export const getRemainingCharacters = (): number => {
  const usage = getDailyUsage()
  return Math.max(0, DAILY_LIMIT - usage.count)
}

export const canTranslate = (textLength: number): boolean => {
  const remaining = getRemainingCharacters()
  return remaining >= textLength
}

export const isWithinDailyLimit = (): boolean => {
  const usage = getDailyUsage()
  return usage.count < DAILY_LIMIT
}

export const getDailyLimit = (): number => {
  return DAILY_LIMIT
}

const getCurrentDate = (): string => {
  return new Date().toISOString().split('T')[0] // YYYY-MM-DD format
}

export const resetDailyUsage = (): void => {
  const newUsage = { count: 0, date: getCurrentDate() }
  setDailyUsage(newUsage)
} 