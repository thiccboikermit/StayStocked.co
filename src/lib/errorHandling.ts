// Comprehensive error handling and logging utilities

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum ErrorCategory {
  NETWORK = 'network',
  VALIDATION = 'validation',
  AUTHENTICATION = 'authentication',
  STORAGE = 'storage',
  UI = 'ui',
  CALENDAR = 'calendar',
  BOOKING = 'booking',
  UNKNOWN = 'unknown'
}

export interface ErrorInfo {
  id: string;
  message: string;
  severity: ErrorSeverity;
  category: ErrorCategory;
  timestamp: number;
  url?: string;
  userAgent?: string;
  userId?: string;
  component?: string;
  stack?: string;
  metadata?: Record<string, unknown>;
}

class ErrorHandler {
  private errors: ErrorInfo[] = [];
  private maxErrors = 50; // Keep only the last 50 errors
  private isDevelopment = process.env.NODE_ENV === 'development';

  // Log an error with context
  logError(
    error: Error | string,
    options: {
      severity?: ErrorSeverity;
      category?: ErrorCategory;
      component?: string;
      userId?: string;
      metadata?: Record<string, unknown>;
    } = {}
  ): string {
    const errorId = this.generateErrorId();
    const message = error instanceof Error ? error.message : error;
    const stack = error instanceof Error ? error.stack : undefined;

    const errorInfo: ErrorInfo = {
      id: errorId,
      message,
      severity: options.severity || ErrorSeverity.MEDIUM,
      category: options.category || ErrorCategory.UNKNOWN,
      timestamp: Date.now(),
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : undefined,
      userId: options.userId,
      component: options.component,
      stack,
      metadata: options.metadata,
    };

    this.errors.push(errorInfo);

    // Keep only the most recent errors
    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }

    // Console logging based on severity
    if (this.isDevelopment || errorInfo.severity === ErrorSeverity.CRITICAL) {
      this.consoleLog(errorInfo);
    }

    // In production, you might want to send critical errors to a logging service
    if (!this.isDevelopment && errorInfo.severity === ErrorSeverity.CRITICAL) {
      this.sendToLoggingService(errorInfo);
    }

