import { User } from '@/types/auth';

export interface PredefinedUser extends User {
  passwordHash: string; // Plaintext for demo login
}

export const PREDEFINED_USERS: PredefinedUser[] = [
  {
    id: 'USR-ADMIN-01',
    email: 'admin@carangamani.com',
    passwordHash: 'Admin@2026',
    name: 'CA Rajesh Rangamani',
    role: 'admin',
    designation: 'Managing Partner & Lead Auditor',
    branch: 'Kochi Head Office',
  },
  {
    id: 'USR-EMP-01',
    email: 'employee1@carangamani.com',
    passwordHash: 'Staff@2026',
    name: 'Ananya Nair',
    role: 'employee',
    designation: 'Associate MSME Consultant',
    branch: 'Kochi Branch',
  },
  {
    id: 'USR-EMP-02',
    email: 'employee2@carangamani.com',
    passwordHash: 'Staff@2026',
    name: 'Rahul Menon',
    role: 'employee',
    designation: 'Statutory Compliance Analyst',
    branch: 'Thiruvananthapuram Branch',
  },
];
