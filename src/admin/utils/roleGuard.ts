/**
 * Role-based Access Control Guard
 * Validates user permissions for specific actions
 */

import { UserRole, ROLE_PERMISSIONS, RolePermissions } from '../types/user.types';

type PermissionKey = keyof RolePermissions;

export class RoleGuard {
  static hasPermission(role: UserRole, permission: PermissionKey): boolean {
    const permissions = ROLE_PERMISSIONS[role];
    return permissions?.[permission] ?? false;
  }

  static hasAnyRole(userRole: UserRole, allowedRoles: UserRole[]): boolean {
    return allowedRoles.includes(userRole);
  }

  static hasAllPermissions(role: UserRole, permissions: PermissionKey[]): boolean {
    return permissions.every((permission) => this.hasPermission(role, permission));
  }

  static hasAnyPermission(role: UserRole, permissions: PermissionKey[]): boolean {
    return permissions.some((permission) => this.hasPermission(role, permission));
  }

  static canViewAppointments(role: UserRole): boolean {
    return this.hasPermission(role, 'viewAppointments');
  }

  static canCreateAppointment(role: UserRole): boolean {
    return this.hasPermission(role, 'createAppointment');
  }

  static canApproveAppointment(role: UserRole): boolean {
    return this.hasPermission(role, 'approveAppointment');
  }

  static canManageFinance(role: UserRole): boolean {
    return this.hasPermission(role, 'viewFinance') && this.hasPermission(role, 'recordPayment');
  }

  static canManageStaff(role: UserRole): boolean {
    return this.hasPermission(role, 'manageStaff');
  }

  static canViewAuditLogs(role: UserRole): boolean {
    return this.hasPermission(role, 'viewAuditLogs');
  }

  static canEditSystemSettings(role: UserRole): boolean {
    return this.hasPermission(role, 'editSystemSettings');
  }

  static canApproveReport(role: UserRole): boolean {
    return this.hasPermission(role, 'approveReport');
  }

  static canExportData(role: UserRole): boolean {
    return this.hasPermission(role, 'exportData');
  }

  static getPermissionsForRole(role: UserRole): RolePermissions {
    return (ROLE_PERMISSIONS[role] as RolePermissions) || {};
  }
}

/**
 * Helper function to guard component rendering based on role
 * Usage: if (hasAccess(userRole, 'createAppointment')) { ... }
 */
export const hasAccess = (role: UserRole, permission: PermissionKey): boolean => {
  return RoleGuard.hasPermission(role, permission);
};
