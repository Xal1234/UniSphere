import React, { useState, useEffect } from 'react';
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
  initialFacultyCourses,
  initialStaffTimetable,
  initialStudentDirectory,
  initialStaffLeaves,
} from './data/mockData';
import { HorizontalNavbar, navItems } from './components/layout/HorizontalNavbar';
import { DashboardView } from './views/DashboardView';
import { AttendanceView } from './views/AttendanceView';
import { ClassLeaveView } from './views/ClassLeaveView';
import { HostelLeaveView } from './views/HostelLeaveView';
import { AssignmentsView } from './views/AssignmentsView';
import { EventsView } from './views/EventsView';
import { AcademicsView } from './views/AcademicsView';
import { FeesView } from './views/FeesView';
import { AdmissionsView } from './views/AdmissionsView';
import { NoticesView } from './views/NoticesView';
import { LibraryView } from './views/LibraryView';
import { HelpdeskView } from './views/HelpdeskView';
import { ProfileDocumentsView } from './views/ProfileDocumentsView';
import { AdminDashboardView } from './views/admin/AdminDashboardView';
import { AdminCoursesTimetableView } from './views/admin/AdminCoursesTimetableView';
import { AdminAttendanceMarkingView } from './views/admin/AdminAttendanceMarkingView';
import { AdminAssignmentsGradingView } from './views/admin/AdminAssignmentsGradingView';
import { AdminStudentsDirectoryView } from './views/admin/AdminStudentsDirectoryView';
import { AdminStaffProfileView } from './views/admin/AdminStaffProfileView';
import { Assignment, StaffLeaveRequest, Notice, CampusEvent, ThemePreference, DevicePreference } from './types';

