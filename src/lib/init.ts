// Initialize secure storage data for demo purposes
// This ensures we have some data to work with when the app first loads

import { storage, StorageKeys } from './storage';

export function initializeSecureStorage() {
  // Initialize users if not present
  const existingUsers = storage.get<Array<{
    id: string;
    email: string;
    password: string;
    name: string;
    role: string;
  }>>(StorageKeys.USERS);
  
  if (!existingUsers) {
    const defaultUsers = [
      {
        id: '1',
        email: 'admin@staystocked.com',
        password: 'admin123',
        name: 'Admin User',
        role: 'admin',
      },
      {
        id: '2',
        email: 'host@example.com',
        password: 'host123',
        name: 'Host User',
        role: 'host',
      }
    ];
    
    storage.set(StorageKeys.USERS, defaultUsers);
  }
  
  // Properties will be created by hosts as they add them
  // No need to initialize empty array since our functions handle that
  
  console.log('StayStocked secure storage initialized');
}

// Auto-initialize on client side
if (typeof window !== 'undefined') {
  initializeSecureStorage();
}
