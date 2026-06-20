/**
 * User & Auth Types
 * Role definitions and user profile structures
 */

export type UserRole = 'admin' | 'staff' | 'finance' | 'viewer' | 'attorney' | 'expert' | 'claimant';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING_OTP';
  avatar_url?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthSession {
  user: UserProfile;
  access_token: string;
  expires_at: string;
}

export interface OTPVerificationRequest {
  email: string;
  purpose: 'LOGIN' | 'PASSWORD_RESET' | 'ACCOUNT_SETUP';
}

export interface RolePermissions {
  viewAppointments: boolean;
  createAppointment: boolean;
  approveAppointment: boolean;
  assignExpert: boolean;
  viewFinance: boolean;
  createInvoice: boolean;
  recordPayment: boolean;
  voidInvoice: boolean;
  viewReports: boolean;
  approveReport: boolean;
  manageStaff: boolean;
  viewAuditLogs: boolean;
  editSystemSettings: boolean;
  viewAnalytics: boolean;
  manageCRM: boolean;
  exportData: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, Partial<RolePermissions>> = {
  admin: {
    viewAppointments: true,
    createAppointment: true,
    approveAppointment: true,
    assignExpert: true,
    viewFinance: true,
    createInvoice: true,
    recordPayment: true,
    voidInvoice: true,
    viewReports: true,
    approveReport: true,
    manageStaff: true,
    viewAuditLogs: true,
    editSystemSettings: true,
    viewAnalytics: true,
    manageCRM: true,
    exportData: true,
  },
  staff: {
    viewAppointments: true,
    createAppointment: true,
    approveAppointment: true,
    assignExpert: true,
    viewReports: true,
    approveReport: true,
    viewAnalytics: true,
    manageCRM: true,
    exportData: true,
  },
  finance: {
    viewAppointments: true,
    viewFinance: true,
    createInvoice: true,
    recordPayment: true,
    viewAnalytics: true,
    exportData: true,
  },
  viewer: {
    viewAppointments: true,
    viewReports: true,
    viewAnalytics: true,
  },
  attorney: {
    viewAppointments: true,
  },
  expert: {
    viewAppointments: true,
  },
  claimant: {
    viewAppointments: true,
  },
};
