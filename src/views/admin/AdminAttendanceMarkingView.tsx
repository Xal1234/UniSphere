import React, { useState, useEffect } from 'react';
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sliders,
  Filter,
  Check,
  X,
  Send,
  Users,
  Search,
  Calendar,
  Clock,
  History,
  ShieldAlert,
  Info,
  Lock,
} from 'lucide-react';
import { FacultyCourse, StudentRecord, ClassAttendanceRecord } from '../../types';

interface AdminAttendanceMarkingViewProps {
  courses: FacultyCourse[];
  students: StudentRecord[];
  attendanceRecords: ClassAttendanceRecord[];
  onSaveAttendanceRecord?: (record: ClassAttendanceRecord) => void;
  adminName?: string;
}

export const AdminAttendanceMarkingView: React.FC<AdminAttendanceMarkingViewProps> = ({
  courses,
  students,
  attendanceRecords = [],
  onSaveAttendanceRecord,
  adminName = 'Dr. Sudhir Kumar Mohanty',
}) => {
  // Dynamic local date calculation (never hardcoded)
  const getLocalDateString = (offsetDays = 0) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayStr = getLocalDateString(0);
  const yesterdayStr = getLocalDateString(-1);
  const tomorrowStr = getLocalDateString(1);

  const [selectedCourse, setSelectedCourse] = useState<string>(courses[0]?.code || 'RCS6C001');
  const [sessionDate, setSessionDate] = useState<string>(todayStr);
  const [sessionPeriod, setSessionPeriod] = useState<string>('Period 1 (09:00 AM - 10:00 AM)');
  const [threshold, setThreshold] = useState<number>(75);
  const [searchStudent, setSearchStudent] = useState<string>('');
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'info'; text: string } | null>(null);

  // Find if an existing attendance record exists for this specific Course + Calendar Date + Period
  const existingRecord = attendanceRecords.find(
    (r) =>
      r.courseCode === selectedCourse &&
      r.sessionDate === sessionDate &&
      r.sessionPeriod === sessionPeriod
  );

  const isLocked = Boolean(existingRecord);

  // Initialize attendance state based on existing record or student directory
  const [attendanceState, setAttendanceState] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    students.forEach((s) => {
      init[s.id] = s.attendancePct >= 75;
    });
    return init;
  });

  // Whenever course, date, or period changes, load the matching record if it exists
  useEffect(() => {
    if (existingRecord) {
      const stateFromRecord: Record<string, boolean> = {};
      students.forEach((s) => {
        stateFromRecord[s.id] = existingRecord.presentStudentIds.includes(s.id);
      });
      setAttendanceState(stateFromRecord);
    } else {
      // Default roster attendance for unlocked session
      const freshState: Record<string, boolean> = {};
      students.forEach((s) => {
        freshState[s.id] = s.attendancePct >= 75;
      });
      setAttendanceState(freshState);
    }
  }, [selectedCourse, sessionDate, sessionPeriod, existingRecord, students]);

  const toggleStudent = (id: string) => {
    if (isLocked) {
      setFeedbackMessage({
        type: 'info',
        text: `Attendance for ${selectedCourse} on ${sessionDate} (${sessionPeriod}) is already submitted and locked for this calendar day.`,
      });
      return;
    }
    setAttendanceState((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const markAll = (present: boolean) => {
    if (isLocked) {
      setFeedbackMessage({
        type: 'info',
        text: `Attendance for this session is locked because it was already submitted today. It cannot be edited or counted twice.`,
      });
      return;
    }
    const updated: Record<string, boolean> = {};
    students.forEach((s) => {
      updated[s.id] = present;
    });
    setAttendanceState(updated);
  };

  const handleSaveSession = (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent duplicate submission: allow attendance to be submitted only once per class/session on each calendar day
    if (isLocked) {
      setFeedbackMessage({
        type: 'info',
        text: `Attendance for this session is locked. It has already been submitted for ${sessionDate} and cannot be submitted again or counted twice.`,
      });
      return;
    }

    const presentIds = Object.keys(attendanceState).filter((id) => attendanceState[id]);
    const absentIds = Object.keys(attendanceState).filter((id) => !attendanceState[id]);
    const currentCourse = courses.find((c) => c.code === selectedCourse);

    const recordId = `${selectedCourse}_${sessionDate}_${sessionPeriod}`;
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const record: ClassAttendanceRecord = {
      id: recordId,
      courseCode: selectedCourse,
      courseName: currentCourse ? currentCourse.name : selectedCourse,
      sessionDate,
      sessionPeriod,
      markedBy: adminName,
      markedAt: nowStr,
      presentStudentIds: presentIds,
      absentStudentIds: absentIds,
      totalEnrolled: students.length,
      remarks: `Official class session attendance submitted and locked on ${nowStr} by ${adminName}.`,
    };

    if (onSaveAttendanceRecord) {
      onSaveAttendanceRecord(record);
    }

    setFeedbackMessage({
      type: 'success',
      text: `Attendance session successfully submitted and locked for ${sessionDate} (${presentIds.length} present, ${absentIds.length} absent). Next day's attendance can be recorded normally.`,
    });

    setTimeout(() => {
      setFeedbackMessage(null);
    }, 5000);
  };

  const currentCourseObj = courses.find((c) => c.code === selectedCourse) || courses[0];
  const presentCount = Object.values(attendanceState).filter(Boolean).length;
  const totalCount = students.length;
  const currentSessionPct = Math.round((presentCount / totalCount) * 100);

  // Filter students
  const filteredStudents = students.filter((s) => {
    if (
      searchStudent &&
      !s.name.toLowerCase().includes(searchStudent.toLowerCase()) &&
      !s.rollNo.includes(searchStudent) &&
      !s.regNo.includes(searchStudent)
    ) {
      return false;
    }
    return true;
  });

  // Recorded sessions for current course
  const courseRecords = attendanceRecords.filter((r) => r.courseCode === selectedCourse);

  return (
    <div className="space-y-6">
      {/* 1. Header & Threshold Controller */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-teal-700 tracking-wide uppercase">
            BPUT Biometric & Faculty Attendance Register
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            Record Class Attendance & Monitor Defaulters
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Attendance may be submitted only once per class/session on each calendar day and is locked immediately upon submission.
          </p>
        </div>

        {/* Configurable threshold control */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center gap-3 shrink-0">
          <Sliders className="w-4 h-4 text-slate-500" />
          <div className="text-xs">
            <span className="font-semibold text-slate-700">Debarment Bar: </span>
            <span className="font-mono font-bold text-teal-700">{threshold}%</span>
          </div>
          <input
            type="range"
            min="65"
            max="85"
            step="5"
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            className="w-24 accent-teal-600 cursor-pointer"
          />
        </div>
      </div>

      {/* Feedback Banner */}
      {feedbackMessage && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center justify-between shadow-xs border ${
            feedbackMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-blue-50 border-blue-200 text-blue-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedbackMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-blue-600 shrink-0" />
            )}
            <span className="font-medium">{feedbackMessage.text}</span>
          </div>
          <button
            onClick={() => setFeedbackMessage(null)}
            className="text-xs text-slate-400 hover:text-slate-700 ml-3"
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. Interactive Attendance Marking Terminal */}
      <form onSubmit={handleSaveSession} className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        {/* Session setup bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/70 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                  Course Roster
                </label>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 font-bold focus:ring-1 focus:ring-teal-500"
                >
                  {courses.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} - {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1 flex items-center justify-between">
                  <span>Class Date</span>
                  <span className="text-[10px] text-teal-700 font-normal lowercase">(calendar day)</span>
                </label>
                <input
                  type="date"
                  required
                  value={sessionDate}
                  onChange={(e) => setSessionDate(e.target.value)}
                  className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 font-mono focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                  Slot / Period
                </label>
                <select
                  value={sessionPeriod}
                  onChange={(e) => setSessionPeriod(e.target.value)}
                  className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 font-medium focus:ring-1 focus:ring-teal-500"
                >
                  <option value="Period 1 (09:00 AM - 10:00 AM)">Period 1 (09:00 AM - 10:00 AM)</option>
                  <option value="Period 2 (10:05 AM - 11:05 AM)">Period 2 (10:05 AM - 11:05 AM)</option>
                  <option value="Period 3 (11:15 AM - 12:15 PM)">Period 3 (11:15 AM - 12:15 PM)</option>
                  <option value="Afternoon Lab (02:00 PM - 04:00 PM)">Afternoon Lab (02:00 PM - 04:00 PM)</option>
                </select>
              </div>
            </div>

            {/* Quick Mark All Controls & Session Metric */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-slate-900 font-mono tabular-nums">
                  {presentCount} / {totalCount} Present ({currentSessionPct}%)
                </div>
                <div className="text-[10px] text-slate-400">
                  {isLocked ? 'Locked Session Status' : 'Class Roll Call Session'}
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => markAll(true)}
                  disabled={isLocked}
                  className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  All Present
                </button>
                <button
                  type="button"
                  onClick={() => markAll(false)}
                  disabled={isLocked}
                  className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  All Absent
                </button>
              </div>
            </div>
          </div>

          {/* Quick Date Shortcuts */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200/80 text-[11px] text-slate-500">
            <span className="font-semibold text-slate-600">Quick Calendar Dates:</span>
            {[
              { label: 'Today', date: todayStr },
              { label: 'Next Day', date: tomorrowStr },
              { label: 'Yesterday', date: yesterdayStr },
              { label: 'Sep 30', date: '2026-09-30' },
              { label: 'Sep 28', date: '2026-09-28' },
            ].map((d) => {
              const isSelected = sessionDate === d.date;
              const hasRec = attendanceRecords.some((r) => r.courseCode === selectedCourse && r.sessionDate === d.date);
              return (
                <button
                  key={d.date}
                  type="button"
                  onClick={() => setSessionDate(d.date)}
                  className={`px-2.5 py-1 rounded font-mono transition-colors flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-teal-600 text-white font-bold'
                      : hasRec
                      ? 'bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>{d.label}</span>
                  {hasRec && (
                    <span title="Attendance locked for this session">
                      <Lock className="w-3 h-3 text-teal-700" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Locked Session Banner (No Edit Option) */}
        {isLocked && (
          <div className="p-3.5 px-5 border-b text-xs flex flex-wrap items-center justify-between gap-3 bg-teal-50/90 border-teal-200 text-teal-950">
            <div className="flex items-start sm:items-center gap-2.5">
              <Lock className="w-4 h-4 text-teal-700 shrink-0 mt-0.5 sm:mt-0" />
              <div>
                <div className="font-bold flex items-center gap-2">
                  <span>Attendance Locked for this Calendar Day</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-teal-200 text-teal-900 border border-teal-300">
                    Locked
                  </span>
                </div>
                <div className="text-[11px] text-teal-800 mt-0.5">
                  Attendance was submitted on {existingRecord?.markedAt} by {existingRecord?.markedBy}. Per university regulations, attendance can only be submitted once per class/session on each calendar day and cannot be modified or counted twice. Recorded status: <strong>{existingRecord?.presentStudentIds.length} Present</strong>, <strong>{existingRecord?.absentStudentIds.length} Absent</strong>.
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[11px] font-semibold text-teal-800 bg-white/80 px-2.5 py-1 rounded-md border border-teal-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
              <span>Record is Permanent</span>
            </div>
          </div>
        )}

        {/* Search inside roster */}
        <div className="p-3 border-b border-slate-100 flex items-center justify-between px-5">
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search student or roll number..."
              value={searchStudent}
              onChange={(e) => setSearchStudent(e.target.value)}
              className="w-full pl-8 pr-3 py-1 text-xs bg-slate-50 border border-slate-200 rounded-md"
            />
          </div>
          <div className="text-xs text-slate-500">
            Total Enrolled: <strong className="text-slate-800">{currentCourseObj.enrolledCount}</strong>
          </div>
        </div>

        {/* Student Roster Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Roll No / Student</th>
                <th className="py-3 px-4">Reg No</th>
                <th className="py-3 px-4">Branch & Sem</th>
                <th className="py-3 px-4 text-center">Cumulative %</th>
                <th className="py-3 px-4 text-center">Debarment Status</th>
                <th className="py-3 px-4 text-center">Session Attendance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((s) => {
                const isPresent = Boolean(attendanceState[s.id]);
                const isDefaulter = s.attendancePct < threshold;

                return (
                  <tr
                    key={s.id}
                    className={`hover:bg-slate-50/60 transition-colors ${
                      isDefaulter ? 'bg-rose-50/20' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{s.name}</div>
                      <div className="text-[11px] font-mono text-slate-400">{s.rollNo}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">{s.regNo}</td>
                    <td className="py-3.5 px-4 text-slate-500">
                      <div>{s.branch}</div>
                      <div className="text-[11px] text-slate-400">{s.semester}</div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`font-mono font-bold ${
                          isDefaulter ? 'text-rose-600' : 'text-slate-800'
                        }`}
                      >
                        {s.attendancePct}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {isDefaulter ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          <AlertTriangle className="w-3 h-3 text-rose-600" />
                          Below {threshold}%
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <Check className="w-3 h-3 text-emerald-600" />
                          Eligible
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => toggleStudent(s.id)}
                        disabled={isLocked}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1.5 ${
                          isPresent
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-rose-100 text-rose-800 border border-rose-200 hover:bg-rose-200'
                        } ${isLocked ? 'opacity-80 cursor-not-allowed' : 'cursor-pointer hover:scale-[1.02]'}`}
                      >
                        {isPresent ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            Present
                          </>
                        ) : (
                          <>
                            <X className="w-3.5 h-3.5" />
                            Absent
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer submission action */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            {isLocked ? (
              <span className="text-teal-900 font-semibold flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-teal-700" />
                This class session's attendance is locked for {sessionDate}. It cannot be submitted again or counted twice.
              </span>
            ) : (
              <span>Submitting registers and permanently locks this session's attendance for {sessionDate}.</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isLocked ? (
              <button
                type="button"
                disabled
                className="px-5 py-2 text-xs font-semibold rounded-lg bg-slate-200 text-slate-500 cursor-not-allowed flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                Attendance Locked (Already Submitted)
              </button>
            ) : (
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold rounded-lg text-white bg-teal-600 hover:bg-teal-700 transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                Submit Attendance Session ({presentCount} Present)
              </button>
            )}
          </div>
        </div>
      </form>

      {/* 3. Recorded Sessions Ledger (Shows unique attendance records) */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-teal-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Recorded Class Sessions Register ({selectedCourse})
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {courseRecords.length} unique daily sessions logged
          </span>
        </div>

        {courseRecords.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
                <tr>
                  <th className="py-2.5 px-4">Session Date</th>
                  <th className="py-2.5 px-4">Period / Slot</th>
                  <th className="py-2.5 px-4 text-center">Attendance Ratio</th>
                  <th className="py-2.5 px-4">Faculty In-Charge</th>
                  <th className="py-2.5 px-4">Recorded Timestamp</th>
                  <th className="py-2.5 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {courseRecords.map((rec) => {
                  const isCurrent =
                    rec.sessionDate === sessionDate && rec.sessionPeriod === sessionPeriod;
                  const ratio = Math.round((rec.presentStudentIds.length / rec.totalEnrolled) * 100);

                  return (
                    <tr
                      key={rec.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isCurrent ? 'bg-teal-50/30' : ''
                      }`}
                    >
                      <td className="py-3 px-4 font-mono font-bold text-slate-900 flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-teal-600" />
                        <span>{rec.sessionDate}</span>
                        {isCurrent && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-teal-100 text-teal-800 font-sans font-semibold">
                            Viewing
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-700">{rec.sessionPeriod}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="font-mono font-bold text-slate-900">
                          {rec.presentStudentIds.length} / {rec.totalEnrolled}
                        </span>{' '}
                        <span className="text-[11px] text-slate-500 font-mono">({ratio}%)</span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{rec.markedBy}</td>
                      <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                        {rec.markedAt}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-100 text-slate-600 border border-slate-200 inline-flex items-center gap-1">
                          <Lock className="w-3 h-3 text-slate-400" />
                          <span>Locked</span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-slate-400">
            No class sessions recorded yet for {selectedCourse}. Select a date above to submit attendance.
          </div>
        )}
      </div>
    </div>
  );
};
