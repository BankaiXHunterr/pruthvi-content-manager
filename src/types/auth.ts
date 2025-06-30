
export type UserRole = 'marketing-creator' | 'marketing-reviewer' | 'compliance-reviewer' | 'admin' | 'website-developer';

export type WebsiteStatus = 'draft' | 'marketing-review-completed' | 'compliance-approved' | 'deployed' | 'marketing-review-in-progress' | 'ready-for-compliance-review' | 'ready-for-deployment';

export type ThreadStatus = 'in-progress' | 'needs-revision' | 'completed';

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
  canUpdateStatus: boolean;
}

export interface CommentThread {
  id: string;
  projectId: string;
  status: ThreadStatus;
  createdBy: string;
  createdAt: string;
  title: string;
  comments: Comment[];
}

export interface Comment {
  id: string;
  threadId: string;
  content: string;
  author: string;
  authorRole: UserRole;
  createdAt: string;
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  'marketing-creator': {
    canCreate: true,
    canEdit: true,
    canDelete: true,
    canApprove: false, // Cannot use Approve button
    canComment: true,
    canDownload: false, // Cannot use Download button
    canDeploy: true,
    canManageUsers: false,
    canUpdateStatus: true
  },
  'marketing-reviewer': {
    canCreate: false, // Cannot use Create button
    canEdit: true,
    canDelete: false, // Cannot use Delete button
    canApprove: false, // Cannot use Approve button
    canComment: true,
    canDownload: false, // Cannot use Download button
    canDeploy: true,
    canManageUsers: false,
    canUpdateStatus: true
  },
  'compliance-reviewer': {
    canCreate: false,
    canEdit: false,
    canDelete: false,
    canApprove: true, // Can only see and click Approve
    canComment: true, // Can only see and click Comment
    canDownload: false,
    canDeploy: false,
    canManageUsers: false,
    canUpdateStatus: false
  },
  'admin': {
    canCreate: true, // Full access to all features
    canEdit: true,
    canDelete: true,
    canApprove: true,
    canComment: true,
    canDownload: true,
    canDeploy: true,
    canManageUsers: true,
    canUpdateStatus: true
  },
  'website-developer': {
    canCreate: false,
    canEdit: false,
    canDelete: false,
    canApprove: false,
    canComment: false,
    canDownload: true, // Can only see and click Download
    canDeploy: false,
    canManageUsers: false,
    canUpdateStatus: false
  }
};

export const STATUS_LABELS: Record<WebsiteStatus, string> = {
  'draft': 'Draft',
  'marketing-review-completed': 'Marketing Review Completed',
  'marketing-review-in-progress': 'Marketing Review In Progress',
  'ready-for-compliance-review': 'Ready for Compliance Review',
  'compliance-approved': 'Compliance Approved',
  'ready-for-deployment': 'Ready for Deployment',
  'deployed': 'Deployed'
};

export const ROLE_LABELS: Record<UserRole, string> = {
  'marketing-creator': 'Marketing Creator',
  'marketing-reviewer': 'Marketing Reviewer',
  'compliance-reviewer': 'Compliance Reviewer',
  'admin': 'Admin',
  'website-developer': 'Website Developer'
};

export const THREAD_STATUS_LABELS: Record<ThreadStatus, string> = {
  'in-progress': 'In Progress',
  'needs-revision': 'Needs Revision',
  'completed': 'Completed'
};
