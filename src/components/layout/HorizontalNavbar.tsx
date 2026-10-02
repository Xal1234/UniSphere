import React, { useState, useRef, useEffect } from 'react';
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
  Menu,
  X,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  User,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Award,
  Users,
  Briefcase,
  Sun,
  Moon,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Check,
  LogOut,
} from 'lucide-react';
import { UserRole, AppNotification, StudentProfile, AdminProfile, ThemePreference, DevicePreference } from '../../types';

export const studentNavItems = [
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

export const adminNavItems = [
  { id: 'admin-dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
  { id: 'admin-courses', label: 'Courses & Timetable', icon: BookOpen },
  { id: 'admin-attendance', label: 'Take Attendance', icon: CalendarCheck },
  { id: 'admin-assignments', label: 'Assignments & Create', icon: FileText },
  { id: 'admin-grading', label: 'Review & Grading', icon: Award, badgeKey: 'grading' },
  { id: 'admin-students', label: 'Students Directory', icon: Users },
  { id: 'admin-cl-approvals', label: 'Student CL Approvals', icon: CheckCircle2, badgeKey: 'cl' },
  { id: 'admin-hl-approvals', label: 'Hostel Outpass Approvals', icon: Building, badgeKey: 'hl' },
  { id: 'admin-events', label: 'Event Management', icon: Calendar },
  { id: 'admin-notices', label: 'Campus Notices', icon: Bell },
  { id: 'admin-helpdesk', label: 'Helpdesk Requests', icon: LifeBuoy, badgeKey: 'helpdesk' },
  { id: 'admin-admissions', label: 'Admissions Desk', icon: UserPlus },
  { id: 'admin-fees', label: 'Fee Collections', icon: CreditCard },
  { id: 'admin-profile', label: 'My Staff Profile & Leaves', icon: Briefcase, badgeKey: 'staffLeave' },
];

// Default export alias for compatibility
export const navItems = studentNavItems;

interface HorizontalNavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  userRole: UserRole;
  onToggleRole: () => void;
  notifications: AppNotification[];
  onMarkNotificationAsRead: (id: string) => void;
  onMarkAllNotificationsAsRead: () => void;
  student: StudentProfile;
  admin: AdminProfile;
  pendingLeavesCount: number;
  pendingAssignmentsCount: number;
  pendingHLCount?: number;
  pendingGradingCount?: number;
  openHelpdeskCount?: number;
  onGlobalSearchSelect?: (type: string, id: string) => void;
  themePreference: ThemePreference;
  onToggleTheme: (theme?: ThemePreference) => void;
  devicePreference: DevicePreference;
  onChangeDevicePreference: (device: DevicePreference) => void;
  onLogout?: () => void;
}

export const HorizontalNavbar: React.FC<HorizontalNavbarProps> = ({
  currentTab,
  onSelectTab,
  userRole,
  onToggleRole,
  notifications,
  onMarkNotificationAsRead,
  onMarkAllNotificationsAsRead,
  student,
  admin,
  pendingLeavesCount,
  pendingAssignmentsCount,
  pendingHLCount = 0,
  pendingGradingCount = 0,
  openHelpdeskCount = 0,
  onGlobalSearchSelect,
  themePreference,
  onToggleTheme,
  devicePreference,
  onChangeDevicePreference,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showDeviceMenu, setShowDeviceMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const deviceMenuRef = useRef<HTMLDivElement>(null);
  const navScrollRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const activeNavItems = userRole === 'admin' ? adminNavItems : studentNavItems;

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      if (deviceMenuRef.current && !deviceMenuRef.current.contains(event.target as Node)) {
        setShowDeviceMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll active tab into view in horizontal nav
  useEffect(() => {
    if (navScrollRef.current) {
      const activeBtn = navScrollRef.current.querySelector('[data-active="true"]');
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [currentTab]);

  // Contextual search suggestions
  const studentSearchResults = [
    { label: 'Attendance Breakdown', tab: 'attendance', type: 'Section' },
    { label: 'Apply Class Leave (CL)', tab: 'class-leave', type: 'Action' },
    { label: 'Hostel Outpass & Gate Pass', tab: 'hostel-leave', type: 'Section' },
    { label: 'DBMS Assignment 3', tab: 'assignments', type: 'Assignment' },
    { label: 'Anweshon 2026 Tech Fest', tab: 'events', type: 'Event' },
    { label: 'Semester Exam Schedule Notice', tab: 'notices', type: 'Notice' },
    { label: 'Fee Payment & Receipts', tab: 'fees', type: 'Section' },
    { label: 'Central Library Catalogue', tab: 'library', type: 'Service' },
    { label: 'Wi-Fi & Campus Helpdesk', tab: 'helpdesk', type: 'Support' },
  ];

  const adminSearchResults = [
    { label: 'Take Class Attendance', tab: 'admin-attendance', type: 'Teaching' },
    { label: 'Create Course Assignment', tab: 'admin-assignments', type: 'Teaching' },
    { label: 'Review & Grade Submissions', tab: 'admin-grading', type: 'Assessment' },
    { label: 'Students Roster & Directory', tab: 'admin-students', type: 'Records' },
    { label: 'Student Class Leave Approvals', tab: 'admin-cl-approvals', type: 'Approval' },
    { label: 'Hostel Outpass & Gate Pass Approvals', tab: 'admin-hl-approvals', type: 'Approval' },
    { label: 'Publish Campus Notice', tab: 'admin-notices', type: 'Office' },
    { label: 'My Staff Leave Requisition', tab: 'admin-profile', type: 'Self-Service' },
    { label: 'Admissions Counseling Desk', tab: 'admin-admissions', type: 'Admissions' },
    { label: 'Campus Helpdesk Operations', tab: 'admin-helpdesk', type: 'Operations' },
  ];

  const searchResults = (userRole === 'admin' ? adminSearchResults : studentSearchResults).filter(
    (item) => item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const scrollNav = (direction: 'left' | 'right') => {
    if (navScrollRef.current) {
      const offset = direction === 'left' ? -240 : 240;
      navScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Primary Tier: Brand, Global Search, Role Switcher, Alerts & Profile */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Identity */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onSelectTab(userRole === 'admin' ? 'admin-dashboard' : 'dashboard')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-8 h-8 rounded-lg bg-teal-500/15 border border-teal-400/30 flex items-center justify-center text-teal-300 font-bold text-sm tracking-tight transition-transform group-hover:scale-105">
                C1
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-bold tracking-tight text-white leading-tight">
                  CampusOne
                </span>
                <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400 leading-tight">
                  {userRole === 'admin' ? 'Faculty & Admin Portal' : 'BPUT Academic Portal'}
                </span>
              </div>
            </button>

            {/* University Context Badge */}
            <div className="hidden xl:flex items-center ml-3 pl-3 border-l border-slate-800 text-[11px] text-slate-400">
              <span className="font-medium text-slate-300">
                {userRole === 'student' ? '6th Sem · B.Tech CSE' : 'Staff Workspace · Dean & Chief Warden'}
              </span>
            </div>
          </div>

          {/* Center: Global Search Bar */}
          <div className="relative flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder={
                  userRole === 'admin'
                    ? 'Search courses, students, grading, approvals...'
                    : 'Search courses, leaves, fees, notices...'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                className="w-full pl-9 pr-8 py-1.5 text-xs text-white bg-slate-800/80 border border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-400 focus:border-teal-400 transition-all placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Live Search Suggestions Dropdown */}
            {searchFocused && searchQuery.trim().length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-lg shadow-xl py-1 z-50 text-slate-800 overflow-hidden">
                <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Quick Navigation
                </div>
                {searchResults.length > 0 ? (
                  searchResults.map((item, idx) => (
                    <button
                      key={idx}
                      onMouseDown={() => {
                        onSelectTab(item.tab);
                        setSearchQuery('');
                      }}
                      className="w-full px-3 py-2 text-left text-xs hover:bg-slate-50 flex items-center justify-between text-slate-700 transition-colors"
                    >
                      <span className="font-medium truncate">{item.label}</span>
                      <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        {item.type}
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-3 text-xs text-slate-500 text-center">
                    No results found for "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Controls: Device Switcher, Theme Switcher, Role Switcher, Notifications, User Profile & Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Device Layout Viewport Switcher */}
            <div className="relative" ref={deviceMenuRef}>
              <button
                onClick={() => setShowDeviceMenu(!showDeviceMenu)}
                className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors border border-slate-700/80"
                title={`Device Preference: ${devicePreference} (Click to change)`}
              >
                {devicePreference === 'mobile' ? (
                  <Smartphone className="w-3.5 h-3.5 text-teal-400" />
                ) : devicePreference === 'tablet' ? (
                  <Tablet className="w-3.5 h-3.5 text-teal-400" />
                ) : devicePreference === 'desktop' ? (
                  <Laptop className="w-3.5 h-3.5 text-teal-400" />
                ) : (
                  <Monitor className="w-3.5 h-3.5 text-teal-400" />
                )}
                <span className="hidden md:inline capitalize text-[11px]">
                  {devicePreference === 'responsive' ? 'Auto Fluid' : devicePreference}
                </span>
              </button>

              {showDeviceMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl py-1.5 z-50 text-slate-800 dark:text-slate-100">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                    Device Viewport Preference
                  </div>
                  {[
                    { id: 'responsive', label: 'Auto Responsive', desc: 'Fluid 100% viewport', icon: Monitor },
                    { id: 'desktop', label: 'Desktop Frame', desc: '1360px workstation frame', icon: Laptop },
                    { id: 'tablet', label: 'Tablet Frame', desc: '820px iPad touch view', icon: Tablet },
                    { id: 'mobile', label: 'Mobile Frame', desc: '420px smartphone frame', icon: Smartphone },
                  ].map((dev) => {
                    const DevIcon = dev.icon;
                    const isSelected = devicePreference === dev.id;
                    return (
                      <button
                        key={dev.id}
                        onClick={() => {
                          onChangeDevicePreference(dev.id as DevicePreference);
                          setShowDeviceMenu(false);
                        }}
                        className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between transition-colors ${
                          isSelected
                            ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-900 dark:text-teal-200 font-bold'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <DevIcon className={`w-3.5 h-3.5 ${isSelected ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400'}`} />
                          <div>
                            <div>{dev.label}</div>
                            <div className="text-[10px] text-slate-400 font-normal">{dev.desc}</div>
                          </div>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Background Theme Switcher Button */}
            <button
              onClick={() => onToggleTheme(themePreference === 'dark' ? 'light' : 'dark')}
              className={`p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors border ${
                themePreference === 'dark'
                  ? 'border-amber-400/40 bg-amber-400/10 text-amber-300'
                  : 'border-slate-700/80 text-teal-300'
              }`}
              title={`Theme: ${themePreference === 'dark' ? 'Dark' : 'Light'} Mode (Click to toggle)`}
              aria-label="Toggle dark/light background theme"
            >
              {themePreference === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-teal-300" />
              )}
            </button>

            {/* Authenticated Account Role Badge (Non-toggleable: Changing accounts requires logging out) */}
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border ${
                userRole === 'admin'
                  ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                  : 'bg-teal-500/15 border-teal-500/30 text-teal-300'
              }`}
              title={`Logged in as ${userRole === 'admin' ? 'Administrator (ADM001)' : 'Student (STU001)'}`}
            >
              {userRole === 'admin' ? (
                <ShieldCheck className="w-4 h-4 text-amber-400" />
              ) : (
                <GraduationCap className="w-4 h-4 text-teal-400" />
              )}
              <span className="hidden sm:inline">
                {userRole === 'admin' ? 'Admin · ADM001' : 'Student · STU001'}
              </span>
            </div>

            {/* Logout Action */}
            {onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-300 bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 hover:border-rose-400 transition-all cursor-pointer"
                title="Log out of current demo account"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            )}

            {/* Notification Bell Dropdown */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-slate-900" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-2xl py-2 z-50 text-slate-800">
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
                            if (item.linkTab) onSelectTab(item.linkTab);
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
                        No notifications
                      </div>
                    )}
                  </div>

                  <div className="px-3 pt-2 pb-1 border-t border-slate-100 text-center">
                    <button
                      onClick={() => {
                        onSelectTab(userRole === 'admin' ? 'admin-notices' : 'notices');
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
                className="flex items-center gap-2 p-1 pl-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                aria-label="User profile menu"
              >
                <div className="w-7 h-7 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 font-semibold text-xs flex items-center justify-center">
                  {userRole === 'student' ? 'RP' : 'SM'}
                </div>
                <div className="hidden lg:block text-left">
                  <div className="text-xs font-semibold text-white leading-tight">
                    {userRole === 'student' ? student.name : admin.name}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono leading-tight">
                    {userRole === 'student' ? student.regNo : admin.employeeId}
                  </div>
                </div>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-2xl py-2 z-50 text-slate-800">
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
                    {userRole === 'student' ? (
                      <>
                        <button
                          onClick={() => {
                            onSelectTab('profile');
                            setShowProfileMenu(false);
                          }}
                          className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          View Full Academic Profile
                        </button>
                        <button
                          onClick={() => {
                            onSelectTab('fees');
                            setShowProfileMenu(false);
                          }}
                          className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <span className="font-mono text-xs text-slate-400">₹</span>
                          Fee Statement & Dues
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            onSelectTab('admin-profile');
                            setShowProfileMenu(false);
                          }}
                          className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                          My Staff Profile & Leaves
                        </button>
                        <button
                          onClick={() => {
                            onSelectTab('admin-courses');
                            setShowProfileMenu(false);
                          }}
                          className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                          Courses & Timetable
                        </button>
                      </>
                    )}
                    {/* Quick Theme & Device Preferences in Profile Dropdown */}
                    <div className="border-t border-slate-100 dark:border-slate-800 mt-1 pt-2 px-3 pb-2">
                      <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                        <span>Background Theme</span>
                        <span className="capitalize text-teal-600 font-mono text-[9px]">{themePreference}</span>
                      </div>
                      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg mb-2">
                        <button
                          onClick={() => onToggleTheme('light')}
                          className={`flex-1 py-1 rounded text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors ${
                            themePreference === 'light'
                              ? 'bg-white text-slate-900 shadow-xs'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          <Sun className="w-3 h-3 text-amber-500" />
                          Light
                        </button>
                        <button
                          onClick={() => onToggleTheme('dark')}
                          className={`flex-1 py-1 rounded text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors ${
                            themePreference === 'dark'
                              ? 'bg-slate-900 text-white shadow-xs'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          <Moon className="w-3 h-3 text-teal-400" />
                          Dark
                        </button>
                      </div>

                      <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-between">
                        <span>Device Viewport</span>
                        <span className="capitalize text-teal-600 font-mono text-[9px]">{devicePreference}</span>
                      </div>
                      <div className="grid grid-cols-4 gap-1 text-[10px]">
                        {[
                          { id: 'responsive', label: 'Fluid', icon: Monitor },
                          { id: 'desktop', label: 'PC', icon: Laptop },
                          { id: 'tablet', label: 'Tab', icon: Tablet },
                          { id: 'mobile', label: 'Phone', icon: Smartphone },
                        ].map((d) => (
                          <button
                            key={d.id}
                            onClick={() => onChangeDevicePreference(d.id as DevicePreference)}
                            className={`py-1 px-0.5 rounded text-center font-medium transition-colors ${
                              devicePreference === d.id
                                ? 'bg-teal-50 text-teal-800 border border-teal-300 font-bold'
                                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            {d.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {onLogout && (
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          onLogout();
                        }}
                        className="w-full px-4 py-2 text-left text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 border-t border-slate-100 dark:border-slate-800 mt-1 pt-2 font-semibold"
                      >
                        <LogOut className="w-3.5 h-3.5 text-rose-500" />
                        Log Out (Switch Account)
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Lower Secondary Tier: Horizontal Navigation Bar (Desktop) */}
      <div className="hidden lg:block bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative flex items-center">
          {/* Left scroll chevron */}
          <button
            onClick={() => scrollNav('left')}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md shrink-0 mr-1"
            title="Scroll navigation left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Navigation Items Scroll Container */}
          <nav
            ref={navScrollRef}
            className="flex-1 flex items-center gap-1 overflow-x-auto py-1.5 scrollbar-none no-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {activeNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              let badge = null;
              if (userRole === 'student') {
                if (item.id === 'assignments' && pendingAssignmentsCount > 0) {
                  badge = pendingAssignmentsCount;
                }
              } else {
                if (item.id === 'admin-cl-approvals' && pendingLeavesCount > 0) {
                  badge = pendingLeavesCount;
                } else if (item.id === 'admin-hl-approvals' && pendingHLCount > 0) {
                  badge = pendingHLCount;
                } else if (item.id === 'admin-grading' && pendingGradingCount > 0) {
                  badge = pendingGradingCount;
                } else if (item.id === 'admin-helpdesk' && openHelpdeskCount > 0) {
                  badge = openHelpdeskCount;
                }
              }

              return (
                <button
                  key={item.id}
                  data-active={isActive}
                  onClick={() => onSelectTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 transition-colors ${
                      isActive ? 'text-teal-400' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                  {badge !== null && (
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                        isActive
                          ? 'bg-amber-400 text-slate-950 font-bold'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right scroll chevron */}
          <button
            onClick={() => scrollNav('right')}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md shrink-0 ml-1"
            title="Scroll navigation right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Collapsible Navigation Menu Drawer (Smaller Screens) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 text-white animate-in slide-in-from-top-2 duration-150">
          {/* Mobile search bar */}
          <div className="p-4 border-b border-slate-800">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={
                  userRole === 'admin'
                    ? 'Search courses, grading, approvals...'
                    : 'Search courses, leaves, notices...'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs text-white bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-400"
              />
            </div>
            {searchQuery && (
              <div className="mt-2 bg-slate-800 rounded-lg border border-slate-700 p-2 text-xs space-y-1">
                {searchResults.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      onSelectTab(item.tab);
                      setMobileMenuOpen(false);
                      setSearchQuery('');
                    }}
                    className="w-full text-left p-1.5 text-slate-200 hover:text-white hover:bg-slate-700 rounded flex justify-between"
                  >
                    <span>{item.label}</span>
                    <span className="text-[10px] text-slate-400">{item.type}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Navigation Items List */}
          <div className="px-3 py-3 grid grid-cols-1 sm:grid-cols-2 gap-1 max-h-[70vh] overflow-y-auto">
            {activeNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              let badge = null;
              if (userRole === 'student') {
                if (item.id === 'assignments' && pendingAssignmentsCount > 0) {
                  badge = pendingAssignmentsCount;
                }
              } else {
                if (item.id === 'admin-cl-approvals' && pendingLeavesCount > 0) {
                  badge = pendingLeavesCount;
                } else if (item.id === 'admin-hl-approvals' && pendingHLCount > 0) {
                  badge = pendingHLCount;
                } else if (item.id === 'admin-grading' && pendingGradingCount > 0) {
                  badge = pendingGradingCount;
                } else if (item.id === 'admin-helpdesk' && openHelpdeskCount > 0) {
                  badge = openHelpdeskCount;
                }
              }

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center justify-between p-2.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-teal-600 text-white font-bold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-teal-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {badge !== null && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-amber-400 text-slate-950 font-bold">
                      {badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Mobile Footer with Theme, Device & User Status */}
          <div className="p-3 border-t border-slate-800 bg-slate-950/70 space-y-2.5 text-xs text-slate-300">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Appearance Theme:</span>
              <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-lg">
                <button
                  onClick={() => onToggleTheme('light')}
                  className={`px-2 py-0.5 rounded text-[11px] flex items-center gap-1 ${
                    themePreference === 'light' ? 'bg-white text-slate-900 font-bold' : 'text-slate-400'
                  }`}
                >
                  <Sun className="w-3 h-3 text-amber-500" />
                  Light
                </button>
                <button
                  onClick={() => onToggleTheme('dark')}
                  className={`px-2 py-0.5 rounded text-[11px] flex items-center gap-1 ${
                    themePreference === 'dark' ? 'bg-slate-900 text-teal-300 font-bold' : 'text-slate-400'
                  }`}
                >
                  <Moon className="w-3 h-3 text-teal-400" />
                  Dark
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-400" />
                <span className="truncate max-w-[160px]">{userRole === 'student' ? `${student.name} (STU001)` : `${admin.name} (ADM001)`}</span>
              </div>
              {onLogout && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
