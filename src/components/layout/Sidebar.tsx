import React from 'react';
import {
  LayoutDashboard,
  CalendarCheck,
  FileText,
  Building,
  BookOpen,
  Calendar,
  GraduationCap,
  CreditCard,
  UserPlus,
  Bell,
  Library,
  LifeBuoy,
  UserCircle,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  User,
} from 'lucide-react';
import { UserRole } from '../../types';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  userRole: UserRole;
  onToggleRole: () => void;
  pendingLeavesCount: number;
  pendingAssignmentsCount: number;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
  { id: 'class-leave', label: 'Class Leave (CL)', icon: FileText, badgeKey: 'cl' },
  { id: 'hostel-leave', label: 'Hostel Leave', icon: Building, badgeKey: 'hl' },
  { id: 'assignments', label: 'Assignments', icon: BookOpen, badgeKey: 'assignments' },
  { id: 'events', label: 'Events', icon: Calendar },
  { id: 'academics', label: 'Academics & Results', icon: GraduationCap },
  { id: 'fees', label: 'Fees', icon: CreditCard },
  { id: 'admissions', label: 'Admissions', icon: UserPlus },
  { id: 'notices', label: 'Notices', icon: Bell },
  { id: 'library', label: 'Library', icon: Library },
  { id: 'helpdesk', label: 'Helpdesk', icon: LifeBuoy },
  { id: 'profile', label: 'Profile & Documents', icon: UserCircle },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  collapsed,
  onToggleCollapse,
  userRole,
  onToggleRole,
  pendingLeavesCount,
  pendingAssignmentsCount,
  mobileOpen,
  onCloseMobile,
}) => {
  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-slate-900 border-r border-slate-800 text-slate-300 transition-all duration-200 ease-in-out lg:static ${
          collapsed ? 'w-18' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800 shrink-0">
          {!collapsed ? (
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 font-bold text-base shrink-0">
                U
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-base font-bold tracking-tight text-white truncate">
                  UNISPHERE
                </span>
                <span className="text-[11px] font-medium text-slate-400 truncate">
                  BPUT Portal
                </span>
              </div>
            </div>
          ) : (
            <div className="w-full flex justify-center">
              <div className="w-9 h-9 rounded-lg bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 font-bold text-base">
                U
              </div>
            </div>
          )}

          {/* Desktop collapse toggle */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Role toggle badge card */}
        <div className="p-3 border-b border-slate-800 shrink-0">
          <button
            onClick={onToggleRole}
            className={`w-full flex items-center gap-2.5 p-2 rounded-lg text-left transition-all ${
              userRole === 'admin'
                ? 'bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/15'
                : 'bg-teal-500/10 border border-teal-500/30 text-teal-300 hover:bg-teal-500/15'
            }`}
            title={`Switch to ${userRole === 'student' ? 'Administrator' : 'Student'} mode`}
          >
            {userRole === 'admin' ? (
              <ShieldCheck className="w-4 h-4 shrink-0 text-amber-400" />
            ) : (
              <User className="w-4 h-4 shrink-0 text-teal-400" />
            )}
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-medium tracking-wide uppercase text-slate-400">
                  Active View
                </div>
                <div className="text-xs font-semibold truncate text-white">
                  {userRole === 'admin' ? 'Administrator' : 'Student (Rahul P.)'}
                </div>
              </div>
            )}
            {!collapsed && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                Swap
              </span>
            )}
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            
            // Badge calculation
            let badge = null;
            if (item.id === 'class-leave' && pendingLeavesCount > 0 && userRole === 'admin') {
              badge = pendingLeavesCount;
            } else if (item.id === 'assignments' && pendingAssignmentsCount > 0 && userRole === 'student') {
              badge = pendingAssignmentsCount;
            }

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  if (mobileOpen) onCloseMobile();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left group ${
                  isActive
                    ? 'bg-slate-800 text-white font-semibold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-teal-400' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                {!collapsed && <span className="truncate flex-1">{item.label}</span>}
                {!collapsed && badge !== null && (
                  <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer info */}
        <div className="p-3 border-t border-slate-800 shrink-0 text-slate-400 text-[11px]">
          {!collapsed ? (
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-slate-400">
                <span>Academic Year</span>
                <span className="font-mono text-slate-300">2025-26</span>
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                Biju Patnaik Univ. of Technology
              </div>
            </div>
          ) : (
            <div className="text-center font-mono text-[10px] text-slate-400">25-26</div>
          )}
        </div>
      </aside>
    </>
  );
};
