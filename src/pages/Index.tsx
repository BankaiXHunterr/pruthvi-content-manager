import React, { useState, useMemo, useEffect } from 'react';
import Header from '../components/Header';
import FilterBar from '../components/FilterBar';
import WebsiteCard, { Website } from '../components/WebsiteCard';
import EditModal from '../components/EditModal';
import CommentatorModal from '../components/CommentatorModal';
import CreateModal from '../components/CreateModal';
import BackendConfig from '../components/BackendConfig';
import Toast from '../components/Toast';
import LoadingCard from '../components/LoadingCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { useRealTimeData } from '../hooks/useRealTimeData';
import { useAuth } from '../contexts/AuthContext';
import { ROLE_PERMISSIONS } from '../types/auth';
import { WebsiteStatus, CommentThread } from '../types/auth';

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedWebsite, setSelectedWebsite] = useState<Website | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
    isVisible: boolean;
  }>({
    message: '',
    type: 'success',
    isVisible: false
  });

  const { user } = useAuth();
  
  // Use real-time data hook
  const {
    websites,
    isLoading,
    isConnected,
    error,
    createWebsite,
    updateWebsite,
    deleteWebsite,
    syncData,
    loadInitialData
  } = useRealTimeData({
    enableWebSocket: true,
    fallbackToStorage: true,
    syncInterval: 30000
  });

  // Filter websites based on search and status
  const filteredWebsites = useMemo(() => {
    return websites.filter(website => {
      const matchesSearch = website.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          website.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          website.content.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || website.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [websites, searchTerm, statusFilter]);

  const handleEdit = (website: Website) => {
    setSelectedWebsite(website);
    setIsModalOpen(true);
  };

  const handleViewComments = (website: Website) => {
    setSelectedWebsite(website);
    setIsCommentsModalOpen(true);
  };

  const handleDelete = async (website: Website) => {
    if (!user) return;
    
    const permissions = ROLE_PERMISSIONS[user.role];
    if (!permissions.canDelete || website.status !== 'draft') {
      showToast('You can only delete draft websites', 'error');
      return;
    }

    try {
      await deleteWebsite(website.id);
      showToast(`Project "${website.name}" deleted successfully`, 'success');
    } catch (error) {
      showToast('Failed to delete project', 'error');
    }
  };

  const handleApprove = async (website: Website) => {
    if (!user) return;
    
    const permissions = ROLE_PERMISSIONS[user.role];
    if (!permissions.canApprove) {
      showToast('You do not have permission to approve websites', 'error');
      return;
    }

    try {
      await updateWebsite(website.id, {
        status: 'compliance-approved' as WebsiteStatus,
        lastUpdated: new Date().toLocaleDateString('en-GB')
      });
      showToast(`Project "${website.name}" approved successfully`, 'success');
    } catch (error) {
      showToast('Failed to approve project', 'error');
    }
  };

  const handleDownload = (website: Website) => {
    if (!user) return;
    
    const permissions = ROLE_PERMISSIONS[user.role];
    if (!permissions.canDownload) {
      showToast('You do not have permission to download', 'error');
      return;
    }

    if (website.status !== 'compliance-approved' && website.status !== 'ready-for-deployment' && website.status !== 'deployed' && website.status !== 'in-production') {
      showToast('Only approved websites can be downloaded', 'error');
      return;
    }

    // Create ZIP package
    const { StorageUtils } = require('../utils/storage');
    const zipBlob = StorageUtils.createZipPackage(website);
    const fileName = `${website.name.toLowerCase().replace(/\s+/g, '-')}-approved-package.json`;
    
    const url = URL.createObjectURL(zipBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showToast(`Downloaded compliance package for ${website.name}`, 'success');
  };

  const handleSave = async (website: Website, newContent: string) => {
    if (!user) return;

    const permissions = ROLE_PERMISSIONS[user.role];
    if (!permissions.canEdit) {
      showToast('You do not have permission to edit', 'error');
      return;
    }

    let newStatus: WebsiteStatus = website.status;
    
    // Auto-update status based on role
    if (user.role === 'marketing-reviewer' && website.status === 'draft') {
      newStatus = 'marketing-review-completed';
    }

    try {
      await updateWebsite(website.id, {
        content: newContent,
        status: newStatus,
        lastUpdated: new Date().toLocaleDateString('en-GB')
      });
      showToast(`Content updated successfully for ${website.name}`, 'success');
    } catch (error) {
      showToast('Failed to update content', 'error');
    }
  };

  const handleCreateProject = async (newWebsite: Omit<Website, 'id'>) => {
    if (!user) return;
    
    const permissions = ROLE_PERMISSIONS[user.role];
    if (!permissions.canCreate) {
      showToast('You do not have permission to create projects', 'error');
      return;
    }

    const website: Omit<Website, 'id'> = {
      ...newWebsite,
      status: 'draft',
      commentCount: 0
    };
    
    try {
      await createWebsite(website);
      showToast(`Project "${website.name}" created successfully`, 'success');
    } catch (error) {
      showToast('Failed to create project', 'error');
    }
  };

  const handleLogout = () => {
    showToast('Logged out successfully', 'success');
  };

  const handleDeploy = async (website: Website, deployUrl?: string) => {
    if (!user) return;
    
    const permissions = ROLE_PERMISSIONS[user.role];
    if (!permissions.canDeploy) {
      showToast('You do not have permission to deploy websites', 'error');
      return;
    }

    if (website.status !== 'compliance-approved' && website.status !== 'ready-for-deployment') {
      showToast('Only compliance-approved websites can be deployed', 'error');
      return;
    }

    try {
      const updateData: Partial<Website> = {
        status: 'deployed' as WebsiteStatus,
        lastUpdated: new Date().toLocaleDateString('en-GB')
      };

      if (deployUrl) {
        updateData.url = deployUrl;
      }

      await updateWebsite(website.id, updateData);
      showToast(`Project "${website.name}" deployed successfully`, 'success');
    } catch (error) {
      showToast('Failed to deploy project', 'error');
    }
  };

  const handleStatusUpdate = async (website: Website, newStatus: WebsiteStatus, thread?: CommentThread) => {
    try {
      await updateWebsite(website.id, {
        status: newStatus,
        lastUpdated: new Date().toLocaleDateString('en-GB')
      });

      let statusMessage = '';
      switch (newStatus) {
        case 'marketing-review-in-progress':
          statusMessage = thread ? 'sent back for marketing review' : 'moved to marketing review';
          break;
        case 'marketing-review-completed':
          statusMessage = 'marketing review completed';
          break;
        case 'ready-for-compliance-review':
          statusMessage = 'submitted for compliance review';
          break;
        case 'compliance-approved':
          statusMessage = 'approved by compliance';
          break;
        case 'ready-for-deployment':
          statusMessage = 'marked as ready for deployment';
          break;
        case 'deployed':
          statusMessage = 'deployed';
          break;
        case 'in-production':
          statusMessage = 'marked as in production';
          break;
        default:
          statusMessage = 'status updated';
      }

      showToast(`Project "${website.name}" ${statusMessage}`, 'success');

      if (thread) {
        showToast(`New review thread created for "${website.name}"`, 'success');
      }
    } catch (error) {
      showToast('Failed to update status', 'error');
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  const handleCommentsModalClose = () => {
    setIsCommentsModalOpen(false);
  };

  const handleManualSync = async () => {
    try {
      await syncData();
      showToast('Data synchronized successfully', 'success');
    } catch (error) {
      showToast('Failed to synchronize data', 'error');
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onLogout={handleLogout} />
      
      <FilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onCreateClick={() => setIsCreateModalOpen(true)}
      />

      {/* Real-time status bar - only shown in development */}
      {!import.meta.env.PROD && (
        <div className="px-4 py-2 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {isConnected ? (
                  <Wifi className="h-4 w-4 text-green-600" />
                ) : (
                  <WifiOff className="h-4 w-4 text-red-600" />
                )}
                <Badge 
                  className={isConnected 
                    ? "bg-green-100 text-green-800" 
                    : "bg-red-100 text-red-800"
                  }
                >
                  {isConnected ? 'Real-time Connected' : 'Offline Mode'}
                </Badge>
              </div>
              
              {error && (
                <Badge className="bg-yellow-100 text-yellow-800">
                  {error}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={handleManualSync}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Sync
              </Button>
              <Button
                onClick={() => setIsConfigModalOpen(true)}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Backend Config
              </Button>
            </div>
          </div>
        </div>
      )}

      <main className="px-4 py-6 lg:px-6">
        {isLoading ? (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {Array.from({ length: 8 }).map((_, index) => (
              <LoadingCard key={index} />
            ))}
          </div>
        ) : filteredWebsites.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto max-w-md">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-12 w-12"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="mt-2 text-lg font-semibold text-gray-900">
                No content available
              </h3>
              <p className="mt-1 text-gray-500">
                {searchTerm || statusFilter !== 'all'
                  ? 'No websites match your current filters.'
                  : 'No marketing content has been added yet.'}
              </p>
            </div>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {filteredWebsites.map((website) => (
              <WebsiteCard
                key={website.id}
                website={website}
                onEdit={handleEdit}
                onViewComments={handleViewComments}
                onDownload={handleDownload}
                onDelete={handleDelete}
                onApprove={handleApprove}
                onDeploy={handleDeploy}
                onStatusUpdate={handleStatusUpdate}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}
      </main>

      <EditModal
        website={selectedWebsite}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />

      <CommentatorModal
        website={selectedWebsite}
        isOpen={isCommentsModalOpen}
        onClose={handleCommentsModalClose}
      />

      <CreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateProject}
      />

      {/* Backend Configuration Modal */}
      {isConfigModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Backend Configuration</h2>
                <Button
                  onClick={() => setIsConfigModalOpen(false)}
                  variant="outline"
                  size="sm"
                >
                  Close
                </Button>
              </div>
              <BackendConfig onConfigChange={loadInitialData} />
            </div>
          </div>
        </div>
      )}

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
};

export default Index;