    return errorId;
  }

  // Get user-friendly error messages
  getUserFriendlyMessage(
    error: Error | string,
    category: ErrorCategory = ErrorCategory.UNKNOWN
  ): string {
    const message = error instanceof Error ? error.message : error;

    // Network errors
    if (category === ErrorCategory.NETWORK || message.includes('fetch') || message.includes('network')) {
      if (message.includes('Failed to fetch')) {
        return 'Unable to connect to the server. Please check your internet connection and try again.';
      }
      if (message.includes('timeout')) {
        return 'The request is taking too long. Please try again.';
      }
      return 'A network error occurred. Please check your connection and try again.';
    }

    // Validation errors
    if (category === ErrorCategory.VALIDATION) {
      return message; // Validation messages are usually user-friendly already
    }

    // Authentication errors
    if (category === ErrorCategory.AUTHENTICATION) {
      if (message.includes('token') || message.includes('unauthorized')) {
        return 'Your session has expired. Please sign in again.';
      }
      if (message.includes('credentials') || message.includes('login')) {
        return 'Invalid email or password. Please try again.';
      }
      return 'Authentication failed. Please try signing in again.';
    }

    // Storage errors
    if (category === ErrorCategory.STORAGE) {
      if (message.includes('localStorage') || message.includes('sessionStorage')) {
        return 'Unable to save data locally. Please ensure your browser supports local storage.';
      }
      return 'Failed to save your data. Please try again.';
    }

    // Calendar errors
    if (category === ErrorCategory.CALENDAR) {
      if (message.includes('iCal') || message.includes('calendar')) {
        return 'Unable to load calendar data. The dates shown may not be current.';
      }
      return 'Calendar synchronization failed. Please try refreshing.';
    }

    // Booking errors
    if (category === ErrorCategory.BOOKING) {
      if (message.includes('dates')) {
        return 'The selected dates are not available. Please choose different dates.';
      }
      if (message.includes('booking')) {
        return 'Unable to process your booking. Please try again or contact support.';
      }
      return 'Booking failed. Please verify your information and try again.';
    }

    // Generic fallback
    if (message.length < 100 && !message.includes('TypeError') && !message.includes('ReferenceError')) {
      return message; // Short, likely user-friendly messages
    }

    return 'Something went wrong. Please try again or contact support if the problem continues.';
  }

  // Get all errors (useful for debugging)
  getAllErrors(): ErrorInfo[] {
    return [...this.errors];
  }

  // Get errors by category
  getErrorsByCategory(category: ErrorCategory): ErrorInfo[] {
    return this.errors.filter(error => error.category === category);
  }

  // Get errors by severity
  getErrorsBySeverity(severity: ErrorSeverity): ErrorInfo[] {
    return this.errors.filter(error => error.severity === severity);
  }

  // Clear all errors
  clearErrors(): void {
    this.errors = [];
  }

  // Get error statistics
  getErrorStats(): {
    total: number;
    byCategory: Record<ErrorCategory, number>;
    bySeverity: Record<ErrorSeverity, number>;
    recent: number; // errors in the last hour
  } {
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    const recent = this.errors.filter(error => error.timestamp > oneHourAgo).length;

    const byCategory = {} as Record<ErrorCategory, number>;
    const bySeverity = {} as Record<ErrorSeverity, number>;

    // Initialize counts
    Object.values(ErrorCategory).forEach(cat => byCategory[cat] = 0);
    Object.values(ErrorSeverity).forEach(sev => bySeverity[sev] = 0);

    // Count errors
    this.errors.forEach(error => {
      byCategory[error.category]++;
      bySeverity[error.severity]++;
    });

    return {
      total: this.errors.length,
      byCategory,
      bySeverity,
      recent
    };
  }

  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private consoleLog(errorInfo: ErrorInfo): void {
    const prefix = `[${errorInfo.severity.toUpperCase()}] [${errorInfo.category.toUpperCase()}]`;
    
    switch (errorInfo.severity) {
      case ErrorSeverity.LOW:
        console.info(prefix, errorInfo.message, errorInfo);
        break;
      case ErrorSeverity.MEDIUM:
        console.warn(prefix, errorInfo.message, errorInfo);
        break;
      case ErrorSeverity.HIGH:
      case ErrorSeverity.CRITICAL:
        console.error(prefix, errorInfo.message, errorInfo);
        if (errorInfo.stack) {
          console.error('Stack trace:', errorInfo.stack);
        }
        break;
    }
  }

  private sendToLoggingService(errorInfo: ErrorInfo): void {
    // In a real application, you would send this to a service like Sentry, LogRocket, etc.
    // For now, we'll just store it locally for potential later upload
    try {
      const criticalErrors = JSON.parse(localStorage.getItem('staystocked-critical-errors') || '[]');
      criticalErrors.push(errorInfo);
      
      // Keep only the last 10 critical errors
      if (criticalErrors.length > 10) {
        criticalErrors.shift();
      }
      
      localStorage.setItem('staystocked-critical-errors', JSON.stringify(criticalErrors));
    } catch (storageError) {
      console.error('Failed to store critical error:', storageError);
    }
  }
}

// Singleton instance
export const errorHandler = new ErrorHandler();

// Convenience functions for common error scenarios
export function logNetworkError(error: Error | string, component?: string, metadata?: Record<string, unknown>): string {
  return errorHandler.logError(error, {
    severity: ErrorSeverity.HIGH,
    category: ErrorCategory.NETWORK,
    component,
    metadata
  });
}

