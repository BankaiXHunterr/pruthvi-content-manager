
import React, { useState, useMemo } from 'react';
import Header from '../components/Header';
import FilterBar from '../components/FilterBar';
import WebsiteCard, { Website } from '../components/WebsiteCard';
import EditModal from '../components/EditModal';
import CommentatorModal from '../components/CommentatorModal';
import Toast from '../components/Toast';
import LoadingCard from '../components/LoadingCard';
import { mockWebsites } from '../data/mockData';

const Index = () => {
  const [websites, setWebsites] = useState<Website[]>(mockWebsites);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedWebsite, setSelectedWebsite] = useState<Website | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
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

  // Filter websites based on search and status
  const filteredWebsites = useMemo(() => {
    return websites.filter(website => {
      const matchesSearch = website.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          website.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          website.content.toLowerCase().includes(searchTerm.toLowerCase());
      
      let matchesStatus = false;
      switch (statusFilter) {
        case 'all':
          matchesStatus = true;
          break;
        case 'draft':
          matchesStatus = website.status === 'draft';
          break;
        case 'marketing-review':
          matchesStatus = website.status === 'pending';
          break;
        case 'compliance-review':
          matchesStatus = website.status === 'active';
          break;
        case 'ready-deploy':
          matchesStatus = website.status === 'active';
          break;
        default:
          matchesStatus = true;
      }
      
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

  const handleSave = (website: Website, newContent: string) => {
    setWebsites(prev => 
      prev.map(w => 
        w.id === website.id 
          ? { ...w, content: newContent, lastUpdated: new Date().toLocaleDateString('en-GB') }
          : w
      )
    );

    showToast(`Content updated successfully for ${website.name}`, 'success');
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

  // Simulate loading state
  React.useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

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
        onClose={() => setIsCommentsModalOpen(false)}
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