export default function App() {
  // App Navigation and Role State
  const [userRole, setUserRole] = useState<UserRole>('student');
  const [currentTab, setCurrentTab] = useState<string>('dashboard');

  // Core Data States
  const [student, setStudent] = useState(initialStudentProfile);
  const [admin, setAdmin] = useState(initialAdminProfile);
  const [attendanceCourses, setAttendanceCourses] = useState(initialAttendanceCourses);
  const [timetable, setTimetable] = useState(initialTimetable);
  const [classLeaves, setClassLeaves] = useState(initialClassLeaves);
  const [hostelLeaves, setHostelLeaves] = useState(initialHostelLeaves);
  const [assignments, setAssignments] = useState(initialAssignments);
  const [events, setEvents] = useState(initialEvents);
  const [results, setResults] = useState(initialSemesterResults);
  const [feeBreakdowns, setFeeBreakdowns] = useState(initialFeeBreakdowns);
  const [feeTransactions, setFeeTransactions] = useState(initialFeeTransactions);
  const [admissions, setAdmissions] = useState(initialAdmissions);
  const [notices, setNotices] = useState(initialNotices);
  const [borrowedBooks, setBorrowedBooks] = useState(initialBorrowedBooks);
  const [catalogBooks, setCatalogBooks] = useState(initialCatalogBooks);
  const [helpdeskTickets, setHelpdeskTickets] = useState(initialHelpdeskTickets);
  const [documents, setDocuments] = useState(initialStudentDocuments);
  const [notifications, setNotifications] = useState(initialNotifications);

  // Admin Specific Core Data States
  const [facultyCourses, setFacultyCourses] = useState(initialFacultyCourses);
  const [staffTimetable, setStaffTimetable] = useState(initialStaffTimetable);
  const [studentDirectory, setStudentDirectory] = useState(initialStudentDirectory);
  const [staffLeaves, setStaffLeaves] = useState(initialStaffLeaves);

  // Background Theme & Device Preferences State
  const [themePreference, setThemePreference] = useState<ThemePreference>(() => {
    const saved = localStorage.getItem('campusone_theme');
    return (saved === 'dark' || saved === 'light' || saved === 'system') ? saved : 'light';
  });

  const [devicePreference, setDevicePreference] = useState<DevicePreference>(() => {
    const saved = localStorage.getItem('campusone_device');
    return (saved === 'desktop' || saved === 'tablet' || saved === 'mobile' || saved === 'responsive') ? saved : 'responsive';
  });

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
    setClassLeaves([newRecord, ...classLeaves]);
    
    // Add notification
    setNotifications([
      {
        id: `NOTIF-${Date.now()}`,
        title: 'Class Leave Submitted',
        description: `Application ${newId} submitted for ${newLeaveData.date}.`,
        time: 'Just now',
        type: 'leave',
        read: false,
        linkTab: 'class-leave',
      },
      ...notifications,
    ]);
  };

  const handleUpdateCLStatus = (id: string, status: 'Approved' | 'Rejected', remark?: string) => {
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
    setHostelLeaves([newRecord, ...hostelLeaves]);
    setNotifications([
      {
        id: `NOTIF-${Date.now()}`,
        title: 'Hostel Leave Submitted',
        description: `Outpass requisition ${newId} sent to Warden.`,
        time: 'Just now',
        type: 'leave',
        read: false,
        linkTab: 'hostel-leave',
      },
      ...notifications,
    ]);
  };

  const handleUpdateHLStatus = (id: string, status: 'Approved' | 'Rejected', remark?: string) => {
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
    setNotifications([
      {
        id: `NOTIF-${Date.now()}`,
        title: 'Assignment Submitted',
        description: `Coursework uploaded successfully for evaluation.`,
        time: 'Just now',
        type: 'assignment',
        read: false,
        linkTab: 'assignments',
      },
      ...notifications,
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
    setNotifications([
      {
        id: `NOTIF-${Date.now()}`,
        title: 'Assignment Evaluated & Graded',
        description: `Score: ${marks} Marks recorded with faculty feedback.`,
        time: 'Just now',
        type: 'assignment',
        read: false,
        linkTab: userRole === 'admin' ? 'admin-grading' : 'assignments',
      },
      ...notifications,
    ]);
  };

  // Admin Assignment Creator Handler
  const handleCreateAssignment = (newAsn: Omit<Assignment, 'id' | 'status' | 'submittedDate' | 'marksObtained' | 'feedback' | 'submissionNote'>) => {
    const newId = `ASN-${String(assignments.length + 1).padStart(2, '0')}`;
    const created: Assignment = {
      ...newAsn,
      id: newId,
      status: 'Pending',
    };
    setAssignments([created, ...assignments]);
    setNotifications([
      {
        id: `NOTIF-${Date.now()}`,
        title: 'New Course Assignment Created',
        description: `${newAsn.courseCode}: ${newAsn.title} published with due date ${newAsn.dueDate}.`,
        time: 'Just now',
        type: 'assignment',
        read: false,
        linkTab: userRole === 'admin' ? 'admin-assignments' : 'assignments',
      },
      ...notifications,
    ]);
  };

  // Admin Class Attendance Session Handler
  const handleLogClassAttendance = (courseCode: string, studentIdsPresent: string[]) => {
    setFacultyCourses((prev) =>
      prev.map((c) =>
        c.code === courseCode
          ? {
              ...c,
              conductedClasses: c.conductedClasses + 1,
            }
          : c
      )
    );
    setStudentDirectory((prev) =>
      prev.map((s) => {
        const isPresent = studentIdsPresent.includes(s.id);
        const newPct = isPresent
          ? Math.min(100, Math.round((s.attendancePct * 0.95 + 5) * 10) / 10)
          : Math.max(0, Math.round((s.attendancePct * 0.95) * 10) / 10);
        return {
          ...s,
          attendancePct: newPct,
          status: newPct < 75 ? 'Attendance Defaulter' : 'Good Standing',
        };
      })
    );
    setAttendanceCourses((prev) =>
      prev.map((c) =>
        c.code === courseCode
          ? {
              ...c,
              conducted: c.conducted + 1,
              attended: c.attended + 1,
              percentage: Math.round(((c.attended + 1) / (c.conducted + 1)) * 1000) / 10,
            }
          : c
      )
    );
    setNotifications([
      {
        id: `NOTIF-${Date.now()}`,
        title: 'Attendance Register Updated',
        description: `Class attendance logged for ${courseCode} (${studentIdsPresent.length} students marked present).`,
        time: 'Just now',
        type: 'notice',
        read: false,
        linkTab: userRole === 'admin' ? 'admin-attendance' : 'attendance',
      },
      ...notifications,
    ]);
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
    setStaffLeaves([record, ...staffLeaves]);
    setNotifications([
      {
        id: `NOTIF-${Date.now()}`,
        title: 'Staff Leave Requisition Dispatched',
        description: `Your ${newLeave.leaveType} application ${newId} submitted to Registrar.`,
        time: 'Just now',
        type: 'leave',
        read: false,
        linkTab: 'admin-profile',
      },
      ...notifications,
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
    setEvents([
      {
        ...newEvent,
        id,
        attendeesCount: 1,
        isRsvpd: true,
        isPast: false,
      },
      ...events,
    ]);
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
    setNotifications([
      {
        id: `NOTIF-${Date.now()}`,
        title: 'Campus Event Cancelled',
        description: 'An upcoming campus event was cancelled by the university administration.',
        time: 'Just now',
        type: 'event',
        read: false,
        linkTab: userRole === 'admin' ? 'admin-events' : 'events',
      },
      ...notifications,
    ]);
  };

  // Notice Handlers
  const handlePublishNotice = (newNoticeData: Omit<Notice, 'id'>) => {
    const id = `NOTIF-${String(notices.length + 1).padStart(2, '0')}`;
    const notice: Notice = {
      ...newNoticeData,
      id,
    };
    setNotices([notice, ...notices]);
    setNotifications([
      {
        id: `NOTIF-${Date.now()}`,
        title: 'New Campus Circular Published',
        description: `${notice.title} issued by ${notice.department}.`,
        time: 'Just now',
        type: 'notice',
        read: false,
        linkTab: userRole === 'admin' ? 'admin-notices' : 'notices',
      },
      ...notifications,
    ]);
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
    setFeeTransactions([newTxn, ...feeTransactions]);

    setNotifications([
      {
        id: `NOTIF-${Date.now()}`,
        title: 'Fee Payment Received',
        description: `Payment of ₹${amount.toLocaleString('en-IN')} confirmed. Receipt: ${newTxn.receiptNo}`,
        time: 'Just now',
        type: 'fee',
        read: false,
        linkTab: 'fees',
      },
      ...notifications,
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
  const handleCreateTicket = (ticketData: Parameters<React.ComponentProps<typeof HelpdeskView>['onCreateTicket']>[0]) => {
    const num = Math.floor(400 + Math.random() * 500);
    const newTkt = {
      ...ticketData,
      id: `TKT-2026-${num}`,
      ticketNo: `HD-2026-${num}`,
      status: 'Open' as const,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setHelpdeskTickets([newTkt, ...helpdeskTickets]);
  };

  const handleUpdateTicketStatus = (
    id: string,
    status: Parameters<React.ComponentProps<typeof HelpdeskView>['onUpdateTicketStatus']>[1],
    resolution?: string
  ) => {
    setHelpdeskTickets((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status,
              resolution: resolution || t.resolution,
              updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
            }
          : t
      )
    );
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
  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Current tab label
  const activeNavItem = navItems.find((item) => item.id === currentTab);
  const currentTabLabel = activeNavItem ? activeNavItem.label : 'Dashboard';

  // Counts for badges
  const pendingLeavesCount = classLeaves.filter((l) => l.status === 'Pending').length;
  const pendingAssignmentsCount = assignments.filter((a) => a.status === 'Pending').length;

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
          onToggleRole={handleToggleRole}
          notifications={notifications}
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

        {/* Main Content Viewport: Preserved exactly as is */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
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
              events={events}
              notices={notices}
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
              onLogClassAttendance={handleLogClassAttendance}
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
              notices={notices}
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
              notices={notices}
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
              notices={notices}
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
        </main>
      </div>
    </div>
  );
}
