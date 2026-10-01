import React, { useState } from 'react';
import {
  UserPlus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck,
  Award,
  ChevronRight,
  ShieldCheck,
  User,
  X,
  Mail,
  Phone,
} from 'lucide-react';
import { AdmissionApplicant, UserRole, StudentProfile } from '../types';

interface AdmissionsViewProps {
  applicants: AdmissionApplicant[];
  userRole: UserRole;
  student: StudentProfile;
  onUpdateApplicantStatus: (applicantId: string, newStatus: AdmissionApplicant['status'], remarks?: string) => void;
}

export const AdmissionsView: React.FC<AdmissionsViewProps> = ({
  applicants,
  userRole,
  student,
  onUpdateApplicantStatus,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedProgram, setSelectedProgram] = useState<string>('All');
  const [selectedApplicant, setSelectedApplicant] = useState<AdmissionApplicant | null>(null);
  const [updatedStatus, setUpdatedStatus] = useState<AdmissionApplicant['status']>('Provisionally Admitted');
  const [adminRemark, setAdminRemark] = useState('');

  // Filter applicants for admin
  const filteredApplicants = applicants.filter((app) => {
    if (selectedStatus !== 'All' && app.status !== selectedStatus) return false;
    if (selectedProgram !== 'All' && !app.program.includes(selectedProgram)) return false;
    if (
      searchQuery &&
      !app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !app.applicationNo.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !app.branch.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const handleSaveStatus = () => {
    if (!selectedApplicant) return;
    onUpdateApplicantStatus(selectedApplicant.id, updatedStatus, adminRemark || undefined);
    setSelectedApplicant(null);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-teal-700 tracking-wide uppercase">
            BPUT Central Admissions & Counseling Cell
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            {userRole === 'admin' ? 'Applicant Tracking & Verification System' : 'Admission & Enrollment Status'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {userRole === 'admin'
              ? 'Review OJEE / JEE Main rank allotments, document dossiers, and provisional seat locks.'
              : 'Official university enrollment dossier, registration number allotment, and verified certificates.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold">
            Academic Session 2026-27 Intake
          </span>
        </div>
      </div>

      {/* 2. If Student Mode: Show Student's Personal Admission Journey Tracker */}
      {userRole === 'student' && (
        <div className="space-y-6">
          {/* Milestone Stepper */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-6">
              Admission Verification Milestones · {student.regNo}
            </h3>

            <div className="relative">
              <div className="hidden sm:block absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative z-10">
                {[
                  { title: 'JEE / OJEE Rank Lock', status: 'Completed', date: 'Jul 2022' },
                  { title: 'Central Counseling', status: 'Completed', date: 'Aug 2022' },
                  { title: 'Document Verification', status: 'Completed', date: 'Aug 2022' },
                  { title: 'Institute Admission Fee', status: 'Completed', date: 'Sep 2022' },
                  { title: 'Permanent Reg. Allotted', status: 'Active', date: 'Oct 2022' },
                ].map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white border border-slate-200 rounded-xl flex sm:flex-col items-center sm:text-center gap-3 shadow-xs"
                  >
                    <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{step.title}</div>
                      <div className="text-[11px] text-teal-700 font-semibold">{step.status}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{step.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Student Dossier Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
              <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                Allotment Particulars
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Applicant Name:</span>
                  <span className="font-bold text-slate-900">{student.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Application Number:</span>
                  <span className="font-mono text-slate-800">BPUT-ADM-22-8419</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Admitted Program:</span>
                  <span className="text-slate-800 font-semibold">{student.course}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Branch & Specialization:</span>
                  <span className="text-slate-800 font-semibold">{student.branch}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Admission Category:</span>
                  <span className="text-slate-800">General (OJEE State Merit)</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
              <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                Document Verification Dossier
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded bg-slate-50">
                  <span className="text-slate-700">10th Board Certificate & Marksheet</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-slate-50">
                  <span className="text-slate-700">12th Intermediate Marksheet</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-slate-50">
                  <span className="text-slate-700">OJEE / JEE Rank Card</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-slate-50">
                  <span className="text-slate-700">College Leaving & Conduct Certificate</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. If Admin Mode: Show Applicant Tracking Roster */}
      {userRole === 'admin' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg">
                {['All', 'Under Review', 'Shortlisted', 'Provisionally Admitted', 'Submitted'].map((st) => (
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
                value={selectedProgram}
                onChange={(e) => setSelectedProgram(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-xs text-slate-800 font-medium ml-2"
              >
                <option value="All">All Programs</option>
                <option value="B.Tech">B.Tech</option>
                <option value="M.Tech">M.Tech</option>
                <option value="MCA">MCA</option>
              </select>
            </div>

            <div className="relative w-full md:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search applicant or branch..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Applicants Table */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                Applicant Counseling Dossiers ({filteredApplicants.length})
              </h3>
              <span className="text-xs text-slate-400">Click row to review documents & update status</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Applicant</th>
                    <th className="py-3 px-4">Program & Branch</th>
                    <th className="py-3 px-4 text-center">Entrance Rank</th>
                    <th className="py-3 px-4 text-center">Category</th>
                    <th className="py-3 px-4 text-center">Doc Checklist</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredApplicants.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{app.applicantName}</div>
                        <div className="text-[11px] font-mono text-slate-500">
                          {app.applicationNo} · Applied {app.applicationDate}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">{app.program}</div>
                        <div className="text-[11px] text-slate-500">{app.branch}</div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="font-mono font-bold text-slate-800 tabular-nums">
                          Rank {app.entranceRank.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-slate-400">{app.entranceExam}</div>
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-semibold text-slate-700">
                        {app.category}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono tabular-nums">
                        <span
                          className={`font-bold ${
                            app.documentsVerified === app.totalDocuments
                              ? 'text-emerald-700'
                              : 'text-amber-600'
                          }`}
                        >
                          {app.documentsVerified}/{app.totalDocuments}
                        </span>{' '}
                        <span className="text-[10px] text-slate-400">verified</span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold ${
                            app.status === 'Provisionally Admitted'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : app.status === 'Shortlisted'
                              ? 'bg-blue-50 text-blue-800 border border-blue-200'
                              : app.status === 'Under Review'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedApplicant(app);
                            setUpdatedStatus(app.status);
                            setAdminRemark(app.remarks || '');
                          }}
                          className="px-3 py-1 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. Admin Review & Status Update Modal */}
      {selectedApplicant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-mono text-teal-700 font-bold uppercase">
                  BPUT Counseling Authority
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  Applicant Review: {selectedApplicant.applicantName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedApplicant(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Application ID:</span>
                <span className="font-mono font-bold text-slate-800">{selectedApplicant.applicationNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Program & Branch:</span>
                <span className="font-semibold text-slate-800">{selectedApplicant.program} · {selectedApplicant.branch}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Entrance Score:</span>
                <span className="font-mono text-teal-700 font-bold">{selectedApplicant.entranceExam} Rank {selectedApplicant.entranceRank}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Candidate Contact:</span>
                <span className="text-slate-700">{selectedApplicant.contactEmail} ({selectedApplicant.contactPhone})</span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Change Admission Status
                </label>
                <select
                  value={updatedStatus}
                  onChange={(e) => setUpdatedStatus(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-semibold"
                >
                  <option value="Submitted">Submitted (Queue)</option>
                  <option value="Under Review">Under Review (Scrutiny)</option>
                  <option value="Shortlisted">Shortlisted for Seat Lock</option>
                  <option value="Provisionally Admitted">Provisionally Admitted</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Counseling Notes / Document Checklist Remarks
                </label>
                <textarea
                  rows={2}
                  value={adminRemark}
                  onChange={(e) => setAdminRemark(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedApplicant(null)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveStatus}
                className="px-4 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700 font-semibold flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Update Admission Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
