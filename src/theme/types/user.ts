export interface User {
  id: string;
  name: string; 
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'blocked';
  isDeleted?: boolean;
  needsPasswordChange?: boolean;
  phone?: string; 
  address?: string; 
  accountAge?: number;
  profile?: { 
    firstName?: string; 
    lastName?: string; 
    bio?: string; 
    avatar?: string;
    dateOfBirth?: string; 
  };
  createdAt: string;
  updatedAt: string;
}
