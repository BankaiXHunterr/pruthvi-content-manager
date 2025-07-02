
export type UserRole = 'marketing-creator' | 'marketing-reviewer' | 'compliance-reviewer' | 'admin' | 'website-developer';

export type WebsiteStatus = 'draft' | 'marketing-review-in-progress' | 'marketing-review-completed' | 'ready-for-compliance-review' | 'compliance-approved' | 'ready-for-deployment' | 'deployed' | 'in-production';

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
    canApprove: false,
    canComment: true,
    canDownload: false,
    canDeploy: true,
    canManageUsers: false,
    canUpdateStatus: true
  },
  'marketing-reviewer': {
    canCreate: false,
    canEdit: true,
    canDelete: false,
    canApprove: false,
    canComment: true,
    canDownload: false,
    canDeploy: true,
    canManageUsers: false,
    canUpdateStatus: true
  },
  'compliance-reviewer': {
    canCreate: false,
    canEdit: false,
    canDelete: false,
    canApprove: true,
    canComment: true,
    canDownload: false,
    canDeploy: false,
    canManageUsers: false,
    canUpdateStatus: false
  },
  'admin': {
    canCreate: true,
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
    canDownload: true,
    canDeploy: false,
    canManageUsers: false,
    canUpdateStatus: false
  }
};

export const STATUS_LABELS: Record<WebsiteStatus, string> = {
  'draft': 'Draft',
  'marketing-review-in-progress': 'Marketing Review In Progress',
  'marketing-review-completed': 'Marketing Review Completed',
  'ready-for-compliance-review': 'Ready for Compliance Review',
  'compliance-approved': 'Compliance Approved',
  'ready-for-deployment': 'Ready for Deployment',
  'deployed': 'Deployed',
  'in-production': 'In Production'
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

// Status transition rules - defines what statuses each role can transition TO
export const STATUS_TRANSITIONS: Record<UserRole, Record<WebsiteStatus, WebsiteStatus[]>> = {
  'marketing-creator': {
    'draft': ['marketing-review-in-progress'],
    'marketing-review-in-progress': [], // Cannot change once in review
    'marketing-review-completed': [], // Cannot change
    'ready-for-compliance-review': [], // Cannot change
    'compliance-approved': ['ready-for-deployment'],
    'ready-for-deployment': ['deployed'],
    'deployed': ['in-production'],
    'in-production': []
  },
  'marketing-reviewer': {
    'draft': [],
    'marketing-review-in-progress': ['marketing-review-completed'],
    'marketing-review-completed': ['ready-for-compliance-review'],
    'ready-for-compliance-review': [], // Cannot change
    'compliance-approved': ['ready-for-deployment'],
    'ready-for-deployment': ['deployed'],
    'deployed': ['in-production'],
    'in-production': []
  },
  'compliance-reviewer': {
    'draft': [],
    'marketing-review-in-progress': [],
    'marketing-review-completed': [],
    'ready-for-compliance-review': ['compliance-approved', 'marketing-review-in-progress'], // Can approve or send back
    'compliance-approved': [],
    'ready-for-deployment': [],
    'deployed': [],
    'in-production': []
  },
  'admin': {
    'draft': ['marketing-review-in-progress'],
    'marketing-review-in-progress': ['marketing-review-completed'],
    'marketing-review-completed': ['ready-for-compliance-review'],
    'ready-for-compliance-review': ['compliance-approved', 'marketing-review-in-progress'],
    'compliance-approved': ['ready-for-deployment'],
    'ready-for-deployment': ['deployed'],
    'deployed': ['in-production'],
    'in-production': []
  },
  'website-developer': {
    'draft': [],
    'marketing-review-in-progress': [],
    'marketing-review-completed': [],
    'ready-for-compliance-review': [],
    'compliance-approved': [],
    'ready-for-deployment': [],
    'deployed': [],
    'in-production': []
  }
};

// Helper function to get available status transitions for a user and current status
export const getAvailableStatusTransitions = (userRole: UserRole, currentStatus: WebsiteStatus): WebsiteStatus[] => {
  return STATUS_TRANSITIONS[userRole][currentStatus] || [];
};

// Helper function to check if a status transition is valid
export const isValidStatusTransition = (userRole: UserRole, fromStatus: WebsiteStatus, toStatus: WebsiteStatus): boolean => {
  const availableTransitions = getAvailableStatusTransitions(userRole, fromStatus);
  return availableTransitions.includes(toStatus);
};

