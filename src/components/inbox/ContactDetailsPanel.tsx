import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Phone,
  Mail,
  Building2,
  MapPin,
  Calendar,
  Tag,
  User,
  FileText,
  Plus,
  Edit2,
  Save,
  XCircle
} from 'lucide-react';
import { Contact } from '../../types';
import { cn } from '../../lib/utils';

interface ContactDetailsPanelProps {
  contact: Contact | null;
  onClose: () => void;
  onUpdateContact?: (id: string, data: Partial<Contact>) => void;
  onAssignAgent?: (contactId: string, agentId: string) => void;
  availableAgents?: { id: string; name: string }[];
}

export function ContactDetailsPanel({
  contact,
  onClose,
  onUpdateContact,
  onAssignAgent,
  availableAgents = []
}: ContactDetailsPanelProps) {
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState(contact?.notes || '');
  const [isEditingTags, setIsEditingTags] = useState(false);
  const [newTag, setNewTag] = useState('');

  if (!contact) return null;

  const handleSaveNotes = () => {
    if (onUpdateContact) {
      onUpdateContact(contact.id, { notes });
    }
    setIsEditingNotes(false);
  };

  const handleAddTag = () => {
    if (newTag.trim() && onUpdateContact) {
      const updatedTags = [...contact.tags, newTag.trim()];
      onUpdateContact(contact.id, { tags: updatedTags });
      setNewTag('');
      setIsEditingTags(false);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (onUpdateContact) {
      const updatedTags = contact.tags.filter(tag => tag !== tagToRemove);
      onUpdateContact(contact.id, { tags: updatedTags });
    }
  };

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      className="w-80 bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 flex flex-col h-full"
    >
      {/* Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Contact Details
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
          </button>
        </div>

        {/* Avatar & Name */}
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-[#12263A] to-[#166534] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3 shadow-lg shadow-[#12263A]/20">
            {contact.name.charAt(0).toUpperCase()}
          </div>
          <h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">
            {contact.name}
          </h4>
          <div className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
            contact.status === 'active' && 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
            contact.status === 'lead' && 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
            contact.status === 'customer' && 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
          )}>
            <div className={cn(
              'w-2 h-2 rounded-full',
              contact.status === 'active' && 'bg-emerald-500',
              contact.status === 'lead' && 'bg-blue-500',
              contact.status === 'customer' && 'bg-purple-500'
            )} />
            {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Contact Information */}
        <div className="space-y-3">
          <h5 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
            Contact Information
          </h5>

          {/* Phone */}
          <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
            <div className="w-9 h-9 bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center border border-slate-200 dark:border-slate-700 flex-shrink-0">
              <Phone className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Phone</p>
              <p className="text-sm font-medium text-slate-900 dark:text-white font-mono">
                {contact.phone}
              </p>
            </div>
          </div>

          {/* Email */}
          {contact.email && (
            <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
              <div className="w-9 h-9 bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center border border-slate-200 dark:border-slate-700 flex-shrink-0">
                <Mail className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Email</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                  {contact.email}
                </p>
              </div>
            </div>
          )}

          {/* Company */}
          {contact.company && (
            <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
              <div className="w-9 h-9 bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center border border-slate-200 dark:border-slate-700 flex-shrink-0">
                <Building2 className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Company</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {contact.company}
                </p>
                {contact.job_title && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {contact.job_title}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Created Date */}
          <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
            <div className="w-9 h-9 bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center border border-slate-200 dark:border-slate-700 flex-shrink-0">
              <Calendar className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Added</p>
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                {contact.created_at ? new Date(contact.created_at).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h5 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Tags
            </h5>
            <button
              onClick={() => setIsEditingTags(!isEditingTags)}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {contact.tags.map((tag) => (
              <motion.div
                key={tag}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="group flex items-center gap-1.5 px-2.5 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg text-xs font-medium"
              >
                <Tag className="w-3 h-3" />
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <XCircle className="w-3 h-3 hover:text-blue-800 dark:hover:text-blue-300" />
                </button>
              </motion.div>
            ))}
          </div>

          {isEditingTags && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                placeholder="Enter tag name..."
                className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#22C55E]/30 focus:border-[#166534]"
              />
              <button
                onClick={handleAddTag}
                className="px-3 py-2 bg-[#166534] text-white rounded-lg hover:bg-[#14532d] transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </div>

        {/* Assign Agent */}
        {availableAgents.length > 0 && (
          <div className="space-y-3">
            <h5 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Assigned Agent
            </h5>
            <select
              onChange={(e) => onAssignAgent?.(contact.id, e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#22C55E]/30 focus:border-[#166534]"
            >
              <option value="">Unassigned</option>
              {availableAgents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Notes */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h5 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Notes
            </h5>
            {!isEditingNotes && (
              <button
                onClick={() => setIsEditingNotes(true)}
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <Edit2 className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              </button>
            )}
          </div>

          {isEditingNotes ? (
            <div className="space-y-2">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="Add notes about this contact..."
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#22C55E]/30 focus:border-[#166534] resize-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveNotes}
                  className="btn-premium-primary flex-1"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={() => {
                    setNotes(contact.notes || '');
                    setIsEditingNotes(false);
                  }}
                  className="btn-premium-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg min-h-[80px]">
              <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                {contact.notes || 'No notes added yet'}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