export function logValidationError(error: Error | string, component?: string, metadata?: Record<string, unknown>): string {
  return errorHandler.logError(error, {
    severity: ErrorSeverity.LOW,
    category: ErrorCategory.VALIDATION,
    component,
    metadata
  });
}

export function logAuthError(error: Error | string, component?: string, metadata?: Record<string, unknown>): string {
  return errorHandler.logError(error, {
    severity: ErrorSeverity.HIGH,
    category: ErrorCategory.AUTHENTICATION,
    component,
    metadata
  });
}

export function logStorageError(error: Error | string, component?: string, metadata?: Record<string, unknown>): string {
  return errorHandler.logError(error, {
    severity: ErrorSeverity.MEDIUM,
    category: ErrorCategory.STORAGE,
    component,
    metadata
  });
}

export function logCalendarError(error: Error | string, component?: string, metadata?: Record<string, unknown>): string {
  return errorHandler.logError(error, {
    severity: ErrorSeverity.MEDIUM,
    category: ErrorCategory.CALENDAR,
    component,
    metadata
  });
}

export function logBookingError(error: Error | string, component?: string, metadata?: Record<string, unknown>): string {
  return errorHandler.logError(error, {
    severity: ErrorSeverity.HIGH,
    category: ErrorCategory.BOOKING,
    component,
    metadata
  });
}

export function logCriticalError(error: Error | string, component?: string, metadata?: Record<string, unknown>): string {
  return errorHandler.logError(error, {
    severity: ErrorSeverity.CRITICAL,
    category: ErrorCategory.UNKNOWN,
    component,
    metadata
  });
}

// React hook for error handling
import { useState, useCallback } from 'react';

export function useErrorHandler() {
  const [currentError, setCurrentError] = useState<string | null>(null);
  const [errorId, setErrorId] = useState<string | null>(null);

  const handleError = useCallback((
    error: Error | string,
    options: {
      severity?: ErrorSeverity;
      category?: ErrorCategory;
      component?: string;
      showToUser?: boolean;
      metadata?: Record<string, unknown>;
    } = {}
  ) => {
    const id = errorHandler.logError(error, options);
    setErrorId(id);

    if (options.showToUser !== false) {
      const userMessage = errorHandler.getUserFriendlyMessage(
        error,
        options.category || ErrorCategory.UNKNOWN
      );
      setCurrentError(userMessage);
    }

    return id;
  }, []);

  const clearError = useCallback(() => {
    setCurrentError(null);
    setErrorId(null);
  }, []);

  return {
    currentError,
    errorId,
    handleError,
    clearError
  };
}

// Global error boundary context for React
export const ErrorContext = React.createContext<{
  handleError: (error: Error | string, options?: {
    severity?: ErrorSeverity;
    category?: ErrorCategory;
    component?: string;
    showToUser?: boolean;
    metadata?: Record<string, unknown>;
  }) => string;
  clearError: () => void;
  currentError: string | null;
}>({
  handleError: () => '',
  clearError: () => {},
  currentError: null
});

// Initialize global error handlers
if (typeof window !== 'undefined') {
  // Handle uncaught errors
  window.addEventListener('error', (event) => {
    logCriticalError(event.error || event.message, 'global', {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    });
  });

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    logCriticalError(`Unhandled Promise Rejection: ${event.reason}`, 'global', {
      promise: event.promise
    });
  });

  // Log performance issues as errors
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.duration > 5000) { // Tasks taking longer than 5 seconds
            errorHandler.logError(`Slow operation detected: ${entry.name} took ${entry.duration}ms`, {
              severity: ErrorSeverity.MEDIUM,
              category: ErrorCategory.UI,
              component: 'performance-monitor',
              metadata: { entry }
            });
          }
        });
      });
      observer.observe({ entryTypes: ['measure', 'navigation'] });
    } catch (error) {
      console.warn('Performance monitoring not available:', error);
    }
  }
}

// TypeScript needs React import for JSX
import React from 'react';