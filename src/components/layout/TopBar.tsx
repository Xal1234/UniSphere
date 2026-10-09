import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Search,
  Bell,
  CheckCircle2,
  AlertCircle,
  Clock,
  LogOut,
  User,
  ShieldCheck,
  X,
  ExternalLink,
} from 'lucide-react';
import { UserRole, AppNotification, StudentProfile, AdminProfile } from '../../types';

interface TopBarProps {
  currentTab: string;
  tabLabel: string;
  onOpenMobileNav: () => void;
  userRole: UserRole;
  onToggleRole: () => void;
  notifications: AppNotification[];
  onMarkNotificationAsRead: (id: string) => void;
  onMarkAllNotificationsAsRead: () => void;
  onNavigateTab: (tab: string) => void;
  student: StudentProfile;
  admin: AdminProfile;
  onGlobalSearchSelect: (type: string, id: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentTab,
  tabLabel,
  onOpenMobileNav,
  userRole,
  onToggleRole,
  notifications,
  onMarkNotificationAsRead,
  onMarkAllNotificationsAsRead,
  onNavigateTab,
  student,
  admin,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Simple global search suggestions
  const searchResults = [
    { label: 'Attendance Breakdown', tab: 'attendance', type: 'Section' },
    { label: 'Apply Class Leave (CL)', tab: 'class-leave', type: 'Action' },
    { label: 'Hostel Outpass & Gate Pass', tab: 'hostel-leave', type: 'Section' },
    { label: 'DBMS Assignment 3', tab: 'assignments', type: 'Assignment' },
    { label: 'Anweshon 2026 Tech Fest', tab: 'events', type: 'Event' },
    { label: 'Semester Exam Schedule Notice', tab: 'notices', type: 'Notice' },
    { label: 'Fee Payment & Receipts', tab: 'fees', type: 'Section' },
    { label: 'Central Library Catalogue', tab: 'library', type: 'Service' },
    { label: 'Wi-Fi & Campus Helpdesk', tab: 'helpdesk', type: 'Support' },
  ].filter((item) => item.label.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 lg:px-6 flex items-center justify-between gap-4 sticky top-0 z-30">
      {/* Zone 1: Mobile toggle + Breadcrumb & Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobileNav}
          className="lg:hidden p-2 -ml-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 min-w-0">
          <span className="hidden sm:inline-block text-xs font-semibold uppercase tracking-wider text-slate-400">
            UNISPHERE
          </span>
          <span className="hidden sm:inline-block text-slate-300">/</span>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 truncate">
            {tabLabel}
          </h1>
          <span className="hidden md:inline-flex items-center ml-2 px-2 py-0.5 text-[11px] font-medium text-slate-600 bg-slate-100 border border-slate-200 rounded">
            {userRole === 'student' ? '6th Sem · B.Tech CSE' : 'Admin Portal'}
          </span>
        </div>
      </div>

      {/* Zone 2: Global Search Bar */}
      <div className="relative flex-1 max-w-md hidden md:block">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search courses, leaves, fees, notices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
            className="w-full pl-9 pr-8 py-1.5 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Live Search Quick Results */}
        {searchFocused && searchQuery.trim().length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50 overflow-hidden">
            <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Quick Suggestions
            </div>
            {searchResults.length > 0 ? (
              searchResults.map((item, idx) => (
                <button
                  key={idx}
                  onMouseDown={() => {
                    onNavigateTab(item.tab);
                    setSearchQuery('');
                  }}
                  className="w-full px-3 py-2 text-left text-xs hover:bg-slate-50 flex items-center justify-between text-slate-700 transition-colors"
                >
                  <span className="font-medium truncate">{item.label}</span>
                  <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                    {item.type}
                  </span>
                </button>
              ))
            ) : (
              <div className="px-3 py-3 text-xs text-slate-500 text-center">
                No matching sections found for "{searchQuery}"
              </div>
            )}
          </div>
        )}
      </div>

      {/* Zone 3: Role Switcher, Notifications & Profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Role switcher toggle button */}
        <button
          onClick={onToggleRole}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            userRole === 'admin'
              ? 'bg-amber-50 border-amber-200 text-amber-900 hover:bg-amber-100'
              : 'bg-teal-50 border-teal-200 text-teal-900 hover:bg-teal-100'
          }`}
          title="Switch role between Student and Administrator"
        >
          {userRole === 'admin' ? (
            <ShieldCheck className="w-4 h-4 text-amber-600" />
          ) : (
            <User className="w-4 h-4 text-teal-600" />
          )}
          <span className="hidden sm:inline">
            {userRole === 'admin' ? 'Admin Mode' : 'Student Mode'}
          </span>
          <span className="text-[10px] text-slate-600 font-normal ml-0.5">Switch</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50">
              <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-rose-100 text-rose-700 rounded-full font-mono">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={onMarkAllNotificationsAsRead}
                    className="text-[11px] font-medium text-teal-700 hover:text-teal-800 transition-colors"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {notifications.length > 0 ? (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        onMarkNotificationAsRead(item.id);
                        if (item.linkTab) onNavigateTab(item.linkTab);
                        setShowNotifications(false);
                      }}
                      className={`p-3 text-left hover:bg-slate-50 cursor-pointer transition-colors flex items-start gap-3 ${
                        !item.read ? 'bg-teal-50/30' : ''
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {item.type === 'notice' && <AlertCircle className="w-4 h-4 text-blue-600" />}
                        {item.type === 'leave' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                        {item.type === 'assignment' && <Clock className="w-4 h-4 text-amber-600" />}
                        {item.type === 'fee' && <AlertCircle className="w-4 h-4 text-purple-600" />}
                        {item.type === 'event' && <CheckCircle2 className="w-4 h-4 text-teal-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-slate-800 flex items-center justify-between">
                          <span className="truncate">{item.title}</span>
                          {!item.read && (
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-600 shrink-0 ml-1.5" />
                          )}
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">
                          {item.description}
                        </p>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          {item.time}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center text-xs text-slate-400">
                    No new notifications
                  </div>
                )}
              </div>

              <div className="px-3 pt-2 pb-1 border-t border-slate-100 text-center">
                <button
                  onClick={() => {
                    onNavigateTab('notices');
                    setShowNotifications(false);
                  }}
                  className="text-xs font-medium text-slate-600 hover:text-slate-900 inline-flex items-center gap-1"
                >
                  View campus notice board <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Menu Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1 pl-1.5 rounded-lg hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
            aria-label="User profile options"
          >
            <div className="w-7 h-7 rounded-full bg-slate-900 text-white font-semibold text-xs flex items-center justify-center">
              {userRole === 'student' ? 'RP' : 'SM'}
            </div>
            <div className="hidden xl:block text-left">
              <div className="text-xs font-semibold text-slate-900 leading-tight">
                {userRole === 'student' ? student.name : admin.name}
              </div>
              <div className="text-[10px] text-slate-500 font-mono leading-tight">
                {userRole === 'student' ? student.regNo : admin.employeeId}
              </div>
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-100">
                <div className="text-xs font-bold text-slate-900">
                  {userRole === 'student' ? student.name : admin.name}
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  {userRole === 'student' ? student.email : admin.email}
                </div>
                <div className="text-[10px] text-teal-700 font-mono mt-1">
                  {userRole === 'student'
                    ? `Reg No: ${student.regNo} · ${student.branch}`
                    : `${admin.designation}`}
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    onNavigateTab('profile');
                    setShowProfileMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  View Full Academic Profile
                </button>
                <button
                  onClick={() => {
                    onNavigateTab('fees');
                    setShowProfileMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <span className="font-mono text-xs text-slate-400">₹</span>
                  Fee Statement & Dues
                </button>
                <button
                  onClick={() => {
                    onToggleRole();
                    setShowProfileMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                  Switch to {userRole === 'student' ? 'Administrator' : 'Student'} View
                </button>
              </div>

              <div className="border-t border-slate-100 pt-1 mt-1">
                <div className="px-4 py-1.5 text-[11px] text-slate-400">
                  UNISPHERE · BPUT Portal v2.4
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
