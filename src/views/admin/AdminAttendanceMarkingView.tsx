import React, { useState } from 'react';
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
} from 'lucide-react';
import { FacultyCourse, StudentRecord } from '../../types';

interface AdminAttendanceMarkingViewProps {
  courses: FacultyCourse[];
  students: StudentRecord[];
  onLogClassAttendance?: (courseCode: string, studentIdsPresent: string[]) => void;
}

export const AdminAttendanceMarkingView: React.FC<AdminAttendanceMarkingViewProps> = ({
  courses,
  students,
  onLogClassAttendance,
}) => {
  const [selectedCourse, setSelectedCourse] = useState<string>(courses[0]?.code || 'RCS6C001');
  const [sessionDate, setSessionDate] = useState<string>('2026-10-01');
  const [sessionPeriod, setSessionPeriod] = useState<string>('Period 1 (09:00 AM - 10:00 AM)');
  const [attendanceState, setAttendanceState] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    students.forEach((s) => {
      // default present except known defaulters
      init[s.id] = s.attendancePct >= 75;
    });
    return init;
  });
  const [threshold, setThreshold] = useState<number>(75);
  const [sessionSubmitted, setSessionSubmitted] = useState<boolean>(false);
  const [searchStudent, setSearchStudent] = useState<string>('');

  const toggleStudent = (id: string) => {
    setAttendanceState((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const markAll = (present: boolean) => {
    const updated: Record<string, boolean> = {};
    students.forEach((s) => {
      updated[s.id] = present;
    });
    setAttendanceState(updated);
  };

  const handleSubmitSession = (e: React.FormEvent) => {
    e.preventDefault();
    const presentIds = Object.keys(attendanceState).filter((id) => attendanceState[id]);
    if (onLogClassAttendance) {
      onLogClassAttendance(selectedCourse, presentIds);
    }
    setSessionSubmitted(true);
    setTimeout(() => {
      setSessionSubmitted(false);
    }, 3000);
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

      {/* 2. Interactive Attendance Marking Terminal */}
      <form onSubmit={handleSubmitSession} className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        {/* Session setup bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-4">
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
              <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                Date
              </label>
              <input
                type="date"
                required
                value={sessionDate}
                onChange={(e) => setSessionDate(e.target.value)}
                className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                Slot / Period
              </label>
              <select
                value={sessionPeriod}
                onChange={(e) => setSessionPeriod(e.target.value)}
                className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 font-medium"
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
                className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                All Present
              </button>
              <button
                type="button"
                onClick={() => markAll(false)}
                className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                All Absent
              </button>
            </div>
          </div>
        </div>

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
                <th className="py-3 px-4 text-center">Current Class Status</th>
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
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1.5 ${
                          isPresent
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-rose-100 text-rose-800 border border-rose-200 hover:bg-rose-200'
                        }`}
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
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            {sessionSubmitted ? (
              <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Attendance session successfully logged and broadcast to student portal!
              </span>
            ) : (
              <span>Submitting registers this session to university centralized student records.</span>
            )}
          </div>

          <button
            type="submit"
            className="px-5 py-2 text-xs font-semibold rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors shadow-xs flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            Submit Attendance Session ({presentCount} Present)
          </button>
        </div>
      </form>
    </div>
  );
};
