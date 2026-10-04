import React, { useState } from 'react';
import {
  ShieldCheck,
  BookOpen,
  CalendarCheck,
  FileText,
  Award,
  Users,
  CheckCircle2,
  Building,
  Bell,
  Clock,
  AlertTriangle,
  ArrowRight,
  Plus,
  Calendar,
  Send,
  UserCheck,
  FileCheck,
  LifeBuoy,
} from 'lucide-react';
import {
  AdminProfile,
  ClassLeaveRequest,
  HostelLeaveRequest,
  Assignment,
  Notice,
  CampusEvent,
  FacultyCourse,
  StaffTimetableSlot,
  StudentRecord,
  StaffPersona,
  HelpdeskTicket,
  AppNotification,
} from '../../types';

interface AdminDashboardViewProps {
  admin: AdminProfile;
  facultyCourses: FacultyCourse[];
  staffTimetable: StaffTimetableSlot[];
  studentDirectory: StudentRecord[];
  pendingCLCount: number;
  pendingHLCount: number;
  pendingGradingCount: number;
  openHelpdeskCount: number;
  helpdeskTickets: HelpdeskTicket[];
  studentNotifications: AppNotification[];
  events: CampusEvent[];
  notices: Notice[];
  onNavigateTab: (tab: string) => void;
  onQuickCreateAssignment: () => void;
  onQuickTakeAttendance: () => void;
  onQuickPublishNotice: () => void;
  onQuickApplyStaffLeave: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  admin,
  facultyCourses,
  staffTimetable,
  studentDirectory,
  pendingCLCount,
  pendingHLCount,
  pendingGradingCount,
  openHelpdeskCount,
  helpdeskTickets,
  studentNotifications,
  events,
  notices,
  onNavigateTab,
  onQuickCreateAssignment,
  onQuickTakeAttendance,
  onQuickPublishNotice,
  onQuickApplyStaffLeave,
}) => {
  const [selectedDay, setSelectedDay] = useState<StaffTimetableSlot['day']>('Monday');
  const [activePersona, setActivePersona] = useState<StaffPersona>('Dean & Chief Warden');

  // Filter staff timetable for selected day
  const dailySchedule = staffTimetable.filter((s) => s.day === selectedDay);

  // Defaulter students below 75%
  const defaulterStudents = studentDirectory.filter((s) => s.attendancePct < 75);
  const timestamp = (value: string) => Date.parse(value);
  const openTickets = helpdeskTickets.filter((ticket) => ticket.status !== 'Resolved');
  const agingTickets = openTickets.filter((ticket) => {
    const created = timestamp(ticket.createdAt);
    return Number.isFinite(created) && Date.now() - created >= 48 * 60 * 60 * 1000;
  });
  const repeatedIssueCategories = Object.entries(openTickets.reduce<Record<string, number>>((counts, ticket) => {
    counts[ticket.category] = (counts[ticket.category] || 0) + 1;
    return counts;
  }, {})).filter(([, count]) => count > 1).sort((a, b) => b[1] - a[1]);
  const resolvedDurations = helpdeskTickets.filter((ticket) => ticket.status === 'Resolved').map((ticket) => {
    const created = timestamp(ticket.createdAt);
    const resolved = timestamp(ticket.updatedAt);
    return Number.isFinite(created) && Number.isFinite(resolved) && resolved >= created ? (resolved - created) / 3600000 : null;
  }).filter((hours): hours is number => hours !== null);
  const averageResolutionHours = resolvedDurations.length
    ? resolvedDurations.reduce((sum, hours) => sum + hours, 0) / resolvedDurations.length
    : null;
  const deliveredStudentAlerts = studentNotifications.filter((notification) => Boolean(notification.deliveredAt));
  const openedStudentAlerts = deliveredStudentAlerts.filter((notification) => notification.read).length;
  const actionedStudentAlerts = deliveredStudentAlerts.filter((notification) => Boolean(notification.actionedAt)).length;

  const days: StaffTimetableSlot['day'][] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  return (
    <div className="space-y-6">
      {/* 1. Academic Leader Banner & Persona Switcher */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-teal-700 tracking-wide uppercase">
            <span>Faculty & Administrative Command Workspace</span>
            <span aria-hidden="true">·</span>
            <span>Emp ID: {admin.employeeId}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            Welcome, {admin.name}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            {admin.designation} · {admin.department}
          </p>
        </div>

        {/* Quick Action Shortcuts */}
        <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0">
          <button
            onClick={onQuickCreateAssignment}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Create Assignment
          </button>
          <button
            onClick={onQuickTakeAttendance}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors shadow-xs flex items-center gap-1.5"
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            Take Attendance
          </button>
          <button
            onClick={onQuickPublishNotice}
            className="px-3 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs flex items-center gap-1.5"
          >
            <Bell className="w-3.5 h-3.5 text-slate-500" />
            Publish Notice
          </button>
          <button
            onClick={onQuickApplyStaffLeave}
            className="px-3 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            Staff Leave
          </button>
        </div>
      </div>

      {/* Staff Persona Filter / Context Bar */}
      <div className="bg-slate-900 text-white rounded-xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-teal-400 shrink-0" />
          <div>
            <div className="text-xs font-bold">Administrative Persona & Scope</div>
            <div className="text-[11px] text-slate-300">
              Active Role: <span className="text-teal-300 font-semibold">{activePersona}</span> (All university workflows enabled)
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-800 rounded-lg text-xs overflow-x-auto">
          {(['Dean & Chief Warden', 'Course Faculty', 'Hostel Warden', 'Office Administrator'] as const).map((persona) => (
            <button
              key={persona}
              onClick={() => setActivePersona(persona)}
              className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap text-[11px] font-medium ${
                activePersona === persona
                  ? 'bg-teal-600 text-white font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              {persona}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Key Action Queues Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Student CL Approval Queue */}
        <div
          onClick={() => onNavigateTab('admin-cl-approvals')}
          className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-all cursor-pointer shadow-xs group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Student Class Leaves
            </span>
            <CheckCircle2 className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 tabular-nums">
              {pendingCLCount}
            </span>
            <span className="text-xs text-amber-600 font-semibold">Pending Review</span>
          </div>
          <p className="text-xs text-slate-500 mt-2 truncate">
            Campus placement & medical waivers
          </p>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-teal-700 font-semibold group-hover:underline">
            <span>Review Applications</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Hostel Outpass Approval Queue */}
        <div
          onClick={() => onNavigateTab('admin-hl-approvals')}
          className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-all cursor-pointer shadow-xs group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Hostel Outpasses
            </span>
            <Building className="w-4 h-4 text-teal-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 tabular-nums">
              {pendingHLCount}
            </span>
            <span className="text-xs text-teal-600 font-semibold">Awaiting Warden</span>
          </div>
          <p className="text-xs text-slate-500 mt-2 truncate">
            Brahmaputra & Mahanadi Halls
          </p>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-teal-700 font-semibold group-hover:underline">
            <span>Issue Digital Gate Pass</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Assignments to Grade */}
        <div
          onClick={() => onNavigateTab('admin-grading')}
          className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-all cursor-pointer shadow-xs group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Grading Queue
            </span>
            <Award className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 tabular-nums">
              {pendingGradingCount}
            </span>
            <span className="text-xs text-blue-600 font-semibold">Submissions</span>
          </div>
          <p className="text-xs text-slate-500 mt-2 truncate">
            DBMS & Database Lab assignments
          </p>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-teal-700 font-semibold group-hover:underline">
            <span>Evaluate & Give Marks</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Helpdesk Grievances */}
        <div
          onClick={() => onNavigateTab('admin-helpdesk')}
          className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-all cursor-pointer shadow-xs group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Campus Helpdesk
            </span>
            <LifeBuoy className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 tabular-nums">
              {openHelpdeskCount}
            </span>
            <span className="text-xs text-purple-600 font-semibold">Open Tickets</span>
          </div>
          <p className="text-xs text-slate-500 mt-2 truncate">
            Wi-Fi, Maintenance & ERP cell
          </p>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-teal-700 font-semibold group-hover:underline">
            <span>Resolve Grievances</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* 3. Daily Teaching Schedule & Defaulter Students Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Faculty Daily Schedule & Engagements (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Faculty Schedule & Engagement Planner
              </h3>
              <p className="text-xs text-slate-500">
                Lectures, labs, dean office consultation, and committee sessions
              </p>
            </div>

            {/* Day Selector */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
              {days.map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                    selectedDay === day
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {dailySchedule.length > 0 ? (
              dailySchedule.map((slot) => (
                <div
                  key={slot.id}
                  className="p-3.5 rounded-lg border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-20 sm:w-28 shrink-0 text-slate-500">
                      <div className="text-[10px] uppercase font-mono text-slate-400 font-semibold">Timing</div>
                      <div className="text-xs font-bold text-slate-800 font-mono">
                        {slot.time.split('-')[0].trim()}
                      </div>
                    </div>
                    <div className="border-l border-slate-200 pl-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-teal-700">
                          {slot.courseCode}
                        </span>
                        <span className="text-xs font-bold text-slate-900">
                          {slot.courseName}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-medium">
                          {slot.type}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-3">
                        <span>Audience: <strong>{slot.batch}</strong></span>
                        <span>·</span>
                        <span>Venue: <strong>{slot.room}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="sm:self-center shrink-0">
                    {slot.type === 'Lecture' || slot.type === 'Lab' ? (
                      <button
                        onClick={onQuickTakeAttendance}
                        className="px-2.5 py-1 text-xs font-semibold rounded bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200 transition-colors"
                      >
                        Take Attendance
                      </button>
                    ) : (
                      <span className="text-xs font-mono text-slate-400">Scheduled</span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">
                No scheduled lectures on {selectedDay} (Reserved for research & administrative duties)
              </div>
            )}
          </div>
        </div>

        {/* Attendance Concern Spotlight (1 col) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                <span>Attendance Defaulters</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">Students below BPUT 75% bar</p>
            </div>
            <button
              onClick={() => onNavigateTab('admin-attendance')}
              className="text-xs font-semibold text-teal-700 hover:underline"
            >
              Full report
            </button>
          </div>

          <div className="mt-3 space-y-3 flex-1 overflow-y-auto max-h-80">
            {defaulterStudents.map((stu) => (
              <div
                key={stu.id}
                className="p-3 rounded-lg border border-rose-100 bg-rose-50/40 text-xs space-y-1.5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <strong className="text-slate-900">{stu.name}</strong>
                    <div className="text-[11px] font-mono text-slate-500">
                      Reg: {stu.regNo} · {stu.branch}
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-rose-100 text-rose-800">
                    {stu.attendancePct}%
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 flex justify-between pt-1 border-t border-rose-100">
                  <span>Hostel: {stu.hostel}</span>
                  <span className="text-rose-700 font-semibold">Exclusion warning sent</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Active Courses Overview & Campus Bulletins */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Faculty Active Teaching Courses */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Assigned Teaching Courses
              </h3>
              <p className="text-xs text-slate-500">Spring 2026 Semester · B.Tech CSE</p>
            </div>
            <button
              onClick={() => onNavigateTab('admin-courses')}
              className="text-xs font-semibold text-teal-700 hover:underline"
            >
              Manage syllabi
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {facultyCourses.map((c) => (
              <div
                key={c.code}
                className="p-3.5 rounded-lg border border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-teal-700">{c.code}</span>
                    <span className="text-xs font-bold text-slate-900">{c.name}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5">
                    <span>Enrolled: <strong>{c.enrolledCount} students</strong></span>
                    <span>·</span>
                    <span>Conducted: <strong>{c.conductedClasses} classes</strong></span>
                    <span>·</span>
                    <span>Avg Att: <strong className="text-teal-700">{c.avgAttendance}%</strong></span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <button
                    onClick={() => onNavigateTab('admin-assignments')}
                    className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                  >
                    Assignments
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Administrative Notices & University Events */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Recent Circulars & Campus Events
              </h3>
              <p className="text-xs text-slate-500">Official university bulletins & meetings</p>
            </div>
            <button
              onClick={() => onNavigateTab('admin-notices')}
              className="text-xs font-semibold text-teal-700 hover:underline"
            >
              Notice console
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {notices.slice(0, 3).map((n) => (
              <div
                key={n.id}
                onClick={() => onNavigateTab('admin-notices')}
                className="p-3 rounded-lg border border-slate-100 hover:border-slate-200 bg-white transition-all cursor-pointer space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400">{n.date} · {n.department}</span>
                  {n.isUrgent && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                      Urgent
                    </span>
                  )}
                </div>
                <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{n.title}</h4>
                <p className="text-[11px] text-slate-500 line-clamp-1">{n.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. PS-07 service operations and notice engagement */}
      <section className="space-y-3" aria-labelledby="operations-monitor-title">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h3 id="operations-monitor-title" className="text-base font-bold text-slate-900">Service Operations & Communication Monitor</h3>
            <p className="text-xs text-slate-500">Queue age, repeated issues, resolution speed, and in-app notice engagement</p>
          </div>
          <button onClick={() => onNavigateTab('admin-helpdesk')} className="text-xs font-semibold text-teal-700 hover:underline">Open service desk</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <div className="text-[11px] uppercase tracking-wide font-semibold text-slate-500">Open requests</div>
            <div className="mt-2 text-2xl font-bold text-slate-900">{openHelpdeskCount}</div>
            <div className="mt-1 text-xs text-rose-700">{agingTickets.length} waiting 48+ hours</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <div className="text-[11px] uppercase tracking-wide font-semibold text-slate-500">Recurring issue signals</div>
            {repeatedIssueCategories.length ? repeatedIssueCategories.slice(0, 2).map(([category, count]) => (
              <div key={category} className="mt-2 flex items-center justify-between gap-2 text-xs">
                <span className="truncate text-slate-700">{category}</span><strong className="text-amber-700">{count} open</strong>
              </div>
            )) : <div className="mt-2 text-sm font-semibold text-slate-900">No repeat category detected</div>}
            <div className="mt-2 text-[11px] text-slate-500">Based on repeated open ticket categories</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <div className="text-[11px] uppercase tracking-wide font-semibold text-slate-500">Average resolution time</div>
            <div className="mt-2 text-2xl font-bold text-slate-900">{averageResolutionHours === null ? '—' : `${averageResolutionHours.toFixed(1)}h`}</div>
            <div className="mt-1 text-xs text-slate-500">From resolved demo tickets</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <div className="text-[11px] uppercase tracking-wide font-semibold text-slate-500">In-app student alert delivery</div>
            <div className="mt-2 text-2xl font-bold text-slate-900">{deliveredStudentAlerts.length}</div>
            <div className="mt-1 text-xs text-teal-700">{openedStudentAlerts} read · {actionedStudentAlerts} opened the linked action</div>
          </div>
        </div>
        <p className="text-[10px] text-slate-400">Prototype metrics are calculated from the sample records and actions stored in this browser.</p>
      </section>
    </div>
  );
};
