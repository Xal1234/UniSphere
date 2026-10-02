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
  Edit3,
  Calendar,
  Clock,
  History,
  ShieldAlert,
  Info,
} from 'lucide-react';
import { FacultyCourse, StudentRecord, ClassAttendanceRecord } from '../../types';

interface AdminAttendanceMarkingViewProps {
  courses: FacultyCourse[];
  students: StudentRecord[];
  attendanceRecords: ClassAttendanceRecord[];
  onSaveAttendanceRecord?: (record: ClassAttendanceRecord, isCorrection: boolean) => void;
  adminName?: string;
}

export const AdminAttendanceMarkingView: React.FC<AdminAttendanceMarkingViewProps> = ({
  courses,
  students,
  attendanceRecords = [],
  onSaveAttendanceRecord,
  adminName = 'Dr. Sudhir Kumar Mohanty',
}) => {
  const [selectedCourse, setSelectedCourse] = useState<string>(courses[0]?.code || 'RCS6C001');
  const [sessionDate, setSessionDate] = useState<string>('2026-10-01');
  const [sessionPeriod, setSessionPeriod] = useState<string>('Period 1 (09:00 AM - 10:00 AM)');
  const [threshold, setThreshold] = useState<number>(75);
  const [searchStudent, setSearchStudent] = useState<string>('');
  const [isEditingCorrection, setIsEditingCorrection] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'info'; text: string } | null>(null);

  // Find if an existing attendance record exists for this specific Course + Date + Period
  const existingRecord = attendanceRecords.find(
    (r) =>
      r.courseCode === selectedCourse &&
      r.sessionDate === sessionDate &&
      r.sessionPeriod === sessionPeriod
  );

  const isAlreadySaved = Boolean(existingRecord);

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
    setIsEditingCorrection(false);
    if (existingRecord) {
      const stateFromRecord: Record<string, boolean> = {};
      students.forEach((s) => {
        stateFromRecord[s.id] = existingRecord.presentStudentIds.includes(s.id);
      });
      setAttendanceState(stateFromRecord);
    } else {
      // Default roster attendance
      const freshState: Record<string, boolean> = {};
      students.forEach((s) => {
        freshState[s.id] = s.attendancePct >= 75;
      });
      setAttendanceState(freshState);
    }
  }, [selectedCourse, sessionDate, sessionPeriod, existingRecord, students]);

  const toggleStudent = (id: string) => {
    // Only allow toggling if it's a new session OR if we are in active correction mode
    if (isAlreadySaved && !isEditingCorrection) {
      setFeedbackMessage({
        type: 'info',
        text: 'This session is already saved. Click "Edit Saved Attendance" to make changes.',
      });
      return;
    }
    setAttendanceState((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const markAll = (present: boolean) => {
    if (isAlreadySaved && !isEditingCorrection) {
      setFeedbackMessage({
        type: 'info',
        text: 'This session is already saved. Click "Edit Saved Attendance" to unlock editing.',
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
      markedAt: existingRecord ? existingRecord.markedAt : nowStr,
      lastEditedAt: isAlreadySaved ? nowStr : undefined,
      presentStudentIds: presentIds,
      absentStudentIds: absentIds,
      totalEnrolled: students.length,
      remarks: isAlreadySaved
        ? `Attendance corrected on ${nowStr} by ${adminName}.`
        : `Class session recorded on ${nowStr} by ${adminName}.`,
    };

    if (onSaveAttendanceRecord) {
      onSaveAttendanceRecord(record, isAlreadySaved);
    }

    setIsEditingCorrection(false);
    setFeedbackMessage({
      type: 'success',
      text: isAlreadySaved
        ? `Attendance record successfully updated for ${sessionDate} (${presentIds.length} present, ${absentIds.length} absent). No duplicate record was created.`
        : `Attendance session successfully logged for ${sessionDate} (${presentIds.length} present, ${absentIds.length} absent).`,
    });

    setTimeout(() => {
      setFeedbackMessage(null);
    }, 4500);
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
            Real-time biometric & faculty validation synchronized with BPUT examination seating engine
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
                  <span className="text-[10px] text-teal-700 font-normal lowercase">(any term date)</span>
                </label>
                <input
                  type="date"
                  required
                  min="2026-08-01"
                  max="2026-11-30"
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
                <div className="text-[10px] text-slate-400">Class Roll Call Session</div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => markAll(true)}
                  disabled={isAlreadySaved && !isEditingCorrection}
                  className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  All Present
                </button>
                <button
                  type="button"
                  onClick={() => markAll(false)}
                  disabled={isAlreadySaved && !isEditingCorrection}
                  className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  All Absent
                </button>
              </div>
            </div>
          </div>

          {/* Quick Date Shortcuts */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200/80 text-[11px] text-slate-500">
            <span className="font-semibold text-slate-600">Quick Term Class Dates:</span>
            {[
              { label: 'Today (Oct 1)', date: '2026-10-01' },
              { label: 'Sep 30', date: '2026-09-30' },
              { label: 'Sep 28', date: '2026-09-28' },
              { label: 'Sep 25', date: '2026-09-25' },
              { label: 'Sep 24', date: '2026-09-24' },
            ].map((d) => {
              const isSelected = sessionDate === d.date;
              const hasRec = attendanceRecords.some((r) => r.courseCode === selectedCourse && r.sessionDate === d.date);
              return (
                <button
                  key={d.date}
                  type="button"
                  onClick={() => setSessionDate(d.date)}
                  className={`px-2 py-0.5 rounded font-mono transition-colors flex items-center gap-1 ${
                    isSelected
                      ? 'bg-teal-600 text-white font-bold'
                      : hasRec
                      ? 'bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>{d.label}</span>
                  {hasRec && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" title="Recorded session exists" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Existing Record Status or Correction Notification Banner */}
        {isAlreadySaved && (
          <div
            className={`p-3.5 px-5 border-b text-xs flex flex-wrap items-center justify-between gap-3 ${
              isEditingCorrection
                ? 'bg-amber-50/90 border-amber-300 text-amber-900'
                : 'bg-teal-50/80 border-teal-200 text-teal-900'
            }`}
          >
            <div className="flex items-start sm:items-center gap-2.5">
              {isEditingCorrection ? (
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 sm:mt-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0 mt-0.5 sm:mt-0" />
              )}
              <div>
                <div className="font-bold">
                  {isEditingCorrection
                    ? 'Attendance Correction Mode Active'
                    : 'Attendance Already Recorded for this Date & Slot'}
                </div>
                <div className="text-[11px] opacity-90">
                  {isEditingCorrection ? (
                    <span>
                      Modifying attendance for <strong>{sessionDate} ({sessionPeriod})</strong>. Saving will update the verified record without creating duplicate entries.
                    </span>
                  ) : (
                    <span>
                      Recorded on {existingRecord?.markedAt} by {existingRecord?.markedBy}. Recorded status: <strong>{existingRecord?.presentStudentIds.length} Present</strong>,{' '}
                      <strong>{existingRecord?.absentStudentIds.length} Absent</strong>.
                      {existingRecord?.lastEditedAt && (
                        <span className="italic ml-1">(Last edited: {existingRecord.lastEditedAt})</span>
                      )}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!isEditingCorrection ? (
                <button
                  type="button"
                  onClick={() => setIsEditingCorrection(true)}
                  className="px-3 py-1.5 bg-white border border-teal-300 text-teal-800 hover:bg-teal-100 rounded-lg font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit Saved Attendance
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingCorrection(false);
                    // Revert to saved record state
                    if (existingRecord) {
                      const reverted: Record<string, boolean> = {};
                      students.forEach((s) => {
                        reverted[s.id] = existingRecord.presentStudentIds.includes(s.id);
                      });
                      setAttendanceState(reverted);
                    }
                  }}
                  className="px-3 py-1.5 bg-white border border-amber-300 text-amber-800 hover:bg-amber-100 rounded-lg font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <X className="w-3.5 h-3.5" />
                  Cancel Correction
                </button>
              )}
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
                <th className="py-3 px-4">Student Particulars</th>
                <th className="py-3 px-4">Branch & Semester</th>
                <th className="py-3 px-4 text-center">Aggregate Attendance</th>
                <th className="py-3 px-4 text-center">BPUT Standing</th>
                <th className="py-3 px-4 text-center">
                  Session Attendance Status
                  {isAlreadySaved && !isEditingCorrection && (
                    <span className="block text-[10px] font-normal text-slate-400 lowercase">(read-only until edit clicked)</span>
                  )}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((s) => {
                const isPresent = attendanceState[s.id] ?? true;
                const isDefaulter = s.attendancePct < threshold;

                return (
                  <tr
                    key={s.id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      isDefaulter ? 'bg-amber-50/20' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{s.name}</div>
                      <div className="text-[11px] font-mono text-slate-500">
                        Roll: {s.rollNo} · Reg: {s.regNo}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      {s.branch} · {s.semester}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`font-mono font-bold tabular-nums text-xs ${
                          isDefaulter ? 'text-amber-700' : 'text-slate-900'
                        }`}
                      >
                        {s.attendancePct}%
                      </span>
                      <div className="w-16 mx-auto bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                        <div
                          className={`h-full rounded-full ${
                            isDefaulter ? 'bg-amber-500' : 'bg-teal-600'
                          }`}
                          style={{ width: `${Math.min(s.attendancePct, 100)}%` }}
                        />
                      </div>
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
                        disabled={isAlreadySaved && !isEditingCorrection}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1.5 ${
                          isPresent
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-rose-100 text-rose-800 border border-rose-200 hover:bg-rose-200'
                        } ${isAlreadySaved && !isEditingCorrection ? 'opacity-85 cursor-default' : 'cursor-pointer hover:scale-[1.02]'}`}
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
            {isAlreadySaved && !isEditingCorrection ? (
              <span className="text-teal-800 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                This session was saved previously. Click "Edit Saved Attendance" to apply corrections.
              </span>
            ) : isEditingCorrection ? (
              <span className="text-amber-800 font-semibold flex items-center gap-1.5">
                <Edit3 className="w-4 h-4 text-amber-600" />
                Ready to save attendance corrections for {sessionDate}.
              </span>
            ) : (
              <span>Submitting registers this session to university centralized student records.</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isAlreadySaved && !isEditingCorrection ? (
              <button
                type="button"
                onClick={() => setIsEditingCorrection(true)}
                className="px-5 py-2 text-xs font-semibold rounded-lg bg-teal-700 hover:bg-teal-800 text-white transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit Saved Attendance
              </button>
            ) : (
              <button
                type="submit"
                className={`px-5 py-2 text-xs font-semibold rounded-lg text-white transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer ${
                  isEditingCorrection ? 'bg-amber-600 hover:bg-amber-700' : 'bg-teal-600 hover:bg-teal-700'
                }`}
              >
                {isEditingCorrection ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Save Attendance Corrections ({presentCount} Present)
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    Submit Attendance Session ({presentCount} Present)
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </form>

      {/* 3. Recorded Sessions Ledger (Shows separate attendance records for different dates & sessions) */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-teal-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Recorded Class Sessions Register ({selectedCourse})
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {courseRecords.length} sessions logged
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
                  <th className="py-2.5 px-4">Recorded / Modified</th>
                  <th className="py-2.5 px-4 text-right">Actions</th>
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
                            Active
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
                        {rec.lastEditedAt ? (
                          <span title={`Initial: ${rec.markedAt}`}>
                            Edited: {rec.lastEditedAt}
                          </span>
                        ) : (
                          <span>{rec.markedAt}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setSessionDate(rec.sessionDate);
                            setSessionPeriod(rec.sessionPeriod);
                            setIsEditingCorrection(true);
                          }}
                          className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 border border-slate-200 transition-colors inline-flex items-center gap-1"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Open & Edit</span>
                        </button>
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
