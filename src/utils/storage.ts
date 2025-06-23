
import { Website } from '../components/WebsiteCard';

const STORAGE_KEYS = {
  WEBSITES: 'lovable_websites',
  COMMENTS: 'projectComments'
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

  // Comment count helpers
  getCommentCount: (projectId: string): number => {
    try {
      const comments = localStorage.getItem(STORAGE_KEYS.COMMENTS);
      if (!comments) return 0;
      
      const allComments = JSON.parse(comments);
      return allComments.filter((comment: any) => comment.projectId === projectId).length;
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
  }
};
