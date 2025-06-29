
export type UserRole = 'marketing-creator' | 'marketing-reviewer' | 'compliance-reviewer' | 'developer';

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
    canDelete: true, // Only for draft status
    canApprove: false,
    canComment: true,
    canDownload: false,
    canDeploy: false,
    canManageUsers: false,
    canUpdateStatus: false
  },
  'marketing-reviewer': {
    canCreate: false,
    canEdit: true,
    canDelete: false,
    canApprove: false,
    canComment: true,
    canDownload: false,
    canDeploy: false,
    canManageUsers: false,
    canUpdateStatus: true
  },
  'compliance-reviewer': {
    canCreate: false,
    canEdit: false,
    canDelete: false,
    canApprove: true,
    canComment: true,
    canDownload: true,
    canDeploy: false,
    canManageUsers: false,
    canUpdateStatus: true
  },
  'developer': {
    canCreate: true,
    canEdit: true,
    canDelete: true,
    canApprove: true,
    canComment: true,
    canDownload: true,
    canDeploy: true,
    canManageUsers: true,
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
  'developer': 'Developer'
};

export const THREAD_STATUS_LABELS: Record<ThreadStatus, string> = {
  'in-progress': 'In Progress',
  'needs-revision': 'Needs Revision',
  'completed': 'Completed'
};
