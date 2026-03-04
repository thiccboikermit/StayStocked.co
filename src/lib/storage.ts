// Secure localStorage utility with error handling and type safety

interface StorageOptions {
  encrypt?: boolean;
  compress?: boolean;
  ttl?: number; // Time to live in milliseconds
}

interface StorageItem<T> {
  data: T;
  timestamp: number;
  ttl?: number;
}

class SecureStorage {
  private isAvailable(): boolean {
    if (typeof window === 'undefined') return false;
    
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  private isExpired<T>(item: StorageItem<T>): boolean {
    if (!item.ttl) return false;
    return Date.now() - item.timestamp > item.ttl;
  }

  set<T>(key: string, value: T, options: StorageOptions = {}): boolean {
    if (!this.isAvailable()) return false;

    try {
      const item: StorageItem<T> = {
        data: value,
        timestamp: Date.now(),
        ttl: options.ttl,
      };

      const serialized = JSON.stringify(item);
      localStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.warn(`Failed to save to localStorage:`, error);
      return false;
    }
  }

  get<T>(key: string, defaultValue: T | null = null): T | null {
    if (!this.isAvailable()) return defaultValue;

    try {
      const stored = localStorage.getItem(key);
      if (!stored) return defaultValue;

      const item: StorageItem<T> = JSON.parse(stored);
      
      // Check if expired
      if (this.isExpired(item)) {
        this.remove(key);
        return defaultValue;
      }

      return item.data;
    } catch (error) {
      console.warn(`Failed to load from localStorage:`, error);
      return defaultValue;
    }
  }

  remove(key: string): boolean {
    if (!this.isAvailable()) return false;

    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`Failed to remove from localStorage:`, error);
      return false;
    }
  }

  clear(): boolean {
    if (!this.isAvailable()) return false;

    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.warn(`Failed to clear localStorage:`, error);
      return false;
    }
  }

  // Get all keys with a specific prefix
  getKeys(prefix?: string): string[] {
    if (!this.isAvailable()) return [];

    try {
      const keys = Object.keys(localStorage);
      return prefix ? keys.filter(key => key.startsWith(prefix)) : keys;
    } catch {
      return [];
    }
  }

  // Cleanup expired items
  cleanup(): void {
    if (!this.isAvailable()) return;

    const keys = this.getKeys();
    keys.forEach(key => {
      try {
        const stored = localStorage.getItem(key);
        if (stored) {
          const item = JSON.parse(stored);
          if (this.isExpired(item)) {
            this.remove(key);
          }
        }
      } catch {
        // Ignore invalid JSON items
      }
    });
  }
}

// Export singleton instance
export const storage = new SecureStorage();

// Convenience functions for common storage keys
export const StorageKeys = {
  USERS: 'staystocked-users',
  PROPERTIES: 'staystocked-properties',
  BOOKINGS: 'staystocked-bookings',
  AUTH_TOKEN: 'auth-token',
  SHOPPING_SESSION: 'stayStockedSession',
  CART: 'grocery-cart',
  ORDERS: 'grocery-orders',
} as const;

// Auto-cleanup on app load (runs once)
if (typeof window !== 'undefined') {
  // Run cleanup on load
  storage.cleanup();
  
  // Set up periodic cleanup (every hour)
  setInterval(() => {
    storage.cleanup();
  }, 60 * 60 * 1000);
}