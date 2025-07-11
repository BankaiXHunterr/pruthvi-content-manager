
import { useState, useEffect, useCallback, useRef } from 'react';
import { apiService } from '../services/apiService';
import { websocketService } from '../services/websocketService';
import { Website } from '../components/WebsiteCard';
import { StorageUtils } from '../utils/storage';

interface UseRealTimeDataOptions {
  enableWebSocket?: boolean;
  fallbackToStorage?: boolean;
  syncInterval?: number;
}

export const useRealTimeData = (options: UseRealTimeDataOptions = {}) => {
  const {
    enableWebSocket = true,
    fallbackToStorage = true,
    syncInterval = 30000 // 30 seconds
  } = options;

  const [websites, setWebsites] = useState<Website[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const syncIntervalRef = useRef<NodeJS.Timeout>();

  // Load initial data
  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Attempting to load data from API...');
      // Always try API first
      const apiData = await apiService.getWebsites();
      const websitesData = Array.isArray(apiData) ? apiData as Website[] : [];
      const websitesWithComments = StorageUtils.updateWebsiteCommentCounts(websitesData);
      setWebsites(websitesWithComments);
      
      // Save to localStorage as backup when API succeeds
      if (fallbackToStorage) {
        StorageUtils.saveWebsites(websitesWithComments);
      }
      
      console.log('Successfully loaded data from API:', websitesData.length, 'websites');
    } catch (apiError) {
      console.warn('API request failed, attempting fallback to storage:', apiError);
      
      if (fallbackToStorage) {
        // Fallback to localStorage only if API fails
        const savedWebsites = StorageUtils.loadWebsites();
        if (savedWebsites.length > 0) {
          const websitesWithComments = StorageUtils.updateWebsiteCommentCounts(savedWebsites);
          setWebsites(websitesWithComments);
          console.log('Loaded data from storage fallback:', savedWebsites.length, 'websites');
        } else {
          // Use mock data as last resort
          const { mockWebsites } = await import('../data/mockData');
          const websitesWithComments = StorageUtils.updateWebsiteCommentCounts(mockWebsites);
          setWebsites(websitesWithComments);
          StorageUtils.saveWebsites(websitesWithComments);
          console.log('Loaded mock data as final fallback:', mockWebsites.length, 'websites');
        }
      } else {
        setError('Failed to load data: API unavailable and storage fallback disabled');
      }
    } finally {
      setIsLoading(false);
    }
  }, [fallbackToStorage]);

  // Sync data periodically
  const syncData = useCallback(async () => {
    try {
      const apiData = await apiService.getWebsites();
      const websitesData = Array.isArray(apiData) ? apiData as Website[] : [];
      const websitesWithComments = StorageUtils.updateWebsiteCommentCounts(websitesData);
      setWebsites(websitesWithComments);
      
      // Also save to localStorage as backup
      if (fallbackToStorage) {
        StorageUtils.saveWebsites(websitesWithComments);
      }
    } catch (error) {
      console.warn('Failed to sync data:', error);
    }
  }, [fallbackToStorage]);

  // WebSocket message handlers
  const handleWebsiteUpdate = useCallback((data: any) => {
    if (data && typeof data === 'object' && data.id) {
      // Update frontend state
      setWebsites(prev => 
        prev.map(website => 
          website.id === data.id ? { ...website, ...data } : website
        )
      );
      
      // Also update localStorage immediately
      if (fallbackToStorage) {
        const currentWebsites = StorageUtils.loadWebsites();
        const updatedWebsites = currentWebsites.map(website => 
          website.id === data.id ? { ...website, ...data } : website
        );
        StorageUtils.saveWebsites(updatedWebsites);
        console.log('Updated website in localStorage via WebSocket:', data.id);
      }
    }
  }, [fallbackToStorage]);

  const handleWebsiteCreate = useCallback((data: any) => {
    if (data && typeof data === 'object' && data.id) {
      const newWebsite = data as Website;
      // Update frontend state
      setWebsites(prev => [newWebsite, ...prev]);
      
      // Also add to localStorage immediately
      if (fallbackToStorage) {
        const currentWebsites = StorageUtils.loadWebsites();
        const updatedWebsites = [newWebsite, ...currentWebsites];
        StorageUtils.saveWebsites(updatedWebsites);
        console.log('Added new website to localStorage via WebSocket:', data.id);
      }
    }
  }, [fallbackToStorage]);

  const handleWebsiteDelete = useCallback((data: any) => {
    if (data && typeof data === 'object' && data.id) {
      // Update frontend state
      setWebsites(prev => prev.filter(website => website.id !== data.id));
      
      // Also remove from localStorage immediately
      if (fallbackToStorage) {
        const currentWebsites = StorageUtils.loadWebsites();
        const updatedWebsites = currentWebsites.filter(website => website.id !== data.id);
        StorageUtils.saveWebsites(updatedWebsites);
        console.log('Deleted website from localStorage via WebSocket:', data.id);
      }
    }
  }, [fallbackToStorage]);

  const handleCommentUpdate = useCallback((data: any) => {
    if (data && typeof data === 'object' && data.websiteId && typeof data.commentCount === 'number') {
      setWebsites(prev => 
        prev.map(website => 
          website.id === data.websiteId 
            ? { ...website, commentCount: data.commentCount }
            : website
        )
      );
    }
  }, []);

  // Initialize WebSocket connection
  useEffect(() => {
    if (!enableWebSocket) return;

    const connectWebSocket = () => {
      websocketService.connect({
        onConnect: () => {
          console.log('Real-time connection established');
          setIsConnected(true);
          setError(null);
        },
        onDisconnect: () => {
          console.log('Real-time connection lost');
          setIsConnected(false);
        },
        onError: (error) => {
          console.error('WebSocket error:', error);
          setError('Real-time connection error');
          setIsConnected(false);
        }
      });
    };

    connectWebSocket();

    // Subscribe to WebSocket events
    const unsubscribeUpdate = websocketService.subscribe('website:update', handleWebsiteUpdate);
    const unsubscribeCreate = websocketService.subscribe('website:create', handleWebsiteCreate);
    const unsubscribeDelete = websocketService.subscribe('website:delete', handleWebsiteDelete);
    const unsubscribeComment = websocketService.subscribe('comment:update', handleCommentUpdate);

    return () => {
      unsubscribeUpdate();
      unsubscribeCreate();
      unsubscribeDelete();
      unsubscribeComment();
      websocketService.disconnect();
    };
  }, [enableWebSocket, handleWebsiteUpdate, handleWebsiteCreate, handleWebsiteDelete, handleCommentUpdate]);

  // Set up periodic sync
  useEffect(() => {
    if (syncInterval > 0) {
      syncIntervalRef.current = setInterval(syncData, syncInterval);
      return () => {
        if (syncIntervalRef.current) {
          clearInterval(syncIntervalRef.current);
        }
      };
    }
  }, [syncData, syncInterval]);

  // Load initial data on mount
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // API methods that also emit WebSocket events
  const createWebsite = useCallback(async (website: Omit<Website, 'id'>) => {
    try {
      const newWebsite = await apiService.createWebsite(website) as Website;
      
      // Optimistically update local state
      setWebsites(prev => [newWebsite, ...prev]);
      
      // Save to localStorage as backup
      if (fallbackToStorage) {
        const updatedWebsites = [newWebsite, ...websites];
        StorageUtils.saveWebsites(updatedWebsites);
      }
      
      return newWebsite;
    } catch (error) {
      console.error('Failed to create website:', error);
      throw error;
    }
  }, [websites, fallbackToStorage]);

  const updateWebsite = useCallback(async (id: string, updates: Partial<Website>) => {
    try {
      const updatedWebsite = await apiService.updateWebsite(id, updates) as Partial<Website>;
      
      // Optimistically update local state
      setWebsites(prev => 
        prev.map(website => 
          website.id === id ? { ...website, ...updatedWebsite } : website
        )
      );
      
      // Save to localStorage as backup
      if (fallbackToStorage) {
        const updatedWebsites = websites.map(website => 
          website.id === id ? { ...website, ...updatedWebsite } : website
        );
        StorageUtils.saveWebsites(updatedWebsites);
      }
      
      return updatedWebsite;
    } catch (error) {
      console.error('Failed to update website:', error);
      throw error;
    }
  }, [websites, fallbackToStorage]);

  const deleteWebsite = useCallback(async (id: string) => {
    try {
      await apiService.deleteWebsite(id);
      
      // Optimistically update local state
      setWebsites(prev => prev.filter(website => website.id !== id));
      
      // Save to localStorage as backup
      if (fallbackToStorage) {
        const updatedWebsites = websites.filter(website => website.id !== id);
        StorageUtils.saveWebsites(updatedWebsites);
      }
    } catch (error) {
      console.error('Failed to delete website:', error);
      throw error;
    }
  }, [websites, fallbackToStorage]);

  return {
    websites,
    isLoading,
    isConnected,
    error,
    createWebsite,
    updateWebsite,
    deleteWebsite,
    syncData,
    loadInitialData
  };
};
