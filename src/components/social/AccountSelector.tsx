import React, { useState } from 'react';
import { SocialAccount } from '../../types/socialPlanner';
import { Check, Facebook, Instagram, AlertCircle, Plus, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AccountSelectorProps {
  accounts: SocialAccount[];
  selectedIds: number[];
  onChange: (selectedIds: number[]) => void;
  multiple?: boolean;
  filterPlatform?: 'facebook' | 'instagram';
  disabled?: boolean;
}

export const AccountSelector: React.FC<AccountSelectorProps> = ({
  accounts,
  selectedIds,
  onChange,
  multiple = true,
  filterPlatform,
  disabled = false,
}) => {
  const [internalPlatformFilter, setInternalPlatformFilter] = useState<'all' | 'facebook' | 'instagram'>(
    filterPlatform || 'all'
  );

  const fbCount = accounts.filter((a) => a.platform === 'facebook').length;
  const igCount = accounts.filter((a) => a.platform === 'instagram').length;

  const activeFilter = filterPlatform || internalPlatformFilter;

  const filteredAccounts = activeFilter === 'all'
    ? accounts
    : accounts.filter((acc) => acc.platform === activeFilter);

  const handleToggle = (id: number) => {
    if (disabled) return;
    if (multiple) {
      if (selectedIds.includes(id)) {
        onChange(selectedIds.filter((item) => item !== id));
      } else {
        onChange([...selectedIds, id]);
      }
    } else {
      if (selectedIds.includes(id)) {
        onChange([]);
      } else {
        onChange([id]);
      }
    }
  };

  const selectAll = () => {
    if (disabled) return;
    const currentFilteredIds = filteredAccounts.map((a) => a.id);
    const merged = Array.from(new Set([...selectedIds, ...currentFilteredIds]));
    onChange(merged);
  };

  const clearAll = () => {
    if (disabled) return;
    onChange([]);
  };

  if (accounts.length === 0) {
    return (
      <div className="p-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 text-center">
        <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-2.5">
          <AlertCircle size={20} />
        </div>
        <p className="text-xs font-semibold text-slate-800">No social accounts connected</p>
        <p className="text-[11px] text-slate-500 max-w-sm mx-auto mt-0.5 mb-3">
          Connect your Facebook Pages and Instagram Professional accounts to start scheduling and publishing.
        </p>
        <Link
          to="/social-planner/accounts"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#166534] hover:bg-[#14532d] rounded-xl transition-all shadow-xs"
        >
          <Plus size={14} /> Connect Accounts
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Top Filter Bar & Selection Counter */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Platform filter tabs */}
        {!filterPlatform && accounts.length > 1 && (
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              disabled={disabled}
              onClick={() => setInternalPlatformFilter('all')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                internalPlatformFilter === 'all'
                  ? 'bg-white text-slate-800 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Users size={12} />
              <span>All ({accounts.length})</span>
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={() => setInternalPlatformFilter('facebook')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                internalPlatformFilter === 'facebook'
                  ? 'bg-white text-[#1877F2] shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Facebook size={12} />
              <span>Facebook ({fbCount})</span>
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={() => setInternalPlatformFilter('instagram')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                internalPlatformFilter === 'instagram'
                  ? 'bg-white text-[#E4405F] shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Instagram size={12} />
              <span>Instagram ({igCount})</span>
            </button>
          </div>
        )}

        {/* Selected count and Quick select/clear */}
        <div className="flex items-center gap-2 ml-auto text-xs text-slate-500">
          <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md text-[11px]">
            {selectedIds.length} of {accounts.length} selected
          </span>
          {multiple && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={selectAll}
                disabled={disabled}
                className="text-[#166534] hover:underline font-bold text-[11px] disabled:opacity-50"
              >
                Select All
              </button>
              <span className="text-slate-300">•</span>
              <button
                type="button"
                onClick={clearAll}
                disabled={disabled || selectedIds.length === 0}
                className="text-slate-400 hover:text-slate-700 hover:underline text-[11px] disabled:opacity-50"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Account Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {filteredAccounts.map((acc) => {
          const isSelected = selectedIds.includes(acc.id);
          const isFacebook = acc.platform === 'facebook';

          return (
            <div
              key={acc.id}
              onClick={() => handleToggle(acc.id)}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer select-none ${
                disabled ? 'opacity-60 cursor-not-allowed' : ''
              } ${
                isSelected
                  ? 'bg-emerald-50/60 border-emerald-500/80 shadow-xs ring-1 ring-emerald-500/30'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Avatar with Platform badge */}
                <div className="relative shrink-0">
                  {acc.profile_picture_url ? (
                    <img
                      src={acc.profile_picture_url}
                      alt={acc.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                  ) : (
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                        isFacebook
                          ? 'bg-[#1877F2]'
                          : 'bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600'
                      }`}
                    >
                      {acc.name.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <span
                    className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-white ring-2 ring-white shadow-xs ${
                      isFacebook
                        ? 'bg-[#1877F2]'
                        : 'bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600'
                    }`}
                  >
                    {isFacebook ? <Facebook size={9} /> : <Instagram size={9} />}
                  </span>
                </div>

                {/* Name & Platform Category/Handle */}
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">{acc.name}</p>
                  <p className="text-[11px] text-slate-400 truncate flex items-center gap-1">
                    <span
                      className={`font-semibold ${
                        isFacebook ? 'text-[#1877F2]' : 'text-[#E4405F]'
                      }`}
                    >
                      {isFacebook ? 'Facebook Page' : 'Instagram'}
                    </span>
                    <span>•</span>
                    <span>{isFacebook ? (acc.category || 'Page') : `@${acc.username || 'account'}`}</span>
                  </p>
                </div>
              </div>

              {/* Check indicator */}
              <div
                className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0 ${
                  isSelected
                    ? 'bg-[#166534] border-[#166534] text-white shadow-xs'
                    : 'border-slate-300 bg-white text-transparent'
                }`}
              >
                <Check size={12} strokeWidth={3} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
