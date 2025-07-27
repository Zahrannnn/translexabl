// Re-export from the root i18n configuration for backward compatibility
export { locales, defaultLocale, getDirection, getLocaleDisplayName } from '../i18n';
export type { Locale } from '../i18n';

/**
 * Common translation keys
 */
export const COMMON_KEYS = {
  // Navigation
  HOME: 'home',
  ABOUT: 'about',
  PRICING: 'pricing',
  BLOGS: 'blogs',
  DASHBOARD: 'dashboard',
  LOGIN: 'login',
  LOGOUT: 'logout',
  PROFILE: 'profile',
  REGISTER: 'register',
  
  // Actions
  SAVE: 'save',
  CANCEL: 'cancel',
  DELETE: 'delete',
  EDIT: 'edit',
  CREATE: 'create',
  VIEW: 'view',
  GET_STARTED: 'getStarted',
  LEARN_MORE: 'learnMore',
  
  // Status
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  COMPLETED: 'completed',
  
  // Common words
  NAME: 'name',
  EMAIL: 'email',
  PHONE: 'phone',
  ADDRESS: 'address',
  DATE: 'date',
  AMOUNT: 'amount',
  STATUS: 'status',
  ACTIONS: 'actions',
  LANGUAGE: 'language',
} as const; 