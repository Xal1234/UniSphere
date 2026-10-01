import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  GraduationCap,
  Building,
  Mail,
  Phone,
  X,
  FileText,
  Clock,
} from 'lucide-react';
import { StudentRecord } from '../../types';

interface AdminStudentsDirectoryViewProps {
  students: StudentRecord[];
}

export const AdminStudentsDirectoryView: React.FC<AdminStudentsDirectoryViewProps> = ({
  students,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [inspectStudent, setInspectStudent] = useState<StudentRecord | null>(null);

  const branches = ['All', 'Computer Science & Engineering', 'Electronics & Telecommunication', 'Mechanical Engineering'];

  const filteredStudents = students.filter((s) => {
    if (selectedBranch !== 'All' && s.branch !== selectedBranch) return false;
    if (selectedStatus !== 'All' && s.status !== selectedStatus) return false;
    if (
      searchQuery &&
      !s.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !s.rollNo.includes(searchQuery) &&
      !s.regNo.includes(searchQuery) &&
      !s.email.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-teal-700 tracking-wide uppercase">
            Dean & HoD Student Affairs Database
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            Enrolled Students Academic & Residential Directory
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Query individual student profiles, semester CGPA progression, attendance compliance, and active hall allocation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-mono text-xs font-semibold">
            {students.length} Total Candidate Records
          </span>
        </div>
      </div>

      {/* 2. Filter & Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Status filter tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            {['All', 'Good Standing', 'Attendance Defaulter'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  selectedStatus === st
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-xs text-slate-800 font-medium ml-2"
          >
            {branches.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search name, roll, reg no..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* 3. Students Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">
            Student Records Roster ({filteredStudents.length})
          </h3>
          <span className="text-xs text-slate-400">Click any row to open student profile dossier</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Student Particulars</th>
                <th className="py-3 px-4">Branch & Sem</th>
                <th className="py-3 px-4 text-center">CGPA</th>
                <th className="py-3 px-4 text-center">Attendance %</th>
                <th className="py-3 px-4">Hostel & Room</th>
                <th className="py-3 px-4 text-center">Academic Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((s) => {
                const isDefaulter = s.status === 'Attendance Defaulter';

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
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">{s.branch}</div>
                      <div className="text-[11px] text-slate-500">{s.semester}</div>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-900 tabular-nums">
                      {s.cgpa.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`font-mono font-bold text-xs ${
                          s.attendancePct < 75 ? 'text-amber-700' : 'text-slate-900'
                        }`}
                      >
                        {s.attendancePct}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      <div>{s.hostel}</div>
                      <div className="text-[11px] text-slate-400">Room {s.roomNo}</div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {isDefaulter ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          <AlertTriangle className="w-3 h-3 text-rose-600" />
                          Defaulter
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Good Standing
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setInspectStudent(s)}
                        className="text-xs font-semibold text-teal-700 hover:text-teal-800 hover:underline"
                      >
                        View Dossier
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Student Profile Dossier Modal */}
      {inspectStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono text-teal-700 font-bold uppercase">
                  BPUT Candidate Profile File
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  {inspectStudent.name}
                </h3>
              </div>
              <button
                onClick={() => setInspectStudent(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">University Reg. No:</span>
                  <span className="font-mono font-bold text-slate-900">{inspectStudent.regNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Class Roll No:</span>
                  <span className="font-mono text-slate-800">{inspectStudent.rollNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Department:</span>
                  <span className="text-slate-800 font-semibold">{inspectStudent.branch}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Academic Standing:</span>
                  <span className="font-mono text-teal-700 font-bold">CGPA {inspectStudent.cgpa.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Overall Attendance:</span>
                  <span className="font-mono font-bold text-slate-800">{inspectStudent.attendancePct}%</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Hall of Residence:</span>
                  <span className="text-slate-800 font-medium">{inspectStudent.hostel} · Room {inspectStudent.roomNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Student Email:</span>
                  <span className="font-mono text-slate-700">{inspectStudent.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Phone Contact:</span>
                  <span className="font-mono text-slate-700">{inspectStudent.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Pending Submissions:</span>
                  <span className="text-amber-700 font-bold">{inspectStudent.pendingSubmissions} assignments</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setInspectStudent(null)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
