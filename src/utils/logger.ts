/**
 * Local Error Tracking & Logging Utility
 * Simple console-based logging for development with breadcrumb tracking
 */

interface Breadcrumb {
  message: string;
  data?: Record<string, any>;
  timestamp: number;
}

// In-memory breadcrumbs for debugging
const breadcrumbs: Breadcrumb[] = [];
const MAX_BREADCRUMBS = 50;

// User context for debugging
let currentUser: { id: string; email?: string; username?: string } | null =
  null;

/**
 * Capture an error with context and stack trace
 */
export const captureError = (error: Error, context?: Record<string, any>) => {
  console.error('❌ Error:', error.message);
  if (context) {
    console.error('   Context:', context);
  }
  console.error('   Stack:', error.stack);
};

/**
 * Log a message with level
 */
export const logMessage = (
  message: string,
  level: 'debug' | 'info' | 'warning' | 'error' = 'info',
  context?: Record<string, any>,
) => {
  const emoji = {
    debug: '🔍',
    info: 'ℹ️',
    warning: '⚠️',
    error: '❌',
  }[level];

  console.log(`${emoji} [${level.toUpperCase()}] ${message}`);
  if (context) {
    console.log('   Context:', context);
  }
};

/**
 * Add breadcrumb for debugging
 */
export const addBreadcrumb = (message: string, data?: Record<string, any>) => {
  const breadcrumb: Breadcrumb = {
    message,
    data,
    timestamp: Date.now(),
  };

  breadcrumbs.push(breadcrumb);

  // Keep only the last MAX_BREADCRUMBS
  if (breadcrumbs.length > MAX_BREADCRUMBS) {
    breadcrumbs.shift();
  }

  if (__DEV__) {
    console.log(`🍞 Breadcrumb: ${message}`, data || '');
  }
};

/**
 * Get recent breadcrumbs for debugging
 */
export const getBreadcrumbs = () => [...breadcrumbs];

/**
 * Clear all breadcrumbs
 */
export const clearBreadcrumbs = () => {
  breadcrumbs.length = 0;
};

/**
 * Set user context (stored locally for debugging)
 */
export const setUser = (user: {
  id: string;
  email?: string;
  username?: string;
}) => {
  currentUser = user;
  console.log('👤 User context set:', user);
};

/**
 * Clear user context
 */
export const clearUser = () => {
  currentUser = null;
  console.log('👤 User context cleared');
};

/**
 * Get current user context
 */
export const getCurrentUser = () => currentUser;

/**
 * Main logger object with convenient methods
 */
export const logger = {
  /**
   * Log debug information
   */
  debug: (message: string, data?: any) => {
    console.log(`🔍 [DEBUG] ${message}`, data || '');
    addBreadcrumb(`DEBUG: ${message}`, data);
  },

  /**
   * Log general information
   */
  info: (message: string, data?: any) => {
    console.info(`ℹ️  [INFO] ${message}`, data || '');
    logMessage(message, 'info', data);
  },

  /**
   * Log warnings
   */
  warn: (message: string, data?: any) => {
    console.warn(`⚠️  [WARN] ${message}`, data || '');
    logMessage(message, 'warning', data);
  },

  /**
   * Log errors
   */
  error: (
    message: string,
    error?: Error | any,
    context?: Record<string, any>,
  ) => {
    console.error(`❌ [ERROR] ${message}`, error, context || '');

    if (error instanceof Error) {
      captureError(error, { ...context, message });
    } else {
      logMessage(message, 'error', { ...context, error });
    }
  },

  /**
   * Track user actions for debugging
   */
  trackAction: (action: string, data?: any) => {
    console.log(`🎯 [ACTION] ${action}`, data || '');
    addBreadcrumb(action, data);
  },
};

/**
 * Simple dev log (alias for console.log in development)
 */
export const devLog = (...args: any[]) => {
  if (__DEV__) {
    console.log(...args);
  }
};
