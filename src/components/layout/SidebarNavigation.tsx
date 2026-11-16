import { useEffect, useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/src/lib/utils';
import {
  buildSidebarNavigation,
  isNavigationRouteActive,
  itemContainsActiveRoute,
  SidebarNavigationItem,
} from './sidebarNavigationConfig';

interface SidebarNavigationProps {
  t: (key: string, params?: any, fallback?: string) => string;
  pathname: string;
  isCollapsed: boolean;
  isRtl: boolean;
  role?: string;
  permissions?: string[];
  features?: string[];
  onNavigate: () => void;
  onExpand: () => void;
}

const OPEN_GROUP_STORAGE_KEY = 'sidebar_open_navigation_group';

export function SidebarNavigation({
  t,
  pathname,
  isCollapsed,
  isRtl,
  role,
  permissions = [],
  features = [],
  onNavigate,
  onExpand,
}: SidebarNavigationProps) {
  const sections = useMemo(() => buildSidebarNavigation(t), [t]);
  const activeParent = useMemo(() => {
    for (const section of sections) {
      const match = section.items.find((item) => item.children?.length && itemContainsActiveRoute(item, pathname));
      if (match) return match.id;
    }
    return null;
  }, [pathname, sections]);
  const [openGroup, setOpenGroup] = useState<string | null>(() => (
    localStorage.getItem(OPEN_GROUP_STORAGE_KEY)
  ));

  useEffect(() => {
    if (activeParent) setOpenGroup(activeParent);
  }, [activeParent]);

  const isAllowed = (item: SidebarNavigationItem) => {
    const roleAllowed = !item.requiredRoles?.length || Boolean(role && item.requiredRoles.includes(role));
    const permissionAllowed = !item.requiredPermissions?.length
      || item.requiredPermissions.every((permission) => permissions.includes(permission));
    const featureAllowed = !item.feature || features.includes(item.feature);
    return roleAllowed && permissionAllowed && featureAllowed;
  };

  const setExpandedGroup = (id: string | null) => {
    setOpenGroup(id);
    if (id) localStorage.setItem(OPEN_GROUP_STORAGE_KEY, id);
    else localStorage.removeItem(OPEN_GROUP_STORAGE_KEY);
  };

  return (
    <div className="space-y-4 py-2">
      {sections.map((section) => {
        const visibleItems = section.items.filter(isAllowed);
        if (!visibleItems.length) return null;

        return (
          <section key={section.id} aria-labelledby={`sidebar-section-${section.id}`}>
            {!isCollapsed ? (
              <h2
                id={`sidebar-section-${section.id}`}
                className={cn(
                  'mb-1.5 px-3 text-[10px] font-extrabold uppercase tracking-[0.13em] text-slate-400',
                  isRtl ? 'text-right' : 'text-left',
                )}
              >
                {section.label}
              </h2>
            ) : (
              <div className="mx-2 my-2 h-px bg-slate-200" aria-hidden="true" />
            )}

            <nav aria-label={section.label} className="space-y-1">
              {visibleItems.map((item) => {
                const children = item.children?.filter(isAllowed) || [];
                if (children.length) {
                  const isOpen = openGroup === item.id;
                  const isActive = itemContainsActiveRoute(item, pathname);
                  const Icon = item.icon;

                  return (
                    <div key={item.id} className="space-y-1">
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={`sidebar-children-${item.id}`}
                        title={isCollapsed ? item.label : undefined}
                        onClick={() => {
                          if (isCollapsed) {
                            onExpand();
                            setExpandedGroup(item.id);
                            return;
                          }
                          setExpandedGroup(isOpen ? null : item.id);
                        }}
                        className={cn(
                          'group relative flex min-h-10 w-full items-center rounded-xl text-[13px] font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1',
                          isCollapsed ? 'justify-center px-2' : 'gap-3 px-3',
                          isActive
                            ? 'bg-emerald-50 text-emerald-800'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950',
                        )}
                      >
                        <Icon
                          size={18}
                          strokeWidth={1.9}
                          className={cn('shrink-0', isActive ? 'text-emerald-700' : 'text-slate-500 group-hover:text-slate-800')}
                        />
                        {!isCollapsed && (
                          <>
                            <span className={cn('min-w-0 flex-1 truncate', isRtl ? 'text-right' : 'text-left')}>
                              {item.label}
                            </span>
                            {item.badge !== undefined && (
                              <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-500">
                                {item.badge}
                              </span>
                            )}
                            <ChevronDown
                              size={14}
                              className={cn('shrink-0 text-slate-400 transition-transform', isOpen && 'rotate-180')}
                            />
                          </>
                        )}
                        {isCollapsed && <CollapsedTooltip label={item.label} isRtl={isRtl} />}
                      </button>

                      {!isCollapsed && isOpen && (
                        <div
                          id={`sidebar-children-${item.id}`}
                          className={cn(
                            'space-y-0.5 border-slate-200 py-0.5',
                            isRtl ? 'mr-5 border-r pr-3' : 'ml-5 border-l pl-3',
                          )}
                        >
                          {children.map((child) => {
                            const ChildIcon = child.icon;
                            const childActive = isNavigationRouteActive(pathname, child.route);
                            return (
                              <NavLink
                                key={child.id}
                                to={child.route || '#'}
                                onClick={onNavigate}
                                aria-current={childActive ? 'page' : undefined}
                                className={cn(
                                  'flex min-h-9 items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500',
                                  childActive
                                    ? 'bg-emerald-50 text-emerald-800'
                                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900',
                                )}
                              >
                                <ChildIcon size={15} strokeWidth={1.9} className={childActive ? 'text-emerald-700' : 'text-slate-400'} />
                                <span className="min-w-0 flex-1 truncate">{child.label}</span>
                                {child.badge !== undefined && (
                                  <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[9px]">{child.badge}</span>
                                )}
                              </NavLink>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                if (!item.route) return null;
                const Icon = item.icon;
                const active = isNavigationRouteActive(pathname, item.route);
                return (
                  <NavLink
                    key={item.id}
                    to={item.route}
                    onClick={onNavigate}
                    aria-current={active ? 'page' : undefined}
                    title={isCollapsed ? item.label : undefined}
                    className={cn(
                      'group relative flex min-h-10 items-center rounded-xl text-[13px] font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1',
                      isCollapsed ? 'justify-center px-2' : 'gap-3 px-3',
                      active
                        ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-900/10'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950',
                    )}
                  >
                    <Icon
                      size={18}
                      strokeWidth={1.9}
                      className={cn('shrink-0', active ? 'text-white' : 'text-slate-500 group-hover:text-slate-800')}
                    />
                    {!isCollapsed && (
                      <>
                        <span className={cn('min-w-0 flex-1 truncate', isRtl ? 'text-right' : 'text-left')}>
                          {item.label}
                        </span>
                        {item.badge !== undefined && (
                          <span className={cn(
                            'rounded-full px-1.5 py-0.5 text-[9px] font-bold',
                            active ? 'bg-white/15 text-white' : 'bg-slate-100 text-slate-500',
                          )}>
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                    {isCollapsed && <CollapsedTooltip label={item.label} isRtl={isRtl} />}
                  </NavLink>
                );
              })}
            </nav>
          </section>
        );
      })}
    </div>
  );
}

function CollapsedTooltip({ label, isRtl }: { label: string; isRtl: boolean }) {
  return (
    <span
      role="tooltip"
      className={cn(
        'pointer-events-none absolute top-1/2 z-[130] -translate-y-1/2 whitespace-nowrap rounded-lg bg-slate-950 px-2.5 py-1.5 text-xs font-semibold text-white opacity-0 shadow-xl transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100',
        isRtl ? 'right-[58px]' : 'left-[58px]',
      )}
    >
      {label}
    </span>
  );
}
