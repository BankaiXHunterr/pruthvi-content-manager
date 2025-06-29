
export type UserRole = 'marketing-creator' | 'marketing-reviewer' | 'compliance-reviewer' | 'developer';

export type WebsiteStatus = 'draft' | 'marketing-review-completed' | 'compliance-approved' | 'deployed';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface RolePermissions {
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canApprove: boolean;
  canComment: boolean;
  canDownload: boolean;
  canDeploy: boolean;
  canManageUsers: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  'marketing-creator': {
    canCreate: true,
    canEdit: true,
    canDelete: true, // Only for draft status
    canApprove: false,
    canComment: true,
    canDownload: false,
    canDeploy: false,
    canManageUsers: false
  },
  'marketing-reviewer': {
    canCreate: false,
    canEdit: true,
    canDelete: false,
    canApprove: false,
    canComment: true,
    canDownload: false,
    canDeploy: false,
    canManageUsers: false
  },
  'compliance-reviewer': {
    canCreate: false,
    canEdit: false,
    canDelete: false,
    canApprove: true,
    canComment: true,
    canDownload: true,
    canDeploy: false,
    canManageUsers: false
  },
  'developer': {
    canCreate: true,
    canEdit: true,
    canDelete: true,
    canApprove: true,
    canComment: true,
    canDownload: true,
    canDeploy: true,
    canManageUsers: true
  }
};

export const STATUS_LABELS: Record<WebsiteStatus, string> = {
  'draft': 'Draft',
  'marketing-review-completed': 'Marketing Review Completed',
  'compliance-approved': 'Compliance Approved',
  'deployed': 'Deployed'
};

export const ROLE_LABELS: Record<UserRole, string> = {
  'marketing-creator': 'Marketing Creator',
  'marketing-reviewer': 'Marketing Reviewer',
  'compliance-reviewer': 'Compliance Reviewer',
  'developer': 'Developer'
};
