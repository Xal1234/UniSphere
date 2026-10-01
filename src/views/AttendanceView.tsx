import React, { useState } from 'react';
import {
  CalendarCheck,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Filter,
  Sliders,
  Calendar,
  Check,
  X,
  Minus,
  Info,
} from 'lucide-react';
import { AttendanceCourse } from '../types';

interface AttendanceViewProps {
  courses: AttendanceCourse[];
  onLogSimulatedClass?: (courseCode: string, attended: boolean) => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  courses,
  onLogSimulatedClass,
}) => {
  const [threshold, setThreshold] = useState<number>(75);
  const [selectedSemester, setSelectedSemester] = useState<string>('Sem 6');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('All');
  const [selectedDetailCourse, setSelectedDetailCourse] = useState<AttendanceCourse | null>(null);

  // Filter courses
  const filteredCourses = courses.filter((c) => {
    if (selectedCourseFilter !== 'All' && c.code !== selectedCourseFilter) return false;
    return true;
  });

  const totalConducted = courses.reduce((sum, c) => sum + c.conducted, 0);
  const totalAttended = courses.reduce((sum, c) => sum + c.attended, 0);
  const totalPercentage = Math.round((totalAttended / totalConducted) * 1000) / 10;

  const lowCount = courses.filter((c) => c.percentage < threshold).length;

  return (
    <div className="space-y-6">
      {/* 1. Header & Threshold Controller */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="text-xs font-semibold text-teal-700 tracking-wide uppercase">
            Attendance Monitoring & BPUT Eligibility
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            Course-wise & Aggregate Attendance
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Calculated as per BPUT Academic Regulations (Minimum 75% for regular end-term examination seating)
          </p>
        </div>

        {/* Configurable Threshold Controller */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center gap-4 shrink-0">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-semibold text-slate-700">Minimum Threshold:</span>
            <span className="text-sm font-bold font-mono text-teal-700 tabular-nums">
              {threshold}%
            </span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="65"
              max="90"
              step="5"
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="w-28 sm:w-36 accent-teal-600 cursor-pointer"
            />
            <span className="text-[11px] text-slate-400 font-mono">BPUT Rule: 75%</span>
          </div>
        </div>
      </div>

      {/* 2. Top Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Aggregate Overall */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Overall University Attendance
            </span>
            <CalendarCheck className="w-4 h-4 text-teal-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-slate-900 tabular-nums">
              {totalPercentage}%
            </span>
            <span className="text-xs text-slate-500">
              ({totalAttended} / {totalConducted} classes)
            </span>
          </div>
          <div className="mt-3 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                totalPercentage >= threshold ? 'bg-teal-600' : 'bg-rose-500'
              }`}
              style={{ width: `${Math.min(totalPercentage, 100)}%` }}
            />
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            {totalPercentage >= threshold
              ? 'Eligible for Regular End-Term Examination.'
              : 'Attendance warning: excusal required.'}
          </p>
        </div>

        {/* Courses Below Threshold */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Courses Below {threshold}%
            </span>
            <AlertTriangle className={`w-4 h-4 ${lowCount > 0 ? 'text-amber-500' : 'text-slate-400'}`} />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span
              className={`text-3xl font-bold font-mono tabular-nums ${
                lowCount > 0 ? 'text-amber-600' : 'text-slate-900'
              }`}
            >
              {lowCount}
            </span>
            <span className="text-xs text-slate-500">of {courses.length} registered subjects</span>
          </div>
          <p className="mt-3 text-xs text-slate-600 line-clamp-2">
            {lowCount > 0
              ? `${courses.filter((c) => c.percentage < threshold).map((c) => c.code).join(', ')} require attendance recovery.`
              : 'All registered subjects satisfy the configured threshold.'}
          </p>
        </div>

        {/* Exam Seating Eligibility Status */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              BPUT Admit Card Status
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-bold rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
              Clearance In Progress
            </span>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Admit card token will be automatically released upon final biometric verification in Nov 2026.
          </p>
        </div>
      </div>

      {/* 3. Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Filter className="w-3.5 h-3.5" />
            <span>Semester:</span>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="Sem 6">6th Semester (Current)</option>
              <option value="Sem 5">5th Semester (Past)</option>
              <option value="Sem 4">4th Semester (Past)</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>Subject:</span>
            <select
              value={selectedCourseFilter}
              onChange={(e) => setSelectedCourseFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-teal-500 max-w-xs"
            >
              <option value="All">All Registered Courses</option>
              {courses.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} - {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-500">
          Showing <span className="font-semibold text-slate-800">{filteredCourses.length}</span> courses
        </div>
      </div>

      {/* 4. Course-wise Attendance Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm sm:text-base font-bold text-slate-900">
            Subject-wise Attendance Roster & Weekly Trend
          </h3>
          <span className="text-xs text-slate-400">Click a row to analyze attendance recovery</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Course</th>
                <th className="py-3 px-4">Faculty</th>
                <th className="py-3 px-4 text-center">Classes (Att/Tot)</th>
                <th className="py-3 px-4 text-center">Attendance %</th>
                <th className="py-3 px-4 text-center">Weekly Trend</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCourses.map((c) => {
                const isBelow = c.percentage < threshold;
                // Calculate how many more classes needed to reach threshold:
                // (attended + x) / (conducted + x) >= threshold / 100
                // attended + x >= 0.75 * conducted + 0.75x
                // 0.25x >= 0.75 * conducted - attended
                const target = threshold / 100;
                let neededClasses = 0;
                if (c.percentage < threshold) {
                  neededClasses = Math.ceil((target * c.conducted - c.attended) / (1 - target));
                }
                // Safe to miss:
                let safeToMiss = 0;
                if (c.percentage >= threshold) {
                  safeToMiss = Math.floor((c.attended - target * c.conducted) / target);
                }

                return (
                  <tr
                    key={c.code}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      isBelow ? 'bg-amber-50/30' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{c.name}</div>
                      <div className="text-[11px] font-mono text-slate-500">
                        {c.code} · {c.credits} Credits
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{c.faculty}</td>
                    <td className="py-3.5 px-4 text-center font-mono tabular-nums text-slate-800">
                      <span className="font-bold text-teal-700">{c.attended}</span> / {c.conducted}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5">
                        <span
                          className={`font-mono font-bold tabular-nums text-sm ${
                            isBelow ? 'text-amber-600' : 'text-slate-900'
                          }`}
                        >
                          {c.percentage.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-20 mx-auto bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                        <div
                          className={`h-full rounded-full ${
                            isBelow ? 'bg-amber-500' : 'bg-teal-600'
                          }`}
                          style={{ width: `${Math.min(c.percentage, 100)}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {/* Weekly trend dots */}
                      <div className="inline-flex items-center gap-1.5">
                        {c.weeklyTrend.map((t, idx) => (
                          <span
                            key={idx}
                            title={`${t.day}: ${t.status}`}
                            className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-mono ${
                              t.status === 'present'
                                ? 'bg-emerald-100 text-emerald-800 font-semibold'
                                : t.status === 'absent'
                                ? 'bg-rose-100 text-rose-800 font-semibold'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {t.day[0]}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {isBelow ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          Shortfall ({neededClasses} needed)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <Check className="w-3 h-3 text-emerald-600" />
                          On Track ({safeToMiss > 0 ? `${safeToMiss} cushion` : 'tight'})
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedDetailCourse(c)}
                        className="text-xs font-semibold text-teal-700 hover:text-teal-800 hover:underline"
                      >
                        Calculator
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Detailed Course Calculator Modal */}
      {selectedDetailCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-mono text-teal-700 font-semibold">
                  {selectedDetailCourse.code} · Attendance Analysis
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  {selectedDetailCourse.name}
                </h3>
                <p className="text-xs text-slate-500">Instructor: {selectedDetailCourse.faculty}</p>
              </div>
              <button
                onClick={() => setSelectedDetailCourse(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-100 grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-[10px] uppercase text-slate-400 font-semibold">Conducted</div>
                <div className="text-base font-bold font-mono text-slate-800 tabular-nums">
                  {selectedDetailCourse.conducted}
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase text-slate-400 font-semibold">Attended</div>
                <div className="text-base font-bold font-mono text-teal-700 tabular-nums">
                  {selectedDetailCourse.attended}
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase text-slate-400 font-semibold">Current %</div>
                <div
                  className={`text-base font-bold font-mono tabular-nums ${
                    selectedDetailCourse.percentage < threshold ? 'text-amber-600' : 'text-slate-900'
                  }`}
                >
                  {selectedDetailCourse.percentage}%
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-lg border border-slate-200 text-xs space-y-2">
              <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-teal-600" />
                Exam Eligibility Projection (Target: {threshold}%)
              </div>
              {selectedDetailCourse.percentage < threshold ? (
                <p className="text-slate-600">
                  You are currently <span className="font-semibold text-amber-700">below</span> the mandatory attendance requirement. You must attend the next{' '}
                  <span className="font-bold text-slate-900 font-mono">
                    {Math.ceil(
                      (threshold / 100 * selectedDetailCourse.conducted - selectedDetailCourse.attended) /
                        (1 - threshold / 100)
                    )}{' '}
                    consecutive classes
                  </span>{' '}
                  without absence to reach {threshold}%.
                </p>
              ) : (
                <p className="text-slate-600">
                  You are in good standing! You can miss up to{' '}
                  <span className="font-bold text-slate-900 font-mono">
                    {Math.floor(
                      (selectedDetailCourse.attended - (threshold / 100) * selectedDetailCourse.conducted) /
                        (threshold / 100)
                    )}{' '}
                    classes
                  </span>{' '}
                  while still remaining above the {threshold}% threshold.
                </p>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedDetailCourse(null)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800"
              >
                Close Calculator
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
