import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { UserPlus, Upload, LayoutGrid, List, Users, Loader2, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Contact, Tag } from '../types';
import ContactTable from '../components/contacts/ContactTable';
import ContactCard from '../components/contacts/ContactCard';
import FilterBar from '../components/contacts/FilterBar';
import BulkActionBar from '../components/contacts/BulkActionBar';
import ContactDrawer from '../components/contacts/ContactDrawer';
import ImportModal from '../components/contacts/ImportModal';
import ExportDropdown from '../components/contacts/ExportDropdown';
import { crmApi } from '../services/crmApi';
import { TableSkeleton, CardSkeleton } from '../components/ui/Skeleton';
import { toast } from '../components/ui/Toast';

export default function Contacts() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get('search') || '';

  // State
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isTagsLoading, setIsTagsLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<{ id: number | string; name: string }[]>([]);
  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedEmailStatus, setSelectedEmailStatus] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [lastTouchpoint, setLastTouchpoint] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [pagination, setPagination] = useState<{
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
  } | null>(null);
  
  // Modals/Drawers State
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [viewingContact, setViewingContact] = useState<Contact | null>(null);

  // Fetch Data
  const fetchData = async (
    search?: string, 
    tag?: string, 
    status?: string, 
    touch?: string, 
    cat?: string,
    emailStat?: string,
    camp?: string,
    page?: number, 
    per?: number
  ) => {
    setIsLoading(true);
    try {
      const contactsData = await crmApi.getContacts({ 
        search: search !== undefined ? search : searchQuery,
        tag: tag !== undefined ? tag : selectedTag,
        status: status !== undefined ? status : selectedStatus,
        lastTouchpoint: touch !== undefined ? touch : lastTouchpoint,
        category_id: cat !== undefined ? cat : selectedCategory,
        email_status: emailStat !== undefined ? emailStat : selectedEmailStatus,
        campaign_id: camp !== undefined ? camp : selectedCampaign,
        page: page !== undefined ? page : (page === undefined ? currentPage : page),
        perPage: per !== undefined ? per : perPage
      }, {
        headers: { 'X-Skip-Loader': 'true' }
      });
      setContacts(contactsData);
      
      if (contactsData.pagination) {
        setPagination(contactsData.pagination);
      } else {
        setPagination({
          currentPage: 1,
          lastPage: 1,
          perPage: contactsData.length,
          total: contactsData.length
        });
      }
    } catch (error) {
      console.error('Failed to fetch contacts', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || (pagination && newPage > pagination.lastPage)) return;
    setCurrentPage(newPage);
    fetchData(searchQuery, selectedTag, selectedStatus, lastTouchpoint, selectedCategory, selectedEmailStatus, selectedCampaign, newPage);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedTag('');
    setSelectedStatus('');
    setLastTouchpoint('');
    setSelectedCategory('');
    setSelectedEmailStatus('');
    setSelectedCampaign('');
    fetchData('', '', '', '', '', '', '', 1);
  };

  const fetchTagsAndCategories = async () => {
    setIsTagsLoading(true);
    try {
      const [tagsData, categoriesData] = await Promise.all([
        crmApi.getTags({ headers: { 'X-Skip-Loader': 'true' } }).catch(() => []),
        crmApi.getCategories().catch(() => [])
      ]);
      setTags(tagsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Failed to fetch tags/categories', error);
    } finally {
      setIsTagsLoading(false);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const res = await crmApi.getCampaigns().catch(async () => {
        // Fallback to emailCampaignApi
        const { emailCampaignApi } = await import('../services/emailCampaignApi');
        const cRes = await emailCampaignApi.getCampaigns();
        return cRes.data || cRes || [];
      });
      const list = Array.isArray(res) ? res : (res?.data || []);
      setCampaigns(list.map((c: any) => ({ id: c.id, name: c.name || `Campaign #${c.id}` })));
    } catch (e) {
      // ignore
    }
  };

  // Fetch Tags, Categories, Campaigns and Initial Data on mount
  useEffect(() => {
    fetchTagsAndCategories();
    fetchCampaigns();
  }, []);

  // Sync state with URL search parameters
  useEffect(() => {
    const query = searchParams.get('search') || '';
    if (query !== searchQuery) {
      setSearchQuery(query);
    }
  }, [searchParams]);

  // Live Search & Filter updates
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchData(searchQuery, selectedTag, selectedStatus, lastTouchpoint, selectedCategory, selectedEmailStatus, selectedCampaign, 1);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedTag, selectedStatus, lastTouchpoint, selectedCategory, selectedEmailStatus, selectedCampaign]);

  const displayTags = useMemo(() => {
    return Array.isArray(tags) ? tags : [];
  }, [tags]);

  // Filtering Logic (Local fallback if needed, but primary is server-side now)
  const filteredContacts = contacts;

  // Handlers
  const handleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredContacts.length && filteredContacts.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredContacts.map(c => c.id));
    }
  };

  const handleDeleteContact = async (id: string | number) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;
    try {
      await crmApi.deleteContact(id);
      setContacts(prev => prev.filter(c => String(c.id) !== String(id)));
      setViewingContact(null);
      setSelectedIds(prev => prev.filter(i => String(i) !== String(id)));
      toast.success('Contact Deleted', 'The contact has been removed successfully.');
      fetchData();
    } catch (error: any) {
      console.error('Failed to delete contact', error);
      toast.error('Delete Failed', error?.response?.data?.message || error.message || 'Error deleting contact.');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} selected contacts?`)) return;
    try {
      await crmApi.batchDeleteContacts(selectedIds);
      const strIds = selectedIds.map(String);
      setContacts(prev => prev.filter(c => !strIds.includes(String(c.id))));
      setSelectedIds([]);
      toast.success('Contacts Deleted', `${selectedIds.length} contacts removed successfully.`);
      fetchData();
    } catch (error: any) {
      console.error('Failed to delete contacts', error);
      toast.error('Bulk Delete Failed', error?.response?.data?.message || error.message || 'Failed to delete selected contacts.');
    }
  };

  const handleImport = () => {
    fetchData();
    setIsImportOpen(false);
  };

  const handleExport = (format: string) => {
    const dataToExport = filteredContacts.length > 0 ? filteredContacts : contacts;
    const jsonString = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `contacts-export-${new Date().toISOString().split('T')[0]}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#F0FDF4] text-[#166534] border border-[#22C55E]/30 rounded-xl flex items-center justify-center shadow-sm">
            <Users size={24} strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#12263A] tracking-tight">Contacts</h1>
            <p className="text-xs font-medium text-[#57534E] mt-0.5">
              Manage, segment, and engage your audience across all channels
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex bg-stone-100 p-1 rounded-xl gap-0.5">
            <button 
              onClick={() => setViewMode('table')}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${viewMode === 'table' ? 'bg-[#166534] text-white shadow-xs' : 'text-stone-400 hover:text-[#12263A] hover:bg-stone-200/50'}`}
              title="Table view"
            >
              <List size={18} />
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${viewMode === 'grid' ? 'bg-[#166534] text-white shadow-xs' : 'text-stone-400 hover:text-[#12263A] hover:bg-stone-200/50'}`}
              title="Grid view"
            >
              <LayoutGrid size={18} />
            </button>
          </div>

          <button 
            onClick={() => setIsImportOpen(true)}
            className="h-10 px-4 bg-white border border-slate-200 hover:border-[#bbf7d0] rounded-xl text-xs sm:text-sm font-semibold text-[#57534E] hover:text-[#166534] hover:bg-[#F0FDF4] transition-all shadow-xs active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <Upload size={16} /> 
            <span>Import</span>
          </button>
          
          <ExportDropdown onExport={handleExport} />

          <button 
            onClick={() => navigate('/contacts/add')}
            className="h-10 px-5 bg-[#166534] hover:bg-[#14532d] text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm hover:shadow-[#166534]/15 active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <UserPlus size={17} /> 
            <span>Add Contact</span>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8">
        {/* Main Content: Table & Filters */}
        <main className="col-span-12 space-y-6">
          <div className="bg-white border border-stone-200 rounded-xl shadow-sm p-4">
            <FilterBar 
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedTag={selectedTag}
              onTagChange={setSelectedTag}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              categories={categories}
              selectedEmailStatus={selectedEmailStatus}
              onEmailStatusChange={setSelectedEmailStatus}
              selectedCampaign={selectedCampaign}
              onCampaignChange={setSelectedCampaign}
              campaigns={campaigns}
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
              lastTouchpoint={lastTouchpoint}
              onTouchpointChange={setLastTouchpoint}
              tags={displayTags}
              onApplyFilters={() => fetchData()}
              onResetFilters={handleResetFilters}
            />
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative min-h-[500px]"
          >
            {isLoading ? (
              viewMode === 'table' ? (
                <TableSkeleton rows={perPage} cols={5} />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <CardSkeleton key={idx} />
                  ))}
                </div>
              )
            ) : viewMode === 'table' ? (
              <ContactTable 
                contacts={filteredContacts}
                availableTags={displayTags}
                selectedIds={selectedIds}
                onSelect={handleSelect}
                onSelectAll={handleSelectAll}
                onView={setViewingContact}
                onDelete={handleDeleteContact}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredContacts.map(contact => (
                  <ContactCard 
                    key={contact.id}
                    contact={contact}
                    availableTags={displayTags}
                    selected={selectedIds.includes(contact.id)}
                    onSelect={handleSelect}
                    onView={setViewingContact}
                  />
                ))}
              </div>
            )}
            
            {/* Pagination Controls */}
            {pagination && pagination.lastPage > 1 && (
              <div className="mt-6 bg-white border border-stone-200 rounded-xl px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                <span className="text-xs font-semibold text-[#57534E]">
                  Showing <strong className="text-[#12263A]">{(pagination.currentPage - 1) * pagination.perPage + 1}</strong> to{' '}
                  <strong className="text-[#12263A]">
                    {Math.min(pagination.currentPage * pagination.perPage, pagination.total)}
                  </strong>{' '}
                  of <strong className="text-[#12263A]">{pagination.total}</strong> entries
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="w-8.5 h-8.5 rounded-xl border border-slate-200 bg-white hover:bg-[#F0FDF4] hover:text-[#166534] hover:border-[#bbf7d0] disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center cursor-pointer text-[#57534E] transition-all active:scale-95 shadow-xs"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  
                  {(() => {
                    const pages = [];
                    const maxVisiblePages = 5;
                    let startPage = Math.max(1, currentPage - 2);
                    let endPage = Math.min(pagination.lastPage, startPage + maxVisiblePages - 1);
                    
                    if (endPage - startPage + 1 < maxVisiblePages) {
                      startPage = Math.max(1, endPage - maxVisiblePages + 1);
                    }

                    if (startPage > 1) {
                      pages.push(
                        <button
                          key={1}
                          onClick={() => handlePageChange(1)}
                          className="w-8.5 h-8.5 rounded-xl border text-xs font-bold transition-all active:scale-95 border-slate-200 bg-white hover:bg-[#F0FDF4] hover:text-[#166534] hover:border-[#bbf7d0] text-[#57534E] shadow-xs cursor-pointer"
                        >
                          1
                        </button>
                      );
                      if (startPage > 2) {
                        pages.push(<span key="dots-start" className="text-stone-400 px-1 text-xs select-none">...</span>);
                      }
                    }

                    for (let p = startPage; p <= endPage; p++) {
                      pages.push(
                        <button
                          key={p}
                          onClick={() => handlePageChange(p)}
                          className={`w-8.5 h-8.5 rounded-xl border text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-xs ${
                            currentPage === p
                              ? 'bg-[#166534] border-[#166534] text-white'
                              : 'border-slate-200 bg-white hover:bg-[#F0FDF4] hover:text-[#166534] hover:border-[#bbf7d0] text-[#57534E]'
                          }`}
                        >
                          {p}
                        </button>
                      );
                    }

                    if (endPage < pagination.lastPage) {
                      if (endPage < pagination.lastPage - 1) {
                        pages.push(<span key="dots-end" className="text-stone-400 px-1 text-xs select-none">...</span>);
                      }
                      pages.push(
                        <button
                          key={pagination.lastPage}
                          onClick={() => handlePageChange(pagination.lastPage)}
                          className="w-8.5 h-8.5 rounded-xl border text-xs font-bold transition-all active:scale-95 border-slate-200 bg-white hover:bg-[#F0FDF4] hover:text-[#166534] hover:border-[#bbf7d0] text-[#57534E] shadow-xs cursor-pointer"
                        >
                          {pagination.lastPage}
                        </button>
                      );
                    }

                    return pages;
                  })()}

                  <button
                    disabled={currentPage === pagination.lastPage}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="w-8.5 h-8.5 rounded-xl border border-slate-200 bg-white hover:bg-[#F0FDF4] hover:text-[#166534] hover:border-[#bbf7d0] disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center cursor-pointer text-[#57534E] transition-all active:scale-95 shadow-xs"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
            
            {/* View Stats Footer */}
            <div className="mt-6 flex items-center justify-between px-2">
               <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                     <Users size={14} className="text-[#166534]" />
                     <span className="text-[11px] font-bold text-[#57534E] uppercase tracking-wider">
                       Contacts: {pagination?.total ?? filteredContacts.length}
                     </span>
                  </div>
                  <div className="flex items-center gap-2">
                     <Star size={14} className="text-[#22C55E]" />
                     <span className="text-[11px] font-bold text-[#57534E] uppercase tracking-wider">Target Reach: 92%</span>
                  </div>
               </div>
               <div className="flex items-center gap-4">
                  <button onClick={() => handleExport('csv')} className="text-[11px] font-bold text-[#12263A] hover:text-[#166534] hover:underline uppercase tracking-wider transition-colors">Download Export</button>
                  <div className="w-1 h-1 rounded-full bg-stone-300" />
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">North Region</span>
               </div>
            </div>
          </motion.div>
        </main>
      </div>

      {/* Overlays */}
      <BulkActionBar 
        selectedCount={selectedIds.length}
        onClear={() => setSelectedIds([])}
        onDelete={handleBulkDelete}
        onAddTag={(tagId) => {
          setContacts(prev => prev.map(c => selectedIds.includes(c.id) ? { ...c, tags: Array.from(new Set([...(c.tags || []), tagId])) } : c));
          setSelectedIds([]);
        }}
        availableTags={displayTags}
      />

      <ContactDrawer 
        contact={viewingContact}
        isOpen={!!viewingContact}
        onClose={() => setViewingContact(null)}
        onEdit={(contact) => {
          navigate(`/contacts/edit/${contact.id}`);
          setViewingContact(null);
        }}
        onDelete={handleDeleteContact}
        availableTags={displayTags}
      />

      <ImportModal 
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImport={handleImport}
      />
    </div>
  );
}
