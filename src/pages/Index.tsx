
import React, { useState, useMemo, useEffect } from 'react';
import Header from '../components/Header';
import FilterBar from '../components/FilterBar';
import WebsiteCard, { Website } from '../components/WebsiteCard';
import EditModal from '../components/EditModal';
import CommentatorModal from '../components/CommentatorModal';
import CreateModal from '../components/CreateModal';
import Toast from '../components/Toast';
import LoadingCard from '../components/LoadingCard';
import { mockWebsites } from '../data/mockData';
import { StorageUtils } from '../utils/storage';
import { useAuth } from '../contexts/AuthContext';
import { ROLE_PERMISSIONS } from '../types/auth';
import { WebsiteStatus } from '../types/auth';

const Index = () => {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedWebsite, setSelectedWebsite] = useState<Website | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

  // Load websites from localStorage on component mount
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      const savedWebsites = StorageUtils.loadWebsites();
      if (savedWebsites.length > 0) {
        const websitesWithComments = StorageUtils.updateWebsiteCommentCounts(savedWebsites);
        setWebsites(websitesWithComments);
      } else {
        const websitesWithComments = StorageUtils.updateWebsiteCommentCounts(mockWebsites);
        setWebsites(websitesWithComments);
        StorageUtils.saveWebsites(websitesWithComments);
      }
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Save websites to localStorage whenever websites state changes
  useEffect(() => {
    if (websites.length > 0) {
      StorageUtils.saveWebsites(websites);
    }
  }, [websites]);

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

  const handleDelete = (website: Website) => {
    if (!user) return;
    
    const permissions = ROLE_PERMISSIONS[user.role];
    if (!permissions.canDelete || website.status !== 'draft') {
      showToast('You can only delete draft websites', 'error');
      return;
    }

    setWebsites(prev => prev.filter(w => w.id !== website.id));
    showToast(`Project "${website.name}" deleted successfully`, 'success');
  };

  const handleApprove = (website: Website) => {
    if (!user) return;
    
    const permissions = ROLE_PERMISSIONS[user.role];
    if (!permissions.canApprove) {
      showToast('You do not have permission to approve websites', 'error');
      return;
    }

    setWebsites(prev => 
      prev.map(w => 
        w.id === website.id 
          ? { ...w, status: 'compliance-approved' as WebsiteStatus, lastUpdated: new Date().toLocaleDateString('en-GB') }
          : w
      )
    );

    showToast(`Project "${website.name}" approved successfully`, 'success');
  };

  const handleDownload = (website: Website) => {
    if (!user) return;
    
    const permissions = ROLE_PERMISSIONS[user.role];
    if (!permissions.canDownload) {
      showToast('You do not have permission to download', 'error');
      return;
    }

    if (website.status !== 'compliance-approved') {
      showToast('Only compliance-approved websites can be downloaded', 'error');
      return;
    }

    // Create ZIP package
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

  const handleSave = (website: Website, newContent: string) => {
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

    setWebsites(prev => 
      prev.map(w => 
        w.id === website.id 
          ? { 
              ...w, 
              content: newContent, 
              status: newStatus,
              lastUpdated: new Date().toLocaleDateString('en-GB') 
            }
          : w
      )
    );

    showToast(`Content updated successfully for ${website.name}`, 'success');
  };

  const handleCreateProject = (newWebsite: Omit<Website, 'id'>) => {
    if (!user) return;
    
    const permissions = ROLE_PERMISSIONS[user.role];
    if (!permissions.canCreate) {
      showToast('You do not have permission to create projects', 'error');
      return;
    }

    const website: Website = {
      ...newWebsite,
      id: Date.now().toString(),
      status: 'draft',
      commentCount: 0
    };
    
    setWebsites(prev => [website, ...prev]);
    showToast(`Project "${website.name}" created successfully`, 'success');
  };

  const handleLogout = () => {
    showToast('Logged out successfully', 'success');
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  const handleCommentsModalClose = () => {
    setIsCommentsModalOpen(false);
    const updatedWebsites = StorageUtils.updateWebsiteCommentCounts(websites);
    setWebsites(updatedWebsites);
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
