import React, { useState } from 'react';
import {
  CalendarCheck,
  BookOpen,
  CreditCard,
  GraduationCap,
  ArrowRight,
  Clock,
  MapPin,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Building,
  Bell,
  Check,
  ChevronRight,
} from 'lucide-react';
import {
  StudentProfile,
  AttendanceCourse,
  TimetableSlot,
  Assignment,
  CampusEvent,
  Notice,
  ClassLeaveRequest,
  HostelLeaveRequest,
  FeeBreakdown,
  SemesterResult,
} from '../types';

interface DashboardViewProps {
  student: StudentProfile;
  attendanceCourses: AttendanceCourse[];
  timetable: TimetableSlot[];
  assignments: Assignment[];
  events: CampusEvent[];
  notices: Notice[];
  feeBreakdowns: FeeBreakdown[];
  latestResult: SemesterResult;
  onNavigate: (tab: string) => void;
  onQuickApplyCL: () => void;
  onQuickApplyHL: () => void;
  onQuickPayFee: () => void;
  onToggleRsvp: (eventId: string) => void;
  onSubmitAssignment: (assignmentId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  student,
  attendanceCourses,
  timetable,
  assignments,
  events,
  notices,
  feeBreakdowns,
  latestResult,
  onNavigate,
  onQuickApplyCL,
  onQuickApplyHL,
  onQuickPayFee,
  onToggleRsvp,
  onSubmitAssignment,
}) => {
  const [selectedDay, setSelectedDay] = useState<string>('Monday');

  // Overall attendance calculation
  const totalConducted = attendanceCourses.reduce((sum, c) => sum + c.conducted, 0);
  const totalAttended = attendanceCourses.reduce((sum, c) => sum + c.attended, 0);
  const overallAttendance = Math.round((totalAttended / totalConducted) * 1000) / 10;

  // Courses below 75%
  const lowAttendanceCourses = attendanceCourses.filter((c) => c.percentage < 75);

  // Total fee due
  const totalDue = feeBreakdowns.reduce((sum, f) => sum + f.due, 0);

  // Pending assignments count
  const pendingAssignments = assignments.filter((a) => a.status === 'Pending');

  // Filter timetable for selected day
  const dailySlots = timetable.filter((slot) => slot.day === selectedDay);

  const daysList = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  return (
    <div className="space-y-6">
      {/* 1. Header Greeting & Semester Ribbon */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 tracking-wide uppercase">
            <span>Welcome back</span>
            <span aria-hidden="true">·</span>
            <span>Reg: {student.regNo}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            Hello, {student.name}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {student.course} · {student.branch} · {student.semester}
          </p>
        </div>

        {/* Quick Actions Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0">
          <button
            onClick={onQuickApplyCL}
            className="px-3 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-xs flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" />
            Apply CL
          </button>
          <button
            onClick={onQuickApplyHL}
            className="px-3 py-2 text-xs font-semibold rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors shadow-xs flex items-center gap-1.5"
          >
            <Building className="w-3.5 h-3.5" />
            Hostel Leave
          </button>
          <button
            onClick={onQuickPayFee}
            className="px-3 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs flex items-center gap-1.5"
          >
            <CreditCard className="w-3.5 h-3.5 text-slate-500" />
            Pay Fees
          </button>
          <button
            onClick={() => onNavigate('academics')}
            className="px-3 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs flex items-center gap-1.5"
          >
            <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
            Results
          </button>
        </div>
      </div>

      {/* Attendance Warning Banner if any course is < 75% */}
      {lowAttendanceCourses.length > 0 && (
        <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-4 flex items-start sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2 bg-amber-100 text-amber-700 rounded-lg shrink-0 mt-0.5 sm:mt-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-900">
                Attendance Shortfall Warning ({lowAttendanceCourses.length} subject below 75%)
              </div>
              <p className="text-xs text-amber-800 mt-0.5">
                {lowAttendanceCourses.map((c) => `${c.name} (${c.percentage}%)`).join(', ')}. Minimum 75% aggregate is required for BPUT semester examination eligibility.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('attendance')}
            className="shrink-0 text-xs font-semibold text-amber-900 underline hover:text-amber-950 flex items-center gap-1"
          >
            View Details <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 2. Key Metrics Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Attendance Card */}
        <div
          onClick={() => onNavigate('attendance')}
          className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-all cursor-pointer shadow-xs group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Aggregate Attendance
            </span>
            <CalendarCheck className="w-4 h-4 text-teal-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 tabular-nums">
              {overallAttendance}%
            </span>
            <span className="text-xs text-slate-500">
              ({totalAttended}/{totalConducted} hrs)
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                overallAttendance >= 75 ? 'bg-teal-600' : 'bg-amber-500'
              }`}
              style={{ width: `${Math.min(overallAttendance, 100)}%` }}
            />
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
            <span>Threshold: 75%</span>
            <span className="text-teal-700 font-medium group-hover:underline flex items-center gap-0.5">
              Subject list <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Pending Assignments */}
        <div
          onClick={() => onNavigate('assignments')}
          className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-all cursor-pointer shadow-xs group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Pending Submissions
            </span>
            <BookOpen className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 tabular-nums">
              {pendingAssignments.length}
            </span>
            <span className="text-xs text-slate-500">assignments due</span>
          </div>
          <p className="text-xs text-slate-500 mt-2 truncate">
            Next: {pendingAssignments[0]?.courseCode || 'All cleared'}
          </p>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Due in 4 days</span>
            <span className="text-blue-700 font-medium group-hover:underline flex items-center gap-0.5">
              Submit work <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Outstanding Fees */}
        <div
          onClick={() => onNavigate('fees')}
          className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-all cursor-pointer shadow-xs group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Fee Balance Due
            </span>
            <CreditCard className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 tabular-nums">
              ₹{totalDue.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-amber-600 font-medium">Pending</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Hostel & Exam fees balance
          </p>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Due: 15 Oct 2026</span>
            <span className="text-purple-700 font-medium group-hover:underline flex items-center gap-0.5">
              Pay now <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Academic Result Card */}
        <div
          onClick={() => onNavigate('academics')}
          className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-all cursor-pointer shadow-xs group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Latest SGPA / CGPA
            </span>
            <GraduationCap className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 tabular-nums">
              {latestResult.sgpa.toFixed(2)}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              / CGPA {latestResult.cgpa.toFixed(2)}
            </span>
          </div>
          <p className="text-xs text-emerald-700 font-medium mt-2">
            {latestResult.semesterName}
          </p>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>All passed (No backlogs)</span>
            <span className="text-emerald-700 font-medium group-hover:underline flex items-center gap-0.5">
              Grade sheet <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>

      {/* 3. Timetable & Upcoming Deadlines Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Class Timetable (2 cols on lg) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Weekly Class Timetable
              </h3>
              <p className="text-xs text-slate-500">
                Current Semester 6 · Lecture Hall & Computing Labs
              </p>
            </div>

            {/* Day Selector Segmented Control */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto">
              {daysList.map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                    selectedDay === day
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>

          {/* Timetable schedule list */}
          <div className="mt-4 space-y-3">
            {dailySlots.length > 0 ? (
              dailySlots.map((slot) => (
                <div
                  key={slot.id}
                  className="p-3.5 rounded-lg border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-16 sm:w-24 shrink-0 text-slate-500">
                      <div className="text-[11px] font-mono text-slate-400">Period</div>
                      <div className="text-xs font-semibold text-slate-800 font-mono">
                        {slot.time.split('-')[0].trim()}
                      </div>
                    </div>
                    <div className="border-l border-slate-200 pl-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-medium text-teal-700">
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
                        <span>Faculty: {slot.faculty}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {slot.room}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="sm:self-center">
                    <span className="text-xs font-medium text-slate-500 font-mono">
                      {slot.time}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">
                No scheduled classes for {selectedDay} (Self-study / Library hours)
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Assignment Deadlines (1 col on lg) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Assignment Deadlines
              </h3>
              <p className="text-xs text-slate-500">Pending coursework tasks</p>
            </div>
            <button
              onClick={() => onNavigate('assignments')}
              className="text-xs font-semibold text-teal-700 hover:text-teal-800"
            >
              View all ({assignments.length})
            </button>
          </div>

          <div className="mt-4 space-y-3 flex-1 overflow-y-auto max-h-96">
            {assignments.slice(0, 4).map((asn) => (
              <div
                key={asn.id}
                className="p-3 rounded-lg border border-slate-100 hover:border-slate-200 bg-white transition-all flex flex-col gap-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-mono font-medium text-slate-500">
                      {asn.courseCode}
                    </span>
                    <h4 className="text-xs font-semibold text-slate-900 line-clamp-1">
                      {asn.title}
                    </h4>
                  </div>
                  {asn.status === 'Submitted' ? (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold shrink-0">
                      Submitted
                    </span>
                  ) : asn.status === 'Evaluated' ? (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold shrink-0">
                      {asn.marksObtained}/{asn.maxMarks} Mks
                    </span>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-semibold shrink-0">
                      Pending
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-50">
                  <span className="flex items-center gap-1 text-slate-500">
                    <Clock className="w-3 h-3 text-slate-400" />
                    Due: {asn.dueDate}
                  </span>
                  {asn.status === 'Pending' && (
                    <button
                      onClick={() => onSubmitAssignment(asn.id)}
                      className="text-xs font-semibold text-teal-700 hover:text-teal-800 hover:underline"
                    >
                      Submit Now
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Upcoming Campus Events & Recent Notices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Campus Events Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Campus Events & Symposia
              </h3>
              <p className="text-xs text-slate-500">Upcoming workshops and tournaments</p>
            </div>
            <button
              onClick={() => onNavigate('events')}
              className="text-xs font-semibold text-teal-700 hover:text-teal-800"
            >
              Browse all
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {events
              .filter((e) => !e.isPast)
              .slice(0, 3)
              .map((evt) => (
                <div
                  key={evt.id}
                  className="p-3.5 rounded-lg border border-slate-100 hover:border-slate-200 bg-slate-50/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
                        {evt.category}
                      </span>
                      {evt.bannerTag && (
                        <span className="text-[10px] font-medium text-slate-500">
                          {evt.bannerTag}
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                      {evt.title}
                    </h4>
                    <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {evt.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {evt.venue}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <button
                      onClick={() => onToggleRsvp(evt.id)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                        evt.isRsvpd
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-slate-900 text-white hover:bg-slate-800'
                      }`}
                    >
                      {evt.isRsvpd ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          RSVP'd ({evt.attendeesCount})
                        </>
                      ) : (
                        <>RSVP ({evt.attendeesCount})</>
                      )}
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Recent Notices Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Official University Notices
              </h3>
              <p className="text-xs text-slate-500">Circulars from CoE, Dean & Placement Cell</p>
            </div>
            <button
              onClick={() => onNavigate('notices')}
              className="text-xs font-semibold text-teal-700 hover:text-teal-800"
            >
              Notice board
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {notices.slice(0, 3).map((notice) => (
              <div
                key={notice.id}
                onClick={() => onNavigate('notices')}
                className="p-3.5 rounded-lg border border-slate-100 hover:border-slate-200 bg-white hover:bg-slate-50/50 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-slate-400">
                        {notice.date}
                      </span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="text-[10px] font-semibold text-slate-600">
                        {notice.department}
                      </span>
                      {notice.isUrgent && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 font-bold border border-rose-200">
                          Urgent
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs sm:text-sm font-semibold text-slate-900 line-clamp-1">
                      {notice.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {notice.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
