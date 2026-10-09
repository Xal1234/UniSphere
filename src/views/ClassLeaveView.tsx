import React, { useState } from 'react';
import {
  FileText,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  Check,
  X,
  AlertCircle,
  User,
  Calendar,
  Send,
} from 'lucide-react';
import { ClassLeaveRequest, UserRole, StudentProfile } from '../types';

interface ClassLeaveViewProps {
  leaves: ClassLeaveRequest[];
  userRole: UserRole;
  student: StudentProfile;
  onApplyLeave: (leave: Omit<ClassLeaveRequest, 'id' | 'submittedAt' | 'status'>) => void;
  onUpdateStatus: (id: string, status: 'Approved' | 'Rejected', remark?: string) => void;
  openCreateModalDirectly?: boolean;
}

export const ClassLeaveView: React.FC<ClassLeaveViewProps> = ({
  leaves,
  userRole,
  student,
  onApplyLeave,
  onUpdateStatus,
  openCreateModalDirectly = false,
}) => {
  const [showApplyModal, setShowApplyModal] = useState(openCreateModalDirectly);
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');
  const [reviewModalLeave, setReviewModalLeave] = useState<ClassLeaveRequest | null>(null);
  const [adminRemark, setAdminRemark] = useState('');

  // Dynamic local date calculation (never hardcoded)
  const getTodayLocalDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayStr = getTodayLocalDate();

  // Form states
  const [leaveDate, setLeaveDate] = useState(todayStr);
  const [period, setPeriod] = useState('Periods 1 & 2 (09:00 AM - 11:00 AM)');
  const [reason, setReason] = useState<ClassLeaveRequest['reason']>('Campus Drive');
  const [note, setNote] = useState('');
  const [dateError, setDateError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState(false);

  const filteredLeaves = leaves.filter((l) => {
    if (selectedFilter !== 'All' && l.status !== selectedFilter) return false;
    return true;
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentToday = getTodayLocalDate();

    // Prevent selecting or submitting leave dates in the past
    if (!leaveDate || leaveDate < currentToday) {
      setDateError(`Invalid leave date: ${leaveDate || 'Empty'}. Leave requests cannot be applied for past dates. Please select today (${currentToday}) or a future date.`);
      return;
    }

    setDateError(null);
    onApplyLeave({
      studentId: student.id,
      studentName: student.name,
      regNo: student.regNo,
      date: leaveDate,
      period,
      reason,
      note: note.trim() || 'Official duty request.',
    });
    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      setShowApplyModal(false);
      setNote('');
      setDateError(null);
    }, 900);
  };

  const handleAdminDecision = (status: 'Approved' | 'Rejected') => {
    if (!reviewModalLeave) return;
    onUpdateStatus(reviewModalLeave.id, status, adminRemark.trim() || undefined);
    setReviewModalLeave(null);
    setAdminRemark('');
  };

  const pendingCount = leaves.filter((l) => l.status === 'Pending').length;
  const approvedCount = leaves.filter((l) => l.status === 'Approved').length;

  return (
    <div className="space-y-6">
      {/* 1. Header & Actions */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-teal-700 tracking-wide uppercase">
            Academic Attendance Waiver Portal
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            Class Leave (CL) Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Submit and review duty leaves for campus recruitment, technical conferences, or medical reasons.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {userRole === 'student' && (
            <button
              onClick={() => setShowApplyModal(true)}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Apply New Class Leave
            </button>
          )}

          {userRole === 'admin' && (
            <div className="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>{pendingCount} Pending Approval Queue</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Total Applications</div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
            {leaves.length}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Academic Year 2025-26</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Approved Duty Leaves</div>
          <div className="text-2xl font-bold font-mono text-emerald-600 mt-1 tabular-nums">
            {approvedCount}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Attendance credited to student record</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Awaiting Action</div>
          <div className="text-2xl font-bold font-mono text-amber-600 mt-1 tabular-nums">
            {pendingCount}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Under HoD / Faculty Advisor review</p>
        </div>
      </div>

      {/* 3. Filter Tabs */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          {(['All', 'Pending', 'Approved', 'Rejected'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                selectedFilter === filter
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-500">
          Showing <span className="font-semibold text-slate-800">{filteredLeaves.length}</span> applications
        </div>
      </div>

      {/* 4. Requests List */}
      <div className="space-y-3">
        {filteredLeaves.length > 0 ? (
          filteredLeaves.map((leave) => {
            const isPending = leave.status === 'Pending';
            const isApproved = leave.status === 'Approved';

            return (
              <div
                key={leave.id}
                className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-700">
                      {leave.id}
                    </span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="text-xs font-bold text-slate-900">
                      {leave.studentName} ({leave.regNo})
                    </span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
                      {leave.reason}
                    </span>
                    {isPending && (
                      <span className="text-[11px] px-2 py-0.5 rounded font-semibold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Pending Review
                      </span>
                    )}
                    {isApproved && (
                      <span className="text-[11px] px-2 py-0.5 rounded font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Approved
                      </span>
                    )}
                    {leave.status === 'Rejected' && (
                      <span className="text-[11px] px-2 py-0.5 rounded font-semibold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                        <XCircle className="w-3 h-3" /> Rejected
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-slate-600 flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Date: <strong className="font-semibold text-slate-800">{leave.date}</strong>
                    </span>
                    <span>Period: <strong className="font-semibold text-slate-800">{leave.period}</strong></span>
                    <span className="text-slate-400">Submitted: {leave.submittedAt}</span>
                  </div>

                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="font-semibold text-slate-700">Student Note: </span>
                    {leave.note}
                  </p>

                  {leave.adminRemark && (
                    <div className="text-xs text-slate-700 bg-teal-50/60 border border-teal-100 p-2.5 rounded-lg">
                      <span className="font-semibold text-teal-900">Faculty/HoD Remark: </span>
                      {leave.adminRemark}
                      {leave.reviewedBy && (
                        <span className="text-[10px] text-slate-500 block mt-0.5">
                          Reviewed by {leave.reviewedBy} on {leave.reviewedAt}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions: In Admin mode, show Approve / Reject */}
                {userRole === 'admin' && isPending && (
                  <div className="flex sm:flex-col items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <button
                      onClick={() => setReviewModalLeave(leave)}
                      className="w-full px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                    >
                      Review & Decide
                    </button>
                    <button
                      onClick={() => onUpdateStatus(leave.id, 'Approved', 'Approved by Dean Office')}
                      className="w-full px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1"
                    >
                      <Check className="w-3 h-3" /> Quick Approve
                    </button>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500">
            <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <div className="text-sm font-semibold text-slate-700">No leave requests found</div>
            <p className="text-xs text-slate-400 mt-1">
              There are no {selectedFilter !== 'All' ? selectedFilter.toLowerCase() : ''} class leave applications to display.
            </p>
          </div>
        )}
      </div>

      {/* 5. Student Apply Leave Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-mono text-teal-700 font-semibold uppercase">
                  BPUT Attendance Waiver Form
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  Apply for Class Leave (CL)
                </h3>
              </div>
              <button
                onClick={() => setShowApplyModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Student Name & Reg No
                  </label>
                  <input
                    type="text"
                    disabled
                    value={`${student.name} (${student.regNo})`}
                    className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-slate-600 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Leave Date *
                  </label>
                  <input
                    type="date"
                    required
                    min={getTodayLocalDate()}
                    value={leaveDate}
                    onChange={(e) => {
                      setLeaveDate(e.target.value);
                      if (e.target.value >= getTodayLocalDate()) {
                        setDateError(null);
                      }
                    }}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:ring-1 focus:ring-teal-500"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Must be today or a future date
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Periods / Classes Impacted *
                </label>
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:ring-1 focus:ring-teal-500"
                >
                  <option value="Periods 1 & 2 (09:00 AM - 11:00 AM)">
                    Periods 1 & 2 (09:00 AM - 11:00 AM)
                  </option>
                  <option value="Periods 3 & 4 (11:15 AM - 01:15 PM)">
                    Periods 3 & 4 (11:15 AM - 01:15 PM)
                  </option>
                  <option value="Afternoon Laboratory Session (02:00 PM - 05:00 PM)">
                    Afternoon Laboratory Session (02:00 PM - 05:00 PM)
                  </option>
                  <option value="Full Day (All scheduled lectures & labs)">
                    Full Day (All scheduled lectures & labs)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Leave Category / Reason *
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:ring-1 focus:ring-teal-500"
                >
                  <option value="Campus Drive">Campus Placement / Interview Drive</option>
                  <option value="Technical Fest">University Tech Fest / Hackathon Organization</option>
                  <option value="Medical">Medical Illness / Doctor Consultation</option>
                  <option value="Family Emergency">Family Emergency</option>
                  <option value="Other">Official University Representation / Sports</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Detailed Justification / Reference *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide supporting details, e.g. Interview round, hospital OPD slip number, or event coordinator name..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-slate-800 focus:ring-1 focus:ring-teal-500"
                />
              </div>

              {dateError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg font-semibold text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{dateError}</span>
                </div>
              )}

              {formSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Leave application submitted successfully for HoD verification!
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700 font-semibold flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Admin Review & Decision Modal */}
      {reviewModalLeave && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-mono text-amber-700 font-semibold uppercase">
                  Administrator Review Mode
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  Class Leave Evaluation · {reviewModalLeave.id}
                </h3>
              </div>
              <button
                onClick={() => setReviewModalLeave(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-2">
              <div>
                <span className="text-slate-400">Student: </span>
                <span className="font-bold text-slate-900">{reviewModalLeave.studentName}</span>{' '}
                <span className="font-mono text-slate-500">({reviewModalLeave.regNo})</span>
              </div>
              <div>
                <span className="text-slate-400">Date & Period: </span>
                <span className="font-semibold text-slate-800">{reviewModalLeave.date} · {reviewModalLeave.period}</span>
              </div>
              <div>
                <span className="text-slate-400">Reason: </span>
                <span className="font-semibold text-teal-700">{reviewModalLeave.reason}</span>
              </div>
              <div>
                <span className="text-slate-400">Student Note: </span>
                <p className="text-slate-700 mt-0.5 italic">{reviewModalLeave.note}</p>
              </div>
            </div>

            <div className="text-xs">
              <label className="block text-slate-700 font-semibold mb-1">
                Faculty / Dean Remarks (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="E.g., Verified with placement cell coordinator / Medical slip excused."
                value={adminRemark}
                onChange={(e) => setAdminRemark(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => handleAdminDecision('Rejected')}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 flex items-center gap-1.5"
              >
                <XCircle className="w-3.5 h-3.5" />
                Reject
              </button>
              <button
                onClick={() => handleAdminDecision('Approved')}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Approve & Credit Attendance
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
