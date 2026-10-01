import React, { useState } from 'react';
import {
  GraduationCap,
  Award,
  Download,
  CheckCircle2,
  Clock,
  Printer,
  X,
  FileText,
  TrendingUp,
  BookOpen,
} from 'lucide-react';
import { SemesterResult, AttendanceCourse, StudentProfile } from '../types';

interface AcademicsViewProps {
  results: SemesterResult[];
  currentCourses: AttendanceCourse[];
  student: StudentProfile;
}

export const AcademicsView: React.FC<AcademicsViewProps> = ({
  results,
  currentCourses,
  student,
}) => {
  const [selectedSemNumber, setSelectedSemNumber] = useState<number>(5);
  const [showTranscriptModal, setShowTranscriptModal] = useState<boolean>(false);

  const selectedResult = results.find((r) => r.semester === selectedSemNumber) || results[0];

  // Cumulative CGPA of latest published sem
  const currentCGPA = results[0]?.cgpa || 8.72;

  // Grade point mapping description
  const gradeSystem = [
    { grade: 'O', point: 10, desc: 'Outstanding' },
    { grade: 'E', point: 9, desc: 'Excellent' },
    { grade: 'A', point: 8, desc: 'Very Good' },
    { grade: 'B', point: 7, desc: 'Good' },
    { grade: 'C', point: 6, desc: 'Fair' },
    { grade: 'D', point: 5, desc: 'Below Average' },
    { grade: 'F', point: 0, desc: 'Failed' },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-teal-700 tracking-wide uppercase">
            BPUT Examination & Grade Registry
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            Academics & Semester Results
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            B.Tech Computer Science & Engineering · Reg: {student.regNo} · No active backlogs
          </p>
        </div>

        <button
          onClick={() => setShowTranscriptModal(true)}
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors shadow-xs flex items-center gap-1.5 self-start md:self-auto"
        >
          <Download className="w-4 h-4" />
          Provisional Grade Sheet
        </button>
      </div>

      {/* 2. CGPA Summary & Progression */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Cumulative GPA (CGPA)
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-bold font-mono text-slate-900 tabular-nums">
              {currentCGPA.toFixed(2)}
            </span>
            <span className="text-xs text-slate-500">/ 10.00 Scale</span>
          </div>
          <p className="text-xs text-emerald-700 font-semibold mt-2">
            First Class with Honours Eligible
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Latest Semester (Sem 5) SGPA
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-bold font-mono text-teal-700 tabular-nums">
              {results[0]?.sgpa.toFixed(2)}
            </span>
            <span className="text-xs text-slate-500">Autumn 2025</span>
          </div>
          <p className="text-xs text-slate-600 mt-2">
            Ranked in top 5% of CSE department
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Earned Credits
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-bold font-mono text-slate-900 tabular-nums">
              112
            </span>
            <span className="text-xs text-slate-500">/ 160 Required</span>
          </div>
          <p className="text-xs text-slate-600 mt-2">
            Sem 6: 22 Credits currently enrolled
          </p>
        </div>
      </div>

      {/* 3. Semester Progression Bar Visualization */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center justify-between">
          <span>Semester-wise SGPA Progression</span>
          <span className="text-xs text-slate-400 font-normal">All semesters cleared</span>
        </h3>

        <div className="grid grid-cols-6 gap-2 sm:gap-4 items-end pt-4 pb-2 border-b border-slate-100">
          {[...results].reverse().map((r) => {
            const heightPercent = ((r.sgpa - 7.0) / 3.0) * 100;
            return (
              <div
                key={r.semester}
                onClick={() => setSelectedSemNumber(r.semester)}
                className="flex flex-col items-center gap-2 cursor-pointer group"
              >
                <span className="text-xs font-mono font-bold text-slate-800 tabular-nums group-hover:text-teal-700">
                  {r.sgpa.toFixed(2)}
                </span>
                <div className="w-full max-w-[48px] bg-slate-100 rounded-t-md h-28 flex items-end p-1">
                  <div
                    className={`w-full rounded-t transition-all ${
                      selectedSemNumber === r.semester
                        ? 'bg-teal-600'
                        : 'bg-slate-300 group-hover:bg-slate-400'
                    }`}
                    style={{ height: `${Math.max(heightPercent, 20)}%` }}
                  />
                </div>
                <span
                  className={`text-[11px] font-semibold ${
                    selectedSemNumber === r.semester
                      ? 'text-teal-700 underline font-bold'
                      : 'text-slate-500'
                  }`}
                >
                  Sem {r.semester}
                </span>
              </div>
            );
          })}

          {/* Current Semester 6 (In-progress) */}
          <div className="flex flex-col items-center gap-2 opacity-75">
            <span className="text-xs font-mono text-amber-600 font-bold">In-Prog</span>
            <div className="w-full max-w-[48px] bg-slate-100 border border-dashed border-amber-300 rounded-t-md h-28 flex items-end p-1">
              <div className="w-full h-1/2 bg-amber-200/80 rounded-t" />
            </div>
            <span className="text-[11px] font-semibold text-amber-700">Sem 6</span>
          </div>
        </div>
      </div>

      {/* 4. Semester Results Table & Tab Selector */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">
                {selectedResult.semesterName}
              </h3>
              <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
                Official Result Published
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Published on: {selectedResult.publishDate} · SGPA: <strong className="font-mono text-slate-800">{selectedResult.sgpa.toFixed(2)}</strong> · CGPA: <strong className="font-mono text-slate-800">{selectedResult.cgpa.toFixed(2)}</strong>
            </p>
          </div>

          {/* Semester Selector */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto">
            {results.map((r) => (
              <button
                key={r.semester}
                onClick={() => setSelectedSemNumber(r.semester)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  selectedSemNumber === r.semester
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sem {r.semester}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Subject Code</th>
                <th className="py-3 px-4">Course Name</th>
                <th className="py-3 px-4 text-center">Credits</th>
                <th className="py-3 px-4 text-center">Letter Grade</th>
                <th className="py-3 px-4 text-center">Grade Point</th>
                <th className="py-3 px-4 text-right">Result Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {selectedResult.subjects.map((sub) => (
                <tr key={sub.code} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-semibold text-slate-800">
                    {sub.code}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-900">
                    {sub.name}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono tabular-nums text-slate-700">
                    {sub.credits}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded font-mono font-bold text-xs ${
                        sub.grade === 'O'
                          ? 'bg-purple-100 text-purple-900'
                          : sub.grade === 'E'
                          ? 'bg-teal-100 text-teal-900'
                          : 'bg-blue-100 text-blue-900'
                      }`}
                    >
                      {sub.grade}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono tabular-nums font-bold text-slate-900">
                    {sub.gradePoint}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="text-emerald-700 font-semibold inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Passed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Ongoing Current Semester Course Registrations */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Currently Enrolled Courses (6th Semester - Spring 2026)
            </h3>
            <p className="text-xs text-slate-500">
              End-term examination scheduled for Nov 2026 · Results not yet evaluated
            </p>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded font-semibold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-600" />
            Evaluation Pending
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          {currentCourses.map((c) => (
            <div
              key={c.code}
              className="p-3.5 rounded-lg border border-slate-100 bg-slate-50/50 flex items-center justify-between"
            >
              <div>
                <span className="text-[11px] font-mono font-bold text-teal-700">
                  {c.code} · {c.credits} Credits
                </span>
                <div className="text-xs font-bold text-slate-900 mt-0.5">{c.name}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Faculty: {c.faculty}</div>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-mono px-2 py-1 rounded bg-slate-200 text-slate-700 font-semibold">
                  Course In Progress
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Provisional Grade Sheet Printable Modal */}
      {showTranscriptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-700">
                  BIJU PATNAIK UNIVERSITY OF TECHNOLOGY, ODISHA
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Provisional Semester Grade Transcript
                </h3>
              </div>
              <button
                onClick={() => setShowTranscriptModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* University Document Layout */}
            <div className="p-4 border border-slate-200 rounded-lg bg-slate-50 text-xs space-y-3 font-sans">
              <div className="text-center pb-2 border-b border-slate-200">
                <div className="text-sm font-bold text-slate-900">
                  BIJU PATNAIK UNIVERSITY OF TECHNOLOGY
                </div>
                <div className="text-[11px] text-slate-600">
                  Chhend Colony, Rourkela, Odisha - 769004
                </div>
                <div className="text-[10px] uppercase font-mono font-semibold text-slate-500 mt-1">
                  OFFICIAL GRADE CARD · DEGREE OF BACHELOR OF TECHNOLOGY
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs py-1 border-b border-slate-200">
                <div>
                  <span className="text-slate-500">Student Name: </span>
                  <strong className="text-slate-900">{student.name}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Registration No: </span>
                  <strong className="font-mono text-slate-900">{student.regNo}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Branch: </span>
                  <span className="text-slate-800">{student.branch}</span>
                </div>
                <div>
                  <span className="text-slate-500">Session: </span>
                  <span className="text-slate-800">2022 - 2026 Regular</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="font-semibold text-slate-800 text-[11px]">
                  5th Semester Results Breakdown:
                </div>
                <table className="w-full text-left text-[11px]">
                  <thead>
                    <tr className="border-b border-slate-300 font-semibold text-slate-600">
                      <th className="py-1">Code</th>
                      <th className="py-1">Subject Title</th>
                      <th className="py-1 text-center">Cr</th>
                      <th className="py-1 text-center">Grade</th>
                      <th className="py-1 text-right">Points</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {results[0].subjects.map((s) => (
                      <tr key={s.code}>
                        <td className="py-1 font-mono">{s.code}</td>
                        <td className="py-1">{s.name}</td>
                        <td className="py-1 text-center font-mono">{s.credits}</td>
                        <td className="py-1 text-center font-mono font-bold">{s.grade}</td>
                        <td className="py-1 text-right font-mono">{s.gradePoint}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between font-mono font-bold text-xs text-slate-900">
                <span>SEMESTER SGPA: {results[0].sgpa.toFixed(2)}</span>
                <span>CUMULATIVE CGPA: {results[0].cgpa.toFixed(2)}</span>
              </div>

              <div className="pt-4 flex justify-between items-end text-[10px] text-slate-500">
                <div>
                  <div>Date of Issue: 20-Jan-2026</div>
                  <div>Doc Hash: BPUT/TR/2026/8912A</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-slate-700">Controller of Examinations</div>
                  <div>BPUT, Odisha</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => window.print()}
                className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Transcript
              </button>
              <button
                onClick={() => setShowTranscriptModal(false)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
