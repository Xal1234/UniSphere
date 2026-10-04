import React, { lazy, Suspense, useState, useEffect, useRef } from 'react';
import { Smartphone, Tablet, Laptop, Monitor, Sun, Moon } from 'lucide-react';
import { UserRole } from './types';
import {
  initialStudentProfile,
  initialAdminProfile,
  initialAttendanceCourses,
  initialTimetable,
  initialClassLeaves,
  initialHostelLeaves,
  initialAssignments,
  initialEvents,
  initialSemesterResults,
  initialFeeBreakdowns,
  initialFeeTransactions,
  initialAdmissions,
  initialNotices,
  initialBorrowedBooks,
  initialCatalogBooks,
  initialHelpdeskTickets,
  initialStudentDocuments,
  initialNotifications,
  initialAdminNotifications,
  initialAttendanceRecords,
  initialFacultyCourses,
  initialStaffTimetable,
  initialStudentDirectory,
  initialStaffLeaves,
} from './data/mockData';
import { HorizontalNavbar, navItems } from './components/layout/HorizontalNavbar';
import {
  Assignment,
  StaffLeaveRequest,
  Notice,
  CampusEvent,
  ThemePreference,
  DevicePreference,
  ClassAttendanceRecord,
  AppNotification,
} from './types';

const LoginView = lazy(() => import('./views/LoginView').then((m) => ({ default: m.LoginView })));
const DashboardView = lazy(() => import('./views/DashboardView').then((m) => ({ default: m.DashboardView })));
const AttendanceView = lazy(() => import('./views/AttendanceView').then((m) => ({ default: m.AttendanceView })));
const ClassLeaveView = lazy(() => import('./views/ClassLeaveView').then((m) => ({ default: m.ClassLeaveView })));
const HostelLeaveView = lazy(() => import('./views/HostelLeaveView').then((m) => ({ default: m.HostelLeaveView })));
const AssignmentsView = lazy(() => import('./views/AssignmentsView').then((m) => ({ default: m.AssignmentsView })));
const EventsView = lazy(() => import('./views/EventsView').then((m) => ({ default: m.EventsView })));
const AcademicsView = lazy(() => import('./views/AcademicsView').then((m) => ({ default: m.AcademicsView })));
const FeesView = lazy(() => import('./views/FeesView').then((m) => ({ default: m.FeesView })));
const AdmissionsView = lazy(() => import('./views/AdmissionsView').then((m) => ({ default: m.AdmissionsView })));
const NoticesView = lazy(() => import('./views/NoticesView').then((m) => ({ default: m.NoticesView })));
const LibraryView = lazy(() => import('./views/LibraryView').then((m) => ({ default: m.LibraryView })));
const HelpdeskView = lazy(() => import('./views/HelpdeskView').then((m) => ({ default: m.HelpdeskView })));
const ProfileDocumentsView = lazy(() => import('./views/ProfileDocumentsView').then((m) => ({ default: m.ProfileDocumentsView })));
const AdminDashboardView = lazy(() => import('./views/admin/AdminDashboardView').then((m) => ({ default: m.AdminDashboardView })));
const AdminCoursesTimetableView = lazy(() => import('./views/admin/AdminCoursesTimetableView').then((m) => ({ default: m.AdminCoursesTimetableView })));
const AdminAttendanceMarkingView = lazy(() => import('./views/admin/AdminAttendanceMarkingView').then((m) => ({ default: m.AdminAttendanceMarkingView })));
const AdminAssignmentsGradingView = lazy(() => import('./views/admin/AdminAssignmentsGradingView').then((m) => ({ default: m.AdminAssignmentsGradingView })));
const AdminStudentsDirectoryView = lazy(() => import('./views/admin/AdminStudentsDirectoryView').then((m) => ({ default: m.AdminStudentsDirectoryView })));
const AdminStaffProfileView = lazy(() => import('./views/admin/AdminStaffProfileView').then((m) => ({ default: m.AdminStaffProfileView })));

const DEMO_DATA_KEY = 'campusone_demo_data_v1';

const loadDemoData = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(DEMO_DATA_KEY);
    if (raw) {
      const saved = JSON.parse(raw) as Record<string, unknown>;
      if (saved[key] !== undefined) return saved[key] as T;
    }
  } catch {
    // Ignore unavailable storage or an older/corrupt demo snapshot and use the seed data.
  }
  return fallback;
};

