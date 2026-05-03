import React, { useState, useMemo } from 'react';
import { UserPlus, Upload, LayoutGrid, List, Target, ChevronRight, Hash, Star, Shield, Users, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { contacts as mockContacts, availableTags, Contact, segments as mockSegments } from '../data/contactsMock';
import ContactTable from '../components/contacts/ContactTable';
import ContactCard from '../components/contacts/ContactCard';
import FilterBar from '../components/contacts/FilterBar';
import BulkActionBar from '../components/contacts/BulkActionBar';
import ContactDrawer from '../components/contacts/ContactDrawer';
import ContactForm from '../components/contacts/ContactForm';
import ImportModal from '../components/contacts/ImportModal';
import ExportDropdown from '../components/contacts/ExportDropdown';
import SegmentBuilder from '../components/contacts/SegmentBuilder';

export default function Contacts() {
  // State
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [activeSegment, setActiveSegment] = useState<string | null>(null);
  
  // Modals/Drawers State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isSegmentBuilderOpen, setIsSegmentBuilderOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Partial<Contact> | undefined>();
  const [viewingContact, setViewingContact] = useState<Contact | null>(null);

  // Filtering Logic
  const filteredContacts = useMemo(() => {
    return contacts.filter(contact => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery || 
        contact.name.toLowerCase().includes(searchLower) || 
        contact.phone.includes(searchQuery) ||
        contact.tags.some(t => t.toLowerCase().includes(searchLower));
      
      const matchesTag = !selectedTag || contact.tags.includes(selectedTag);
      
      let matchesSegment = true;
      if (activeSegment === 'Recent Leads') {
        matchesSegment = contact.totalCampaigns === 0;
      } else if (activeSegment === 'High Spenders') {
        matchesSegment = contact.totalCampaigns > 10;
      } else if (activeSegment === 'Inactive 30d') {
        matchesSegment = contact.status === 'inactive';
      }
      
      return matchesSearch && matchesTag && matchesSegment;
    });
  }, [contacts, searchQuery, selectedTag, activeSegment]);

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

  const handleSaveContact = (formData: Partial<Contact>) => {
    if (editingContact?.id) {
      setContacts(prev => prev.map(c => c.id === editingContact.id ? { ...c, ...formData } as Contact : c));
    } else {
      const newContact = {
        ...formData,
        id: Math.random().toString(36).substring(2, 11),
        lastContacted: 'Just now',
        status: 'active',
        totalCampaigns: 0,
        addedDate: new Date().toISOString(),
        campaigns: [],
        tags: formData.tags || []
      } as Contact;
      setContacts(prev => [newContact, ...prev]);
    }
    setIsFormOpen(false);
    setEditingContact(undefined);
  };

  const handleDeleteContact = (id: string) => {
    setContacts(prev => prev.filter(c => c.id !== id));
    setViewingContact(null);
    setSelectedIds(prev => prev.filter(i => i !== id));
  };

  const handleBulkDelete = () => {
    setContacts(prev => prev.filter(c => !selectedIds.includes(c.id)));
    setSelectedIds([]);
  };

  const handleImport = (importedData: any[]) => {
    const newContacts = importedData.map(item => ({
      id: Math.random().toString(36).substring(2, 11),
      name: item.name || 'Unknown',
      phone: item.phone || '',
      email: item.email || '',
      tags: item.tags ? (typeof item.tags === 'string' ? item.tags.split(',') : item.tags) : [],
      status: 'active',
      lastContacted: 'Never',
      totalCampaigns: 0,
      addedDate: new Date().toISOString(),
      campaigns: [],
      company: item.company || '',
      jobTitle: item.jobTitle || '',
      address: item.address || '',
      birthday: item.birthday || '',
      website: item.website || '',
      notes: item.notes || ''
    }));
    setContacts(prev => [...newContacts, ...prev]);
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
    <div className="min-h-screen bg-bg-surface font-sans text-white p-6 lg:p-10 animate-in fade-in duration-700">
      {/* Page Header */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-10">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
             <div className="w-2.5 h-2.5 rounded-full bg-brand shadow-[0_0_10px_rgba(var(--brand-rgb),0.5)] animate-pulse" />
             <h1 className="text-4xl font-black uppercase tracking-tight">Audience CRM</h1>
          </div>
          <p className="text-[10px] text-text-muted font-black uppercase tracking-[0.2em] opacity-60">
            Intelligent Customer Segmentation & Management
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex bg-bg-surface2/40 border border-white/5 p-1.5 rounded-2xl">
            <button 
              onClick={() => setViewMode('table')}
              className={`p-2.5 rounded-xl transition-all ${viewMode === 'table' ? 'bg-brand text-white shadow-lg shadow-brand/20' : 'text-text-muted hover:text-white'}`}
            >
              <List size={20} />
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-brand text-white shadow-lg shadow-brand/20' : 'text-text-muted hover:text-white'}`}
            >
              <LayoutGrid size={20} />
            </button>
          </div>

          <div className="h-12 w-px bg-border mx-2" />

          <button 
            onClick={() => setIsImportOpen(true)}
            className="group relative flex items-center gap-2.5 bg-bg-surface3 border border-border rounded-2xl py-3.5 px-6 text-[10px] font-black uppercase tracking-widest overflow-hidden transition-all hover:border-brand/40"
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-[0.03] transition-opacity" />
            <Upload size={16} className="text-brand" /> 
            <span>Import</span>
          </button>
          
          <ExportDropdown onExport={handleExport} />

          <button 
            onClick={() => { setEditingContact(undefined); setIsFormOpen(true); }}
            className="flex items-center gap-3 bg-brand text-white rounded-2xl py-3.5 px-8 text-[11px] font-black uppercase tracking-widest hover:brightness-110 shadow-xl shadow-brand/30 transition-all border border-brand active:scale-95"
          >
            <UserPlus size={18} /> 
            <span>New Contact</span>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8">
        {/* Sidebar: Segments & Tags */}
        <aside className="col-span-12 lg:col-span-3 space-y-8">
           {/* Segments Section */}
           <div className="bg-bg-surface2/30 border border-border rounded-[2.5rem] p-6 space-y-6">
              <div className="flex items-center justify-between px-2">
                 <h3 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Segments</h3>
                 <button 
                    onClick={() => setIsSegmentBuilderOpen(true)}
                    className="p-2 rounded-xl border border-border text-text-muted hover:border-brand hover:text-brand transition-all"
                  >
                     <Plus size={14} />
                  </button>
              </div>
              
              <nav className="space-y-1">
                 {['All Contacts', 'Recent Leads', 'High Spenders', 'Inactive 30d'].map((seg) => (
                    <button 
                      key={seg}
                      onClick={() => setActiveSegment(seg === 'All Contacts' ? null : seg)}
                      className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-[11px] font-bold transition-all ${
                         (seg === 'All Contacts' && !activeSegment) || activeSegment === seg 
                         ? 'bg-brand/10 text-brand shadow-inner' 
                         : 'text-text-muted hover:bg-white/[0.03] hover:text-white'
                      }`}
                    >
                       <div className="flex items-center gap-3">
                          <Target size={14} className={(seg === 'All Contacts' && !activeSegment) || activeSegment === seg ? 'text-brand' : 'opacity-40'} />
                          {seg}
                       </div>
                       {(seg === 'All Contacts' && !activeSegment) || activeSegment === seg ? <ChevronRight size={14} /> : null}
                    </button>
                 ))}
              </nav>
           </div>

           {/* Health Score Placeholder */}
           <div className="bg-gradient-to-br from-brand/20 to-emerald-500/10 border border-brand/20 rounded-[2.5rem] p-6 text-center space-y-4 shadow-xl shadow-brand/5">
              <Shield className="mx-auto text-brand" size={32} />
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-white">List Health Score</h4>
                <p className="text-3xl font-black text-brand mt-1">94%</p>
              </div>
              <p className="text-[9px] text-text-muted font-bold leading-relaxed uppercase tracking-widest">
                Excellent deliverability potential across detected devices.
              </p>
           </div>

           {/* Tags Quick View */}
           <div className="px-4 space-y-4">
              <h3 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] px-2">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {availableTags.slice(0, 8).map(tag => (
                   <button 
                    key={tag} 
                    onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                    className={`px-3 py-1.5 border rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                      selectedTag === tag ? 'bg-brand border-brand text-white shadow-lg shadow-brand/20' : 'bg-bg-surface3 border-border text-text-muted hover:border-brand hover:text-brand'
                    }`}
                   >
                      # {tag}
                   </button>
                ))}
              </div>
           </div>
        </aside>

        {/* Main Content: Table & Filters */}
        <main className="col-span-12 lg:col-span-9 space-y-6">
          <div className="bg-bg-surface2/20 border border-border rounded-[2.5rem] p-2">
            <FilterBar 
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedTag={selectedTag}
              onTagChange={setSelectedTag}
              tags={availableTags}
            />
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 20 }}
            className="relative min-h-[500px]"
          >
            {viewMode === 'table' ? (
              <ContactTable 
                contacts={filteredContacts}
                selectedIds={selectedIds}
                onSelect={handleSelect}
                onSelectAll={handleSelectAll}
                onView={setViewingContact}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredContacts.map(contact => (
                  <ContactCard 
                    key={contact.id}
                    contact={contact}
                    selected={selectedIds.includes(contact.id)}
                    onSelect={handleSelect}
                    onView={setViewingContact}
                  />
                ))}
              </div>
            )}
            
            {/* View Stats Footer */}
            <div className="mt-6 flex items-center justify-between px-6">
               <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                     <Users size={14} className="text-brand" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Rows: {filteredContacts.length}</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <Star size={14} className="text-amber-500" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Avg Engagement: 82%</span>
                  </div>
               </div>
               <div className="flex items-center gap-4">
                  <button onClick={() => handleExport('csv')} className="text-[10px] font-black uppercase text-brand hover:underline">Download Report</button>
                  <div className="w-1 h-1 rounded-full bg-border" />
                  <span className="text-[10px] font-black uppercase text-text-muted">PK-1 Region</span>
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
        onAddTag={(tag) => {
          setContacts(prev => prev.map(c => selectedIds.includes(c.id) ? { ...c, tags: Array.from(new Set([...c.tags, tag])) } : c));
          setSelectedIds([]);
        }}
        availableTags={availableTags}
      />

      <ContactDrawer 
        contact={viewingContact}
        isOpen={!!viewingContact}
        onClose={() => setViewingContact(null)}
        onEdit={(contact) => {
          setEditingContact(contact);
          setIsFormOpen(true);
          setViewingContact(null);
        }}
        onDelete={handleDeleteContact}
      />

      <ContactForm 
        isOpen={isFormOpen}
        contact={editingContact}
        onClose={() => { setIsFormOpen(false); setEditingContact(undefined); }}
        onSave={handleSaveContact}
        tags={availableTags}
      />

      <ImportModal 
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImport={handleImport}
      />

      <AnimatePresence>
        {isSegmentBuilderOpen && (
          <SegmentBuilder 
            onClose={() => setIsSegmentBuilderOpen(false)}
            onSave={(seg) => {
              console.log('Saved Segment:', seg);
              setIsSegmentBuilderOpen(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
