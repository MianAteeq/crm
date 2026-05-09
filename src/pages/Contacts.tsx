import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Upload, LayoutGrid, List, Users, Loader2, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { contacts as mockContacts, Contact, Tag } from '../data/contactsMock';
import ContactTable from '../components/contacts/ContactTable';
import ContactCard from '../components/contacts/ContactCard';
import FilterBar from '../components/contacts/FilterBar';
import BulkActionBar from '../components/contacts/BulkActionBar';
import ContactDrawer from '../components/contacts/ContactDrawer';
import ImportModal from '../components/contacts/ImportModal';
import ExportDropdown from '../components/contacts/ExportDropdown';
import { crmApi } from '../services/crmApi';

export default function Contacts() {
  const navigate = useNavigate();
  // State
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isTagsLoading, setIsTagsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [lastTouchpoint, setLastTouchpoint] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  
  // Modals/Drawers State
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [viewingContact, setViewingContact] = useState<Contact | null>(null);

  // Fetch Data
  const fetchData = async (search?: string, tag?: string, status?: string, touch?: string) => {
    setIsLoading(true);
    try {
      const contactsData = await crmApi.getContacts({ 
        search: search !== undefined ? search : searchQuery,
        tag: tag !== undefined ? tag : selectedTag,
        status: status !== undefined ? status : selectedStatus,
        lastTouchpoint: touch !== undefined ? touch : lastTouchpoint
      });
      setContacts(contactsData);
    } catch (error) {
      console.error('Failed to fetch contacts', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedTag('');
    setSelectedStatus('');
    setLastTouchpoint('');
    fetchData('', '', '', '');
  };

  const fetchTags = async () => {
    setIsTagsLoading(true);
    try {
      const tagsData = await crmApi.getTags();
      setTags(tagsData);
    } catch (error) {
      console.error('Failed to fetch tags', error);
    } finally {
      setIsTagsLoading(false);
    }
  };

  // Fetch Tags and Initial Data on mount
  useEffect(() => {
    fetchTags();
  }, []);

  // Live Search & Filter updates
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedTag, selectedStatus, lastTouchpoint]);

  const displayTags = useMemo(() => {
    if (Array.isArray(tags) && tags.length > 0) return tags;
    // Fallback static tags if API returns nothing but still want objects
    return [
      { id: '1', name: 'VIP', color: '#8b5cf6' },
      { id: '2', name: 'Eid Promo', color: '#f59e0b' },
      { id: '3', name: 'New Customer', color: '#10b981' },
      { id: '4', name: 'Wholesale', color: '#3b82f6' },
      { id: '5', name: 'Complaint', color: '#ef4444' },
      { id: '6', name: 'Inactive', color: '#64748b' }
    ];
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

  const handleDeleteContact = async (id: string) => {
    try {
      await crmApi.deleteContact(id);
      setContacts(prev => prev.filter(c => c.id !== id));
      setViewingContact(null);
      setSelectedIds(prev => prev.filter(i => i !== id));
    } catch (error) {
      console.error('Failed to delete contact', error);
      alert('Error deleting contact.');
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selectedIds.map(id => crmApi.deleteContact(id)));
      setContacts(prev => prev.filter(c => !selectedIds.includes(c.id)));
      setSelectedIds([]);
    } catch (error) {
      console.error('Failed to delete contacts', error);
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
    <div className="space-y-6">
      {/* Page Header */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-100 text-slate-900 rounded-xl flex items-center justify-center shadow-sm">
            <Users size={24} strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Audience CRM</h1>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-0.5">
              Targeted Segmentation & Management
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <List size={20} />
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <LayoutGrid size={20} />
            </button>
          </div>

          <button 
            onClick={() => setIsImportOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
          >
            <Upload size={16} /> 
            <span>Import</span>
          </button>
          
          <ExportDropdown onExport={handleExport} />

          <button 
            onClick={() => navigate('/contacts/add')}
            className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-sm"
          >
            <UserPlus size={18} /> 
            <span>Add Contact</span>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8">
        {/* Main Content: Table & Filters */}
        <main className="col-span-12 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4">
            <FilterBar 
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedTag={selectedTag}
              onTagChange={setSelectedTag}
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
              <div className="flex flex-col items-center justify-center h-[500px] text-slate-400">
                <Loader2 size={32} className="animate-spin mb-4" />
                <p className="text-sm font-bold uppercase tracking-widest">Loading Audience...</p>
              </div>
            ) : viewMode === 'table' ? (
              <ContactTable 
                contacts={filteredContacts}
                availableTags={displayTags}
                selectedIds={selectedIds}
                onSelect={handleSelect}
                onSelectAll={handleSelectAll}
                onView={setViewingContact}
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
            
            {/* View Stats Footer */}
            <div className="mt-6 flex items-center justify-between px-2">
               <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                     <Users size={14} className="text-slate-400" />
                     <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Contacts: {filteredContacts.length}</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <Star size={14} className="text-amber-500" />
                     <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Target Reach: 92%</span>
                  </div>
               </div>
               <div className="flex items-center gap-4">
                  <button onClick={() => handleExport('csv')} className="text-[11px] font-bold text-slate-900 hover:underline uppercase tracking-wider">Download Export</button>
                  <div className="w-1 h-1 rounded-full bg-slate-300" />
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">North Region</span>
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