export default function App() {
  // Authentication State (Demo accounts: STU001 / Student@123, ADM001 / Admin@123)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('campusone_auth') !== null;
  });

  const [authenticatedAccountId, setAuthenticatedAccountId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('campusone_auth');
      if (saved) {
        return JSON.parse(saved).accountId || 'STU001';
      }
    } catch {}
    return 'STU001';
  });

  // App Navigation and Role State
  const [userRole, setUserRole] = useState<UserRole>(() => {
    try {
      const saved = localStorage.getItem('campusone_auth');
      if (saved) {
        return JSON.parse(saved).role || 'student';
      }
    } catch {}
    return 'student';
  });

  const [currentTab, setCurrentTab] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('campusone_auth');
      if (saved && JSON.parse(saved).role === 'admin') {
        return 'admin-dashboard';
      }
    } catch {}
    return 'dashboard';
  });

  // Login & Logout Handlers (Enforces credential-based login; no unrestricted toggle)
  const handleLogin = (role: UserRole, accountId: string) => {
    setUserRole(role);
    setAuthenticatedAccountId(accountId);
    setIsAuthenticated(true);
    setCurrentTab(role === 'admin' ? 'admin-dashboard' : 'dashboard');
    localStorage.setItem('campusone_auth', JSON.stringify({ role, accountId }));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('campusone_auth');
  };

  // Core Data States
  const [student, setStudent] = useState(initialStudentProfile);
  const [admin, setAdmin] = useState(initialAdminProfile);
  const [attendanceCourses, setAttendanceCourses] = useState(() => loadDemoData('attendanceCourses', initialAttendanceCourses));
  const [timetable, setTimetable] = useState(initialTimetable);
  const [classLeaves, setClassLeaves] = useState(() => loadDemoData('classLeaves', initialClassLeaves));
  const [hostelLeaves, setHostelLeaves] = useState(() => loadDemoData('hostelLeaves', initialHostelLeaves));
  const [assignments, setAssignments] = useState(() => loadDemoData('assignments', initialAssignments));
  const [events, setEvents] = useState(() => loadDemoData('events', initialEvents));
  const [results, setResults] = useState(() => loadDemoData('results', initialSemesterResults));
  const [feeBreakdowns, setFeeBreakdowns] = useState(() => loadDemoData('feeBreakdowns', initialFeeBreakdowns));
  const [feeTransactions, setFeeTransactions] = useState(() => loadDemoData('feeTransactions', initialFeeTransactions));
  const [admissions, setAdmissions] = useState(() => loadDemoData('admissions', initialAdmissions));
  const [notices, setNotices] = useState(() => loadDemoData('notices', initialNotices));
  const [borrowedBooks, setBorrowedBooks] = useState(() => loadDemoData('borrowedBooks', initialBorrowedBooks));
  const [catalogBooks, setCatalogBooks] = useState(() => loadDemoData('catalogBooks', initialCatalogBooks));
  const [helpdeskTickets, setHelpdeskTickets] = useState(() => loadDemoData('helpdeskTickets', initialHelpdeskTickets));
  const [documents, setDocuments] = useState(() => loadDemoData('documents', initialStudentDocuments));
  const [notifications, setNotifications] = useState<AppNotification[]>(() =>
    loadDemoData('notifications', [...initialNotifications, ...initialAdminNotifications])
  );

  // Attendance Records State (Stores separate records for different courses, dates, and sessions)
  const [attendanceRecords, setAttendanceRecords] = useState<ClassAttendanceRecord[]>(() => loadDemoData('attendanceRecords', initialAttendanceRecords));
  const attendanceSessionKeys = useRef(new Set(attendanceRecords.map((record) => `${record.courseCode}|${record.sessionDate}|${record.sessionPeriod}`)));

  // Admin Specific Core Data States
  const [facultyCourses, setFacultyCourses] = useState(() => loadDemoData('facultyCourses', initialFacultyCourses));
  const [staffTimetable, setStaffTimetable] = useState(initialStaffTimetable);
  const [studentDirectory, setStudentDirectory] = useState(() => loadDemoData('studentDirectory', initialStudentDirectory));
  const [staffLeaves, setStaffLeaves] = useState(() => loadDemoData('staffLeaves', initialStaffLeaves));

  // Keep prototype actions across reloads on this device; this is local demo storage, not a shared server.
  useEffect(() => {
    try {
      localStorage.setItem(DEMO_DATA_KEY, JSON.stringify({
        attendanceCourses,
        classLeaves,
        hostelLeaves,
        assignments,
        events,
        results,
        feeBreakdowns,
        feeTransactions,
        admissions,
        notices,
        borrowedBooks,
        catalogBooks,
        helpdeskTickets,
        documents,
        notifications,
        attendanceRecords,
        facultyCourses,
        studentDirectory,
        staffLeaves,
      }));
    } catch {
      // Keep the portal usable if private browsing or storage limits disable persistence.
    }
  }, [attendanceCourses, classLeaves, hostelLeaves, assignments, events, results, feeBreakdowns, feeTransactions,
    admissions, notices, borrowedBooks, catalogBooks, helpdeskTickets, documents, notifications, attendanceRecords,
    facultyCourses, studentDirectory, staffLeaves]);

  useEffect(() => {
    if (notifications.some((notification) => !notification.deliveredAt)) {
      const deliveredAt = new Date().toISOString();
      setNotifications((prev) => prev.map((notification) => ({
        ...notification,
        deliveredAt: notification.deliveredAt || deliveredAt,
      })));
    }
  }, [notifications]);

  // Background Theme & Device Preferences State
  const [themePreference, setThemePreference] = useState<ThemePreference>(() => {
    const saved = localStorage.getItem('campusone_theme');
    return (saved === 'dark' || saved === 'light' || saved === 'system') ? saved : 'light';
  });

  const [devicePreference, setDevicePreference] = useState<DevicePreference>(() => {
    const saved = localStorage.getItem('campusone_device');
    return (saved === 'desktop' || saved === 'tablet' || saved === 'mobile' || saved === 'responsive') ? saved : 'responsive';
  });
  const [isOnline, setIsOnline] = useState(() => typeof navigator === 'undefined' || navigator.onLine);

  // Synchronize Dark Mode CSS Class with HTML document
  useEffect(() => {
    const root = document.documentElement;
    const isDark =
      themePreference === 'dark' ||
      (themePreference === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [themePreference]);

  useEffect(() => {
    const updateOnlineState = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', updateOnlineState);
    window.addEventListener('offline', updateOnlineState);
    return () => {
      window.removeEventListener('online', updateOnlineState);
      window.removeEventListener('offline', updateOnlineState);
    };
  }, []);

  useEffect(() => {
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      navigator.serviceWorker.register('/service-worker.js').catch(() => undefined);
    }
  }, []);

  const handleToggleTheme = (theme?: ThemePreference) => {
    const nextTheme = theme || (themePreference === 'dark' ? 'light' : 'dark');
    setThemePreference(nextTheme);
    localStorage.setItem('campusone_theme', nextTheme);
  };

  const handleChangeDevicePreference = (device: DevicePreference) => {
    setDevicePreference(device);
    localStorage.setItem('campusone_device', device);
  };

  // Quick Action Trigger flags
  const [openCLModal, setOpenCLModal] = useState<boolean>(false);
  const [openHLModal, setOpenHLModal] = useState<boolean>(false);
  const [openFeeModal, setOpenFeeModal] = useState<boolean>(false);
  const [openCreateAssignmentModal, setOpenCreateAssignmentModal] = useState<boolean>(false);
  const [openStaffLeaveModal, setOpenStaffLeaveModal] = useState<boolean>(false);
  const [initialAssignmentSubmitId, setInitialAssignmentSubmitId] = useState<string | null>(null);

  // Toggle Role handler with automated appropriate landing tab
  const handleToggleRole = () => {
    if (userRole === 'student') {
      setUserRole('admin');
      setCurrentTab('admin-dashboard');
    } else {
      setUserRole('student');
      setCurrentTab('dashboard');
    }
  };

  // Class Leave Handlers
  const handleApplyCL = (newLeaveData: Parameters<React.ComponentProps<typeof ClassLeaveView>['onApplyLeave']>[0]) => {
    const newId = `CL-2026-${String(classLeaves.length + 101).padStart(3, '0')}`;
    const newRecord = {
      ...newLeaveData,
      id: newId,
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'Pending' as const,
    };
    setClassLeaves((prev) => [newRecord, ...prev]);
    const createdAt = new Date().toISOString();
    setNotifications((prev) => [
      { id: `NOTIF-${Date.now()}-CL-STU`, title: 'Class Leave Submitted', description: `Application ${newId} submitted for ${newLeaveData.date}.`, time: 'Just now', type: 'leave', read: false, linkTab: 'class-leave', targetRole: 'student', targetUserId: newLeaveData.studentId, readAt: undefined, actionedAt: undefined },
      { id: `NOTIF-${Date.now()}-CL-ADM`, title: 'Class Leave Request Received', description: `${newLeaveData.studentName} submitted ${newId} for review.`, time: 'Just now', type: 'leave', read: false, linkTab: 'admin-cl-approvals', targetRole: 'admin', readAt: undefined, actionedAt: undefined, deliveredAt: createdAt },
      ...prev,
    ]);
  };

  const handleUpdateCLStatus = (id: string, status: 'Approved' | 'Rejected', remark?: string) => {
    const request = classLeaves.find((item) => item.id === id);
    setClassLeaves((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status,
              reviewedBy: admin.name,
              reviewedAt: new Date().toISOString().substring(0, 10),
              adminRemark: remark || (status === 'Approved' ? 'Approved by Admin' : 'Rejected'),
            }
          : item
      )
    );
    if (request) {
      setNotifications((prev) => [{
        id: `NOTIF-${Date.now()}-CL-RESULT`,
        title: `Class Leave ${status}`,
        description: `${request.id} for ${request.date} was ${status.toLowerCase()}.${remark ? ` ${remark}` : ''}`,
        time: 'Just now', type: 'leave', read: false, linkTab: 'class-leave', targetRole: 'student', targetUserId: request.studentId,
      }, ...prev]);
    }
  };

  // Hostel Leave Handlers
  const handleApplyHL = (newLeaveData: Parameters<React.ComponentProps<typeof HostelLeaveView>['onApplyHostelLeave']>[0]) => {
    const newId = `HL-2026-${String(hostelLeaves.length + 501).padStart(4, '0')}`;
    const newGatePass = `GP-BH2-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRecord = {
      ...newLeaveData,
      id: newId,
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'Pending' as const,
      gatePassId: newGatePass,
    };
    setHostelLeaves((prev) => [newRecord, ...prev]);
    setNotifications((prev) => [
      { id: `NOTIF-${Date.now()}-HL-STU`, title: 'Hostel Leave Submitted', description: `Outpass requisition ${newId} sent to Warden.`, time: 'Just now', type: 'leave', read: false, linkTab: 'hostel-leave', targetRole: 'student', targetUserId: newRecord.studentId },
      { id: `NOTIF-${Date.now()}-HL-ADM`, title: 'Hostel Leave Request Received', description: `${newRecord.studentName} submitted ${newId} for warden review.`, time: 'Just now', type: 'leave', read: false, linkTab: 'admin-hl-approvals', targetRole: 'admin' },
      ...prev,
    ]);
  };

  const handleUpdateHLStatus = (id: string, status: 'Approved' | 'Rejected', remark?: string) => {
    const request = hostelLeaves.find((item) => item.id === id);
    setHostelLeaves((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status,
              wardenRemark: remark || (status === 'Approved' ? 'Warden phone consent logged. Pass active.' : 'Rejected'),
            }
          : item
      )
    );
    if (request) {
      setNotifications((prev) => [{
        id: `NOTIF-${Date.now()}-HL-RESULT`, title: `Hostel Leave ${status}`,
        description: `${request.id} was ${status.toLowerCase()} by the warden.${remark ? ` ${remark}` : ''}`,
        time: 'Just now', type: 'leave', read: false, linkTab: 'hostel-leave', targetRole: 'student', targetUserId: request.studentId,
      }, ...prev]);
    }
  };

  // Assignment Submit Handler
  const handleSubmitAssignment = (id: string, note?: string) => {
    setAssignments((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: 'Submitted' as const,
              submittedDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
              submissionNote: note || 'Uploaded solutions file',
            }
          : a
      )
    );
    setNotifications((prev) => [
      { id: `NOTIF-${Date.now()}-ASN-STU`, title: 'Assignment Submitted', description: 'Coursework uploaded successfully for evaluation.', time: 'Just now', type: 'assignment', read: false, linkTab: 'assignments', targetRole: 'student', targetUserId: student.id },
      { id: `NOTIF-${Date.now()}-ASN-ADM`, title: 'Assignment Submission Received', description: `A submission is ready for grading.`, time: 'Just now', type: 'assignment', read: false, linkTab: 'admin-grading', targetRole: 'admin' },
      ...prev,
    ]);
  };

  const handleGradeAssignment = (id: string, marks: number, feedback: string) => {
    setAssignments((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: 'Evaluated' as const,
              marksObtained: marks,
              feedback,
            }
          : a
      )
    );
    setNotifications((prev) => [{
      id: `NOTIF-${Date.now()}-ASN-GRADE`, title: 'Assignment Evaluated & Graded',
      description: `Score: ${marks} marks recorded with faculty feedback.`, time: 'Just now', type: 'assignment', read: false,
      linkTab: 'assignments', targetRole: 'student', targetUserId: student.id,
    }, ...prev]);
  };

  // Admin Assignment Creator Handler
  const handleCreateAssignment = (newAsn: Omit<Assignment, 'id' | 'status' | 'submittedDate' | 'marksObtained' | 'feedback' | 'submissionNote'>) => {
    const newId = `ASN-${String(assignments.length + 1).padStart(2, '0')}`;
    const created: Assignment = {
      ...newAsn,
      id: newId,
      status: 'Pending',
    };
    setAssignments((prev) => [created, ...prev]);
    setNotifications((prev) => [{
      id: `NOTIF-${Date.now()}-ASN-NEW`, title: 'New Course Assignment Created',
      description: `${newAsn.courseCode}: ${newAsn.title} is due ${newAsn.dueDate}.`, time: 'Just now', type: 'assignment', read: false,
      linkTab: 'assignments', targetRole: 'student', targetUserId: student.id,
    }, ...prev]);
  };

  // Admin Class Attendance Session Handler (with duplicate prevention and correction support)
  const handleSaveAttendanceRecord = (record: ClassAttendanceRecord, isCorrection: boolean) => {
    if (userRole !== 'admin') return;
    const sessionKey = `${record.courseCode}|${record.sessionDate}|${record.sessionPeriod}`;
    const sessionAlreadyExists = attendanceSessionKeys.current.has(sessionKey);
    if (sessionAlreadyExists && !isCorrection) return;
    if (!sessionAlreadyExists && isCorrection) return;
    if (!sessionAlreadyExists) attendanceSessionKeys.current.add(sessionKey);

    if (isCorrection) {
      // Update existing record without creating a duplicate
      setAttendanceRecords((prev) =>
        prev.map((r) => (r.id === record.id ? record : r))
      );
    } else {
      // New attendance record: append and increment conducted class count
      setAttendanceRecords((prev) => [record, ...prev]);

      setFacultyCourses((prev) =>
        prev.map((c) =>
          c.code === record.courseCode
            ? {
                ...c,
                conductedClasses: c.conductedClasses + 1,
              }
            : c
        )
      );

      const currentStudentDirectoryId = studentDirectory.find((s) => s.regNo === student.regNo)?.id || student.id;
      const isCurrentStudentPresent = record.presentStudentIds.includes(currentStudentDirectoryId);
      setAttendanceCourses((prev) =>
        prev.map((c) =>
          c.code === record.courseCode
            ? {
                ...c,
                conducted: c.conducted + 1,
                attended: isCurrentStudentPresent ? c.attended + 1 : c.attended,
                percentage: Math.round(
                  ((isCurrentStudentPresent ? c.attended + 1 : c.attended) / (c.conducted + 1)) * 1000
                ) / 10,
              }
            : c
        )
      );
    }

    // Update student directory percentages
    setStudentDirectory((prev) =>
      prev.map((s) => {
        const isPresent = record.presentStudentIds.includes(s.id);
        const newPct = isPresent
          ? Math.min(100, Math.round((s.attendancePct * 0.96 + 4) * 10) / 10)
          : Math.max(0, Math.round((s.attendancePct * 0.95) * 10) / 10);
        return {
          ...s,
          attendancePct: newPct,
          status: newPct < 75 ? 'Attendance Defaulter' : 'Good Standing',
        };
      })
    );

    // NOTIFICATIONS HANDLING - Strictly role-specific:
    // 1. Admin gets private save confirmation (never shown to student)
    const adminNotification: AppNotification = {
      id: `NOTIF-${Date.now()}-ADM`,
      title: isCorrection ? 'Attendance Record Corrected' : 'Attendance Session Saved',
      description: `Class attendance for ${record.courseCode} on ${record.sessionDate} (${record.sessionPeriod}) ${
        isCorrection ? 'updated' : 'recorded'
      }: ${record.presentStudentIds.length} present, ${record.absentStudentIds.length} absent.`,
      time: 'Just now',
      type: 'attendance',
      read: false,
      linkTab: 'admin-attendance',
      targetRole: 'admin',
    };

    // 2. Student gets individual personal notification (showing only their own status, opening read-only attendance page)
    const currentStudentDirectoryId = studentDirectory.find((s) => s.regNo === student.regNo)?.id || student.id;
    const isStudentPresent = record.presentStudentIds.includes(currentStudentDirectoryId);
    const studentNotification: AppNotification = {
      id: `NOTIF-${Date.now()}-STU`,
      title: 'Class Attendance Logged',
      description: `You were marked ${isStudentPresent ? 'Present' : 'Absent'} for ${record.courseCode} (${
        record.sessionPeriod
      } on ${record.sessionDate}).`,
      time: 'Just now',
      type: 'attendance',
      read: false,
      linkTab: 'attendance',
      targetRole: 'student',
      targetUserId: currentStudentDirectoryId,
      deliveredAt: new Date().toISOString(),
    };

    setNotifications((prev) => [adminNotification, studentNotification, ...prev]);
  };

  // Admin Staff Leave Submission Handler (Staff cannot approve own leave)
  const handleSubmitStaffLeave = (newLeave: Omit<StaffLeaveRequest, 'id' | 'submittedAt' | 'status' | 'approvedBy'>) => {
    const newId = `SL-2026-${String(staffLeaves.length + 10).padStart(3, '0')}`;
    const record: StaffLeaveRequest = {
      ...newLeave,
      id: newId,
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'Pending',
      approvedBy: 'Registrar Office',
    };
    setStaffLeaves((prev) => [record, ...prev]);
    setNotifications((prev) => [
      {
        id: `NOTIF-${Date.now()}`,
        title: 'Staff Leave Requisition Dispatched',
        description: `Your ${newLeave.leaveType} application ${newId} submitted to Registrar.`,
        time: 'Just now',
        type: 'leave',
        read: false,
        linkTab: 'admin-profile',
        targetRole: 'admin',
      },
      ...prev,
    ]);
  };

  // Event RSVP Handler
  const handleToggleRsvp = (id: string) => {
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id === id) {
          const willRsvp = !e.isRsvpd;
          return {
            ...e,
            isRsvpd: willRsvp,
            attendeesCount: willRsvp ? e.attendeesCount + 1 : Math.max(0, e.attendeesCount - 1),
          };
        }
        return e;
      })
    );
  };

  const handleAddEvent = (newEvent: Parameters<NonNullable<React.ComponentProps<typeof EventsView>['onAddEvent']>>[0]) => {
    const id = `EVT-${String(events.length + 1).padStart(2, '0')}`;
    setEvents((prev) => [
      {
        ...newEvent,
        id,
        attendeesCount: 1,
        isRsvpd: true,
        isPast: false,
      },
      ...prev,
    ]);
    setNotifications((prev) => [{
      id: `NOTIF-${Date.now()}-EVENT`, title: 'New Campus Event Published',
      description: `${newEvent.title} is scheduled for ${newEvent.date}.`, time: 'Just now', type: 'event', read: false,
      linkTab: 'events', targetRole: 'student',
    }, ...prev]);
  };

  const handleUpdateEvent = (id: string, updated: Partial<CampusEvent>) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updated } : e))
    );
  };

  const handleCancelEvent = (id: string) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: 'Cancelled' as const } : e))
    );
    setNotifications((prev) => [
      {
        id: `NOTIF-${Date.now()}`,
        title: 'Campus Event Cancelled',
        description: 'An upcoming campus event was cancelled by the university administration.',
        time: 'Just now',
        type: 'event',
        read: false,
        linkTab: 'events',
        targetRole: 'student',
      },
      ...prev,
    ]);
  };

  // Notice Handlers
  const handlePublishNotice = (newNoticeData: Omit<Notice, 'id'>) => {
    const id = `NOTIF-${String(notices.length + 1).padStart(2, '0')}`;
    const notice: Notice = {
      ...newNoticeData,
      id,
    };
    setNotices((prev) => [notice, ...prev]);
    const audience = notice.audience || 'All Students';
    const noticeRole = audience === 'Staff' ? 'admin' : 'student';
    setNotifications((prev) => [{
      id: `NOTIF-${Date.now()}-NOTICE`, title: 'New Campus Circular Published',
      description: `${notice.title} issued by ${notice.department}.`, time: 'Just now', type: 'notice', read: false,
      linkTab: noticeRole === 'admin' ? 'admin-notices' : 'notices', targetRole: noticeRole, targetAudience: audience,
    }, ...prev]);
  };

  const handleUpdateNotice = (id: string, updated: Partial<Notice>) => {
    setNotices((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...updated } : n))
    );
  };

  // Fee Payment Handler
  const handlePayFee = (category: string, amount: number, mode: Parameters<React.ComponentProps<typeof FeesView>['onPayFee']>[2]) => {
    // 1. Update Fee Breakdowns
    setFeeBreakdowns((prev) =>
      prev.map((b) => {
        if (b.category === category) {
          const newPaid = b.paid + amount;
          const newDue = Math.max(0, b.due - amount);
          return { ...b, paid: newPaid, due: newDue };
        }
        return b;
      })
    );

    // 2. Add New Transaction
    const newTxn = {
      id: `TXN-${Math.floor(10000 + Math.random() * 90000)}`,
      receiptNo: `BPUT/REC/2026/${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().substring(0, 10),
      amount,
      mode,
      category: category.includes('Hostel')
        ? ('Hostel & Mess' as const)
        : category.includes('Exam')
        ? ('Exam Fee' as const)
        : ('Tuition Fee' as const),
      status: 'Successful' as const,
    };
    setFeeTransactions((prev) => [newTxn, ...prev]);

    setNotifications((prev) => [
      {
        id: `NOTIF-${Date.now()}`,
        title: 'Fee Payment Received',
        description: `Payment of ₹${amount.toLocaleString('en-IN')} confirmed. Receipt: ${newTxn.receiptNo}`,
        time: 'Just now',
        type: 'fee',
        read: false,
        linkTab: 'fees',
        targetRole: 'student',
        targetUserId: student.id,
      },
      ...prev,
    ]);
  };

  // Admissions Status Update Handler
  const handleUpdateApplicantStatus = (
    applicantId: string,
    newStatus: Parameters<React.ComponentProps<typeof AdmissionsView>['onUpdateApplicantStatus']>[1],
    remarks?: string
  ) => {
    setAdmissions((prev) =>
      prev.map((app) =>
        app.id === applicantId
          ? {
              ...app,
              status: newStatus,
              remarks: remarks || app.remarks,
            }
          : app
      )
    );
  };

  // Library Handlers
  const handleRenewBook = (borrowedId: string) => {
    setBorrowedBooks((prev) =>
      prev.map((b) =>
        b.id === borrowedId
          ? {
              ...b,
              status: 'Active' as const,
              renewalsLeft: Math.max(0, b.renewalsLeft - 1),
              dueDate: '2026-10-26',
            }
          : b
      )
    );
  };

  const handleReserveBook = (catalogId: string) => {
    setCatalogBooks((prev) =>
      prev.map((bk) =>
        bk.id === catalogId
          ? {
              ...bk,
              availableCopies: Math.max(0, bk.availableCopies - 1),
            }
          : bk
      )
    );
  };

  // Helpdesk Handlers
  const handleCreateTicket = (ticketData: Parameters<React.ComponentProps<typeof HelpdeskView>['onCreateTicket']>[0]): string => {
    const num = Date.now().toString().slice(-6);
    const newTkt = {
      ...ticketData,
      id: `TKT-2026-${num}`,
      ticketNo: `HD-2026-${num}`,
      status: 'Open' as const,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setHelpdeskTickets((prev) => [newTkt, ...prev]);
    setNotifications((prev) => [
      { id: `NOTIF-${Date.now()}-TKT-ADM`, title: 'New Helpdesk Request', description: `${newTkt.ticketNo} · ${newTkt.category} · ${newTkt.priority} priority.`, time: 'Just now', type: 'service', read: false, linkTab: 'admin-helpdesk', targetRole: 'admin' },
      { id: `NOTIF-${Date.now()}-TKT-STU`, title: 'Service Request Registered', description: `${newTkt.ticketNo} is open. Keep this number to track your request.`, time: 'Just now', type: 'service', read: false, linkTab: 'helpdesk', targetRole: 'student', targetUserId: newTkt.studentId },
      ...prev,
    ]);
    return newTkt.ticketNo;
  };

  const handleUpdateTicketStatus = (
    id: string,
    status: Parameters<React.ComponentProps<typeof HelpdeskView>['onUpdateTicketStatus']>[1],
    resolution?: string
  ) => {
    if (userRole !== 'admin') return;
    const ticket = helpdeskTickets.find((item) => item.id === id);
    if (!ticket) return;
    const serviceDesk: Record<string, string> = {
      'Hostel Maintenance': 'Facilities & Hostel Maintenance Desk',
      'Wi-Fi & LAN': 'Network Operations Desk',
      'ERP & Portal': 'University ERP Cell',
      'Exam Cell': 'Examination Cell',
      'ID Card': 'Student Services Counter',
      Transport: 'Campus Transport Desk',
      Library: 'Central Library Helpdesk',
    };
    setHelpdeskTickets((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status,
              resolution: resolution || t.resolution,
              assignedTo: status === 'In Progress' ? (t.assignedTo || serviceDesk[t.category]) : t.assignedTo,
              updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
            }
          : t
      )
    );
    const recipient = ticket.studentId || studentDirectory.find((s) => s.regNo === ticket.regNo)?.id;
    setNotifications((prev) => [{
      id: `NOTIF-${Date.now()}-TKT-STATUS`,
      title: status === 'Resolved' ? 'Service Request Resolved' : 'Service Request Assigned',
      description: `${ticket.ticketNo} is now ${status.toLowerCase()}.${resolution ? ` ${resolution}` : ''}`,
      time: 'Just now', type: 'service', read: false, linkTab: 'helpdesk', targetRole: 'student', targetUserId: recipient,
    }, ...prev]);
  };

  // Document Upload Handler
  const handleUploadDocument = (name: string) => {
    const newDoc = {
      id: `DOC-0${documents.length + 1}`,
      name,
      type: 'PDF Document',
      fileSize: '1.5 MB',
      status: 'Pending Verification' as const,
      remarks: 'Submitted for registrar scrutiny.',
    };
    setDocuments([...documents, newDoc]);
  };

  // Notifications
  const handleMarkNotificationAsRead = (id: string, actioned = false) => {
    const timestamp = new Date().toISOString();
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? {
        ...n,
        read: true,
        readAt: n.readAt || timestamp,
        ...(actioned ? { actionedAt: timestamp } : {}),
      } : n))
    );
  };

  const handleMarkAllNotificationsAsRead = () => {
    const timestamp = new Date().toISOString();
    setNotifications((prev) => prev.map((n) => {
      const roleMatches = n.targetRole === userRole || n.targetRole === 'both';
      const directoryStudentId = studentDirectory.find((record) => record.regNo === student.regNo)?.id;
      const userMatches = userRole !== 'student' || !n.targetUserId || n.targetUserId === student.id || n.targetUserId === directoryStudentId || n.targetUserId === authenticatedAccountId;
      const audience = n.targetAudience || 'All Students';
      const audienceMatches = userRole !== 'student' || audience === 'All Students' ||
        (audience === 'CSE Students' && /cse|computer science/i.test(student.branch)) ||
        (audience === 'Hostel Residents' && Boolean(student.hostel));
      return roleMatches && userMatches && audienceMatches ? { ...n, read: true, readAt: n.readAt || timestamp } : n;
    }));
  };

  // Current tab label
  const activeNavItem = navItems.find((item) => item.id === currentTab);
  const currentTabLabel = activeNavItem ? activeNavItem.label : 'Dashboard';

  // Counts for badges
  const pendingLeavesCount = classLeaves.filter((l) => l.status === 'Pending').length;
  const pendingAssignmentsCount = assignments.filter((a) => a.status === 'Pending').length;

  // Filter notifications strictly by recipient role (prevents admin notices from leaking to students)
  const isStudentAudience = (audience?: Notice['audience']) => {
    if (!audience || audience === 'All Students') return true;
    if (audience === 'CSE Students') return /cse|computer science/i.test(student.branch);
    if (audience === 'Hostel Residents') return Boolean(student.hostel);
    return false;
  };

  const roleFilteredNotifications = notifications.filter((n) => {
    const roleMatches = n.targetRole === userRole || n.targetRole === 'both';
    const directoryStudentId = studentDirectory.find((record) => record.regNo === student.regNo)?.id;
    const userMatches = userRole !== 'student' || !n.targetUserId || n.targetUserId === student.id || n.targetUserId === directoryStudentId || n.targetUserId === authenticatedAccountId;
    const audienceMatches = userRole !== 'student' || isStudentAudience(n.targetAudience);
    return roleMatches && userMatches && audienceMatches;
  });
  const visibleNotices = userRole === 'admin' ? notices : notices.filter((notice) => isStudentAudience(notice.audience));

  // If user is not logged in, show the single sign-on Login page
  if (!isAuthenticated) {
    return (
      <div className={themePreference === 'dark' ? 'dark' : ''}>
        <Suspense fallback={<div className="min-h-screen grid place-items-center bg-slate-50 text-sm text-slate-500">Opening secure sign-in…</div>}>
          <LoginView onLogin={handleLogin} />
        </Suspense>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        devicePreference !== 'responsive'
          ? 'bg-slate-200 dark:bg-slate-900 py-6 px-2 sm:px-6 flex flex-col items-center justify-start'
          : 'bg-slate-50 dark:bg-slate-950 flex flex-col text-slate-800 dark:text-slate-100'
      }`}
    >
      {/* Device Viewport Preference Simulator Bar (active when specific device preset is selected) */}
      {devicePreference !== 'responsive' && (
        <div className="w-full max-w-4xl mb-4 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 shadow-md flex flex-wrap items-center justify-between gap-3 text-xs z-50">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
            <span className="font-semibold flex items-center gap-1.5">
              {devicePreference === 'mobile' && <Smartphone className="w-4 h-4 text-teal-600 dark:text-teal-400" />}
              {devicePreference === 'tablet' && <Tablet className="w-4 h-4 text-teal-600 dark:text-teal-400" />}
              {devicePreference === 'desktop' && <Laptop className="w-4 h-4 text-teal-600 dark:text-teal-400" />}
              <span className="capitalize">{devicePreference} Viewport Simulator</span>
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              ({devicePreference === 'mobile' ? '420px · iPhone' : devicePreference === 'tablet' ? '820px · iPad' : '1360px · Workstation'})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-100 dark:bg-slate-700 p-0.5 rounded-lg text-[11px]">
              <button
                onClick={() => handleChangeDevicePreference('mobile')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  devicePreference === 'mobile'
                    ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                Mobile
              </button>
              <button
                onClick={() => handleChangeDevicePreference('tablet')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  devicePreference === 'tablet'
                    ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                Tablet
              </button>
              <button
                onClick={() => handleChangeDevicePreference('desktop')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  devicePreference === 'desktop'
                    ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                Desktop
              </button>
              <button
                onClick={() => handleChangeDevicePreference('responsive')}
                className="px-2.5 py-1 rounded font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 transition-colors"
                title="Exit device preview to fluid full screen"
              >
                Auto Fluid
              </button>
            </div>

            <button
              onClick={() => handleToggleTheme()}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition-colors"
              title={`Switch to ${themePreference === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {themePreference === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-teal-600" />}
            </button>
          </div>
        </div>
      )}

      {/* Main App Enclosure (Fluid full-width OR framed device preview) */}
      <div
        className={`w-full text-slate-800 dark:text-slate-100 transition-all duration-300 ${
          devicePreference === 'mobile'
            ? 'max-w-[420px] bg-slate-50 dark:bg-slate-950 border-[10px] border-slate-900 dark:border-slate-800 rounded-[40px] shadow-2xl overflow-hidden'
            : devicePreference === 'tablet'
            ? 'max-w-[820px] bg-slate-50 dark:bg-slate-950 border-[8px] border-slate-900 dark:border-slate-800 rounded-[28px] shadow-2xl overflow-hidden'
            : devicePreference === 'desktop'
            ? 'max-w-[1360px] bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl shadow-2xl overflow-hidden'
            : 'flex-1 flex flex-col'
        }`}
      >
        {/* Device Status Bar for Simulated Mobile */}
        {devicePreference === 'mobile' && (
          <div className="bg-slate-900 py-1.5 px-5 flex items-center justify-between text-white text-[10px] font-mono select-none">
            <span>9:41</span>
            <div className="w-20 h-3.5 bg-black rounded-full" />
            <div className="flex items-center gap-1.5">
              <span>5G</span>
              <div className="w-4 h-2.5 border border-white/80 rounded-xs p-0.5 flex items-center">
                <div className="w-full h-full bg-white rounded-xs" />
              </div>
            </div>
          </div>
        )}

        {/* Browser Top Bar for Simulated Desktop */}
        {devicePreference === 'desktop' && (
          <div className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-2 flex items-center gap-3 select-none">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
            </div>
            <div className="flex-1 max-w-sm mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md px-3 py-1 text-[11px] font-mono text-slate-500 dark:text-slate-400 text-center truncate">
              https://campusone.bput.ac.in/portal
            </div>
          </div>
        )}

        {/* Horizontal Top Navigation Bar with All Sections & Mobile Menu */}
        <HorizontalNavbar
          currentTab={currentTab}
          onSelectTab={(tab) => {
            setCurrentTab(tab);
            setOpenCLModal(false);
            setOpenHLModal(false);
            setOpenFeeModal(false);
            setOpenCreateAssignmentModal(false);
            setOpenStaffLeaveModal(false);
            setInitialAssignmentSubmitId(null);
          }}
          userRole={userRole}
          onToggleRole={handleLogout}
          onLogout={handleLogout}
          notifications={roleFilteredNotifications}
          onMarkNotificationAsRead={handleMarkNotificationAsRead}
          onMarkAllNotificationsAsRead={handleMarkAllNotificationsAsRead}
          student={student}
          admin={admin}
          pendingLeavesCount={pendingLeavesCount}
          pendingAssignmentsCount={pendingAssignmentsCount}
          pendingHLCount={hostelLeaves.filter((l) => l.status === 'Pending').length}
          pendingGradingCount={assignments.filter((a) => a.status === 'Submitted').length}
          openHelpdeskCount={helpdeskTickets.filter((t) => t.status !== 'Resolved').length}
          themePreference={themePreference}
          onToggleTheme={handleToggleTheme}
          devicePreference={devicePreference}
          onChangeDevicePreference={handleChangeDevicePreference}
        />

        {!isOnline && (
          <div role="status" className="mx-4 mt-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs text-amber-900 sm:mx-6 lg:mx-8">
            Offline mode · Saved changes stay on this device until you reconnect. This demo does not sync between devices.
          </div>
        )}

        {/* Main Content Viewport: Preserved exactly as is */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Suspense fallback={<div role="status" className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">Loading this campus service…</div>}>
          {/* Admin / Staff Dedicated Workspace Views */}
          {currentTab === 'admin-dashboard' && (
            <AdminDashboardView
              admin={admin}
              facultyCourses={facultyCourses}
              staffTimetable={staffTimetable}
              studentDirectory={studentDirectory}
              pendingCLCount={pendingLeavesCount}
              pendingHLCount={hostelLeaves.filter((l) => l.status === 'Pending').length}
              pendingGradingCount={assignments.filter((a) => a.status === 'Submitted').length}
              openHelpdeskCount={helpdeskTickets.filter((t) => t.status !== 'Resolved').length}
              helpdeskTickets={helpdeskTickets}
              studentNotifications={notifications.filter((n) => n.targetRole === 'student' || n.targetRole === 'both')}
              events={events}
              notices={visibleNotices}
              onNavigateTab={(tab) => setCurrentTab(tab)}
              onQuickCreateAssignment={() => {
                setOpenCreateAssignmentModal(true);
                setCurrentTab('admin-assignments');
              }}
              onQuickTakeAttendance={() => setCurrentTab('admin-attendance')}
              onQuickPublishNotice={() => setCurrentTab('admin-notices')}
              onQuickApplyStaffLeave={() => {
                setOpenStaffLeaveModal(true);
                setCurrentTab('admin-profile');
              }}
            />
          )}

          {currentTab === 'admin-courses' && (
            <AdminCoursesTimetableView
              courses={facultyCourses}
              timetable={staffTimetable}
              onTakeAttendanceForCourse={() => setCurrentTab('admin-attendance')}
            />
          )}

          {currentTab === 'admin-attendance' && (
            <AdminAttendanceMarkingView
              courses={facultyCourses}
              students={studentDirectory}
              attendanceRecords={attendanceRecords}
              onSaveAttendanceRecord={handleSaveAttendanceRecord}
              adminName={admin.name}
            />
          )}

          {(currentTab === 'admin-assignments' || currentTab === 'admin-grading') && (
            <AdminAssignmentsGradingView
              assignments={assignments}
              courses={facultyCourses}
              onCreateAssignment={handleCreateAssignment}
              onGradeAssignment={handleGradeAssignment}
              openCreateModalDirectly={openCreateAssignmentModal}
            />
          )}

          {currentTab === 'admin-students' && (
            <AdminStudentsDirectoryView students={studentDirectory} />
          )}

          {currentTab === 'admin-cl-approvals' && (
            <ClassLeaveView
              leaves={classLeaves}
              userRole="admin"
              student={student}
              onApplyLeave={handleApplyCL}
              onUpdateStatus={handleUpdateCLStatus}
            />
          )}

          {currentTab === 'admin-hl-approvals' && (
            <HostelLeaveView
              leaves={hostelLeaves}
              userRole="admin"
              student={student}
              onApplyHostelLeave={handleApplyHL}
              onUpdateStatus={handleUpdateHLStatus}
            />
          )}

          {currentTab === 'admin-events' && (
            <EventsView
              events={events}
              userRole="admin"
              onToggleRsvp={handleToggleRsvp}
              onAddEvent={handleAddEvent}
              onUpdateEvent={handleUpdateEvent}
              onCancelEvent={handleCancelEvent}
            />
          )}

          {currentTab === 'admin-notices' && (
            <NoticesView
              notices={visibleNotices}
              userRole="admin"
              onPublishNotice={handlePublishNotice}
              onUpdateNotice={handleUpdateNotice}
            />
          )}

          {currentTab === 'admin-helpdesk' && (
            <HelpdeskView
              tickets={helpdeskTickets}
              userRole="admin"
              student={student}
              students={studentDirectory}
              onCreateTicket={handleCreateTicket}
              onUpdateTicketStatus={handleUpdateTicketStatus}
            />
          )}

          {currentTab === 'admin-admissions' && (
            <AdmissionsView
              applicants={admissions}
              userRole="admin"
              student={student}
              onUpdateApplicantStatus={handleUpdateApplicantStatus}
            />
          )}

          {currentTab === 'admin-fees' && (
            <FeesView
              breakdowns={feeBreakdowns}
              transactions={feeTransactions}
              student={student}
              userRole="admin"
              onPayFee={handlePayFee}
            />
          )}

          {currentTab === 'admin-profile' && (
            <AdminStaffProfileView
              admin={admin}
              staffLeaves={staffLeaves}
              timetable={staffTimetable}
              notices={notices}
              events={events}
              onSubmitStaffLeave={handleSubmitStaffLeave}
              openLeaveModalDirectly={openStaffLeaveModal}
            />
          )}

          {/* Student Experience Views (Preserved Exactly) */}
          {currentTab === 'dashboard' && (
            <DashboardView
              student={student}
              attendanceCourses={attendanceCourses}
              timetable={timetable}
              assignments={assignments}
              events={events}
              notices={visibleNotices}
              feeBreakdowns={feeBreakdowns}
              latestResult={results[0]}
              onNavigate={(tab) => setCurrentTab(tab)}
              onQuickApplyCL={() => {
                setOpenCLModal(true);
                setCurrentTab('class-leave');
              }}
              onQuickApplyHL={() => {
                setOpenHLModal(true);
                setCurrentTab('hostel-leave');
              }}
              onQuickPayFee={() => {
                setOpenFeeModal(true);
                setCurrentTab('fees');
              }}
              onToggleRsvp={handleToggleRsvp}
              onSubmitAssignment={(id) => {
                setInitialAssignmentSubmitId(id);
                setCurrentTab('assignments');
              }}
            />
          )}

          {currentTab === 'attendance' && (
            <AttendanceView courses={attendanceCourses} />
          )}

          {currentTab === 'class-leave' && (
            <ClassLeaveView
              leaves={classLeaves}
              userRole={userRole}
              student={student}
              onApplyLeave={handleApplyCL}
              onUpdateStatus={handleUpdateCLStatus}
              openCreateModalDirectly={openCLModal}
            />
          )}

          {currentTab === 'hostel-leave' && (
            <HostelLeaveView
              leaves={hostelLeaves}
              userRole={userRole}
              student={student}
              onApplyHostelLeave={handleApplyHL}
              onUpdateStatus={handleUpdateHLStatus}
              openCreateModalDirectly={openHLModal}
            />
          )}

          {currentTab === 'assignments' && (
            <AssignmentsView
              assignments={assignments}
              userRole={userRole}
              onSubmitAssignment={handleSubmitAssignment}
              onGradeAssignment={handleGradeAssignment}
              initialSubmitId={initialAssignmentSubmitId}
            />
          )}

          {currentTab === 'events' && (
            <EventsView
              events={events}
              userRole={userRole}
              onToggleRsvp={handleToggleRsvp}
              onAddEvent={handleAddEvent}
              onUpdateEvent={handleUpdateEvent}
              onCancelEvent={handleCancelEvent}
            />
          )}

          {currentTab === 'academics' && (
            <AcademicsView
              results={results}
              currentCourses={attendanceCourses}
              student={student}
            />
          )}

          {currentTab === 'fees' && (
            <FeesView
              breakdowns={feeBreakdowns}
              transactions={feeTransactions}
              student={student}
              userRole={userRole}
              onPayFee={handlePayFee}
              openPayModalDirectly={openFeeModal}
            />
          )}

          {currentTab === 'admissions' && (
            <AdmissionsView
              applicants={admissions}
              userRole={userRole}
              student={student}
              onUpdateApplicantStatus={handleUpdateApplicantStatus}
            />
          )}

          {currentTab === 'notices' && (
            <NoticesView
              notices={visibleNotices}
              userRole={userRole}
              onPublishNotice={handlePublishNotice}
              onUpdateNotice={handleUpdateNotice}
            />
          )}

          {currentTab === 'library' && (
            <LibraryView
              borrowedBooks={borrowedBooks}
              catalogBooks={catalogBooks}
              userRole={userRole}
              onRenewBook={handleRenewBook}
              onReserveBook={handleReserveBook}
            />
          )}

          {currentTab === 'helpdesk' && (
            <HelpdeskView
              tickets={helpdeskTickets}
              userRole={userRole}
              student={student}
              students={studentDirectory}
              onCreateTicket={handleCreateTicket}
              onUpdateTicketStatus={handleUpdateTicketStatus}
            />
          )}

          {currentTab === 'profile' && (
            <ProfileDocumentsView
              student={student}
              admin={admin}
              documents={documents}
              userRole={userRole}
              onUploadDocument={handleUploadDocument}
            />
          )}
          </Suspense>
        </main>
      </div>
    </div>
  );
}
