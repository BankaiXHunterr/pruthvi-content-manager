
import { Website } from '../components/WebsiteCard';
import { CommentThread } from '../types/auth';

const STORAGE_KEYS = {
  WEBSITES: 'lovable_websites',
  COMMENTS: 'projectComments',
  THREADS: 'commentThreads',
  CURRENT_USER: 'currentUser'
};

export const StorageUtils = {
  // Website/Project storage
  saveWebsites: (websites: Website[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.WEBSITES, JSON.stringify(websites));
    } catch (error) {
      console.error('Failed to save websites to localStorage:', error);
    }
  },

  loadWebsites: (): Website[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.WEBSITES);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load websites from localStorage:', error);
      return [];
    }
  },

  // Thread storage
  saveThreads: (threads: CommentThread[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.THREADS, JSON.stringify(threads));
    } catch (error) {
      console.error('Failed to save threads to localStorage:', error);
    }
  },

  loadThreads: (): CommentThread[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.THREADS);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load threads from localStorage:', error);
      return [];
    }
  },

  getProjectThreads: (projectId: string): CommentThread[] => {
    const allThreads = StorageUtils.loadThreads();
    return allThreads.filter(thread => thread.projectId === projectId);
  },

  // Comment count helpers
  getCommentCount: (projectId: string): number => {
    try {
      const threads = StorageUtils.getProjectThreads(projectId);
      return threads.reduce((total, thread) => total + thread.comments.length, 0);
    } catch (error) {
      console.error('Failed to get comment count:', error);
      return 0;
    }
  },

  // Update comment counts for all websites
  updateWebsiteCommentCounts: (websites: Website[]): Website[] => {
    return websites.map(website => ({
      ...website,
      commentCount: StorageUtils.getCommentCount(website.id)
    }));
  },

  // Export data for compliance
  exportData: (): string => {
    try {
      const websites = StorageUtils.loadWebsites();
      const threads = StorageUtils.loadThreads();
      const comments = localStorage.getItem(STORAGE_KEYS.COMMENTS);
      
      const exportData = {
        websites,
        threads,
        comments: comments ? JSON.parse(comments) : [],
        exportDate: new Date().toISOString(),
        exportVersion: '1.0'
      };
      
      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('Failed to export data:', error);
      return '{}';
    }
  },

  // Create ZIP package for compliance-approved websites
  createZipPackage: (website: Website): Blob => {
    const threads = StorageUtils.getProjectThreads(website.id);
    const packageData = {
      website,
      threads,
      comments: JSON.parse(localStorage.getItem(STORAGE_KEYS.COMMENTS) || '[]')
        .filter((comment: any) => comment.projectId === website.id),
      packageDate: new Date().toISOString(),
      approvalStatus: 'compliance-approved'
    };
    
    const content = JSON.stringify(packageData, null, 2);
    return new Blob([content], { type: 'application/json' });
  }
};
