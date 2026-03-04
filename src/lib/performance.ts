// Performance monitoring and optimization utilities

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  url?: string;
  userAgent?: string;
}

interface LoadingState {
  isLoading: boolean;
  startTime: number;
  component: string;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private loadingStates: Map<string, LoadingState> = new Map();

  // Start timing an operation
  startTiming(name: string, component?: string): void {
    if (typeof window === 'undefined') return;

    this.loadingStates.set(name, {
      isLoading: true,
      startTime: performance.now(),
      component: component || 'unknown'
    });
  }

  // End timing and record metric
  endTiming(name: string): number | null {
    if (typeof window === 'undefined') return null;

    const state = this.loadingStates.get(name);
    if (!state) return null;

    const duration = performance.now() - state.startTime;
    this.loadingStates.delete(name);

    this.recordMetric({
      name,
      value: duration,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    });

    return duration;
  }

  // Record a custom metric
  recordMetric(metric: PerformanceMetric): void {
    this.metrics.push(metric);

    // Keep only the last 100 metrics to avoid memory issues
    if (this.metrics.length > 100) {
      this.metrics.shift();
    }

    // Log slow operations (over 2 seconds) in development
    if (process.env.NODE_ENV === 'development' && metric.value > 2000) {
      console.warn(`Slow operation detected: ${metric.name} took ${metric.value.toFixed(2)}ms`);
    }
  }

  // Get performance summary
  getSummary(): {
    totalMetrics: number;
    averageLoadTime: number;
    slowestOperation: PerformanceMetric | null;
    fastestOperation: PerformanceMetric | null;
  } {
    if (this.metrics.length === 0) {
      return {
        totalMetrics: 0,
        averageLoadTime: 0,
        slowestOperation: null,
        fastestOperation: null
      };
    }

    const loadTimes = this.metrics.map(m => m.value);
    const totalTime = loadTimes.reduce((sum, time) => sum + time, 0);
    const averageLoadTime = totalTime / this.metrics.length;
    
    const sortedMetrics = [...this.metrics].sort((a, b) => a.value - b.value);
    const fastestOperation = sortedMetrics[0];
    const slowestOperation = sortedMetrics[sortedMetrics.length - 1];

    return {
      totalMetrics: this.metrics.length,
      averageLoadTime,
      slowestOperation,
      fastestOperation
    };
  }

  // Get all metrics (useful for debugging)
  getAllMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  // Clear all metrics
  clearMetrics(): void {
    this.metrics = [];
    this.loadingStates.clear();
  }

  // Monitor Core Web Vitals
  measureWebVitals(): void {
    if (typeof window === 'undefined') return;

    // Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.recordMetric({
            name: 'LCP',
            value: lastEntry.startTime,
            timestamp: Date.now(),
            url: window.location.href
          });
        });
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

        // First Input Delay (FID)
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            // Type assertion for first-input performance entries
            const fidEntry = entry as PerformanceEntry & { processingStart: number };
            this.recordMetric({
              name: 'FID',
              value: fidEntry.processingStart - fidEntry.startTime,
              timestamp: Date.now(),
              url: window.location.href
            });
          });
        });
        fidObserver.observe({ type: 'first-input', buffered: true });

        // Cumulative Layout Shift (CLS)
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
        entries.forEach((entry: PerformanceEntry & { value?: number; hadRecentInput?: boolean }) => {
            if (!entry.hadRecentInput && entry.value !== undefined) {
              clsValue += entry.value;
            }
          });
          this.recordMetric({
            name: 'CLS',
            value: clsValue,
            timestamp: Date.now(),
            url: window.location.href
          });
        });
        clsObserver.observe({ type: 'layout-shift', buffered: true });

      } catch (error) {
        console.warn('Performance monitoring not supported:', error);
      }
    }
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

// React hook for performance monitoring
import { useEffect, useRef } from 'react';

export function usePerformanceTimer(name: string, component: string) {
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!hasStarted.current) {
      performanceMonitor.startTiming(name, component);
      hasStarted.current = true;
    }

    return () => {
      if (hasStarted.current) {
        performanceMonitor.endTiming(name);
      }
    };
  }, [name, component]);
}

// High-order component for automatic performance monitoring
export function withPerformanceMonitoring<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName: string
): React.ComponentType<P> {
  const PerformanceWrapper = (props: P) => {
    usePerformanceTimer(`${componentName}-render`, componentName);
    return React.createElement(WrappedComponent, props);
  };
  PerformanceWrapper.displayName = `withPerformanceMonitoring(${componentName})`;
  return PerformanceWrapper;
}

// Utility functions for common performance optimizations
export function debounce<Args extends unknown[]>(
  func: (...args: Args) => unknown,
  wait: number
): (...args: Args) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<Args extends unknown[]>(
  func: (...args: Args) => unknown,
  limit: number
): (...args: Args) => void {
  let inThrottle: boolean;
  return (...args: Args) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Lazy loading helper
export function createLazyComponent<T extends React.ComponentType<Record<string, unknown>>>(
  importFunc: () => Promise<{ default: T }>,
  componentName: string
) {
  const LazyComponent = React.lazy(() => {
    performanceMonitor.startTiming(`${componentName}-lazy-load`, componentName);
    return importFunc().then(module => {
      performanceMonitor.endTiming(`${componentName}-lazy-load`);
      return module;
    });
  });

  return LazyComponent;
}

// Image optimization helper
export function optimizeImageLoading(imageElement: HTMLImageElement) {
  if ('loading' in imageElement) {
    imageElement.loading = 'lazy';
  }
  
  if ('decoding' in imageElement) {
    imageElement.decoding = 'async';
  }
}

// Bundle size analyzer (development only)
export function analyzeBundleSize() {
  if (process.env.NODE_ENV !== 'development' || typeof window === 'undefined') {
    return;
  }

  const scripts = Array.from(document.querySelectorAll('script[src]'));
  const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
  
  console.group('Bundle Analysis');
  console.log('Scripts:', scripts.length);
  console.log('Stylesheets:', styles.length);
  
  scripts.forEach((script, index) => {
    const scriptElement = script as HTMLScriptElement;
    if (scriptElement.src) {
      console.log(`Script ${index + 1}: ${scriptElement.src}`);
    }
  });
  
  styles.forEach((style, index) => {
    const styleElement = style as HTMLLinkElement;
    if (styleElement.href) {
      console.log(`Stylesheet ${index + 1}: ${styleElement.href}`);
    }
  });
  
  console.groupEnd();
}

// Initialize performance monitoring on app load
if (typeof window !== 'undefined') {
  // Start monitoring web vitals
  performanceMonitor.measureWebVitals();
  
  // Log performance summary on page unload
  window.addEventListener('beforeunload', () => {
    const summary = performanceMonitor.getSummary();
    if (summary.totalMetrics > 0) {
      console.log('StayStocked Performance Summary:', summary);
    }
  });

  // Run bundle analysis in development
  if (process.env.NODE_ENV === 'development') {
    window.addEventListener('load', () => {
      setTimeout(analyzeBundleSize, 1000);
    });
  }
}

// TypeScript needs React import for JSX
import React from 'react';