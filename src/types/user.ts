export interface User {
  id: string;
  name: string; // Added name field
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'blocked';
  isDeleted?: boolean;
  needsPasswordChange?: boolean;
  phone?: string; // Added optional phone
  address?: string; // Added optional address
  accountAge?: number; // Added account age
  profile?: { // Made profile optional
    firstName?: string; // Made optional
    lastName?: string; // Made optional
    bio?: string; // Added bio field
    avatar?: string;
    dateOfBirth?: string; // Added date of birth
  };
  createdAt: string;
  updatedAt: string;
}
