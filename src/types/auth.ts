
export type UserRole = 'marketing-creator' | 'marketing-reviewer' | 'compliance-reviewer';

export type WebsiteStatus = 'draft' | 'marketing-review-completed' | 'compliance-approved';

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
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  'marketing-creator': {
    canCreate: true,
    canEdit: true,
    canDelete: true, // Only for draft status
    canApprove: false,
    canComment: true,
    canDownload: false
  },
  'marketing-reviewer': {
    canCreate: false,
    canEdit: true,
    canDelete: false,
    canApprove: false,
    canComment: true,
    canDownload: false
  },
  'compliance-reviewer': {
    canCreate: false,
    canEdit: false,
    canDelete: false,
    canApprove: true,
    canComment: true,
    canDownload: true
  }
};

export const STATUS_LABELS: Record<WebsiteStatus, string> = {
  'draft': 'Draft',
  'marketing-review-completed': 'Marketing Review Completed',
  'compliance-approved': 'Compliance Approved'
};
