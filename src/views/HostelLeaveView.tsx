import React, { useState } from 'react';
import {
  Building,
  Plus,
  QrCode,
  Calendar,
  Clock,
  MapPin,
  Phone,
  User,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Printer,
  X,
  Send,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { HostelLeaveRequest, UserRole, StudentProfile } from '../types';

interface HostelLeaveViewProps {
  leaves: HostelLeaveRequest[];
  userRole: UserRole;
  student: StudentProfile;
  onApplyHostelLeave: (leave: Omit<HostelLeaveRequest, 'id' | 'submittedAt' | 'status' | 'gatePassId'>) => void;
  onUpdateStatus: (id: string, status: 'Approved' | 'Rejected', remark?: string) => void;
  openCreateModalDirectly?: boolean;
}

export const HostelLeaveView: React.FC<HostelLeaveViewProps> = ({
  leaves,
  userRole,
  student,
  onApplyHostelLeave,
  onUpdateStatus,
  openCreateModalDirectly = false,
}) => {
  const [showApplyModal, setShowApplyModal] = useState(openCreateModalDirectly);
  const [selectedGatePass, setSelectedGatePass] = useState<HostelLeaveRequest | null>(null);
  const [selectedReviewLeave, setSelectedReviewLeave] = useState<HostelLeaveRequest | null>(null);
  const [wardenRemark, setWardenRemark] = useState('');

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
  const [depDate, setDepDate] = useState(todayStr);
  const [depTime, setDepTime] = useState('05:30 PM');
  const [retDate, setRetDate] = useState(todayStr);
  const [retTime, setRetTime] = useState('08:00 PM');
  const [destination, setDestination] = useState('Cuttack, Odisha');
  const [reason, setReason] = useState('Home visit for weekend and family function');
  const [emergencyContact, setEmergencyContact] = useState(student.guardianName);
  const [emergencyPhone, setEmergencyPhone] = useState(student.guardianPhone);
  const [dateError, setDateError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentToday = getTodayLocalDate();

    // Prevent selecting or submitting leave dates in the past
    if (!depDate || depDate < currentToday) {
      setDateError(`Invalid departure date: ${depDate || 'Empty'}. Hostel outpass cannot be applied for past dates. Please select today (${currentToday}) or a future date.`);
      return;
    }

    // Ensure the end date is not before the start date
    if (!retDate || retDate < depDate) {
      setDateError(`Invalid return date: Return date (${retDate}) cannot be earlier than departure date (${depDate}).`);
      return;
    }

    setDateError(null);
    onApplyHostelLeave({
      studentId: student.id,
      studentName: student.name,
      regNo: student.regNo,
      hostel: student.hostel,
      roomNo: student.roomNo,
      departureDate: depDate,
      departureTime: depTime,
      returnDate: retDate,
      returnTime: retTime,
      destination,
      reason,
      emergencyContact,
      emergencyPhone,
    });
    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      setShowApplyModal(false);
      setDateError(null);
    }, 900);
  };

  const handleAdminDecision = (status: 'Approved' | 'Rejected') => {
    if (!selectedReviewLeave) return;
    onUpdateStatus(selectedReviewLeave.id, status, wardenRemark.trim() || undefined);
    setSelectedReviewLeave(null);
    setWardenRemark('');
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Actions */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-teal-700 tracking-wide uppercase">
            Hall of Residence Out-Campus Management
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            Hostel Leave & Digital Gate Pass
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {student.hostel} · {student.roomNo} · Warden: {student.wardenName}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {userRole === 'student' && (
            <button
              onClick={() => setShowApplyModal(true)}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Apply Hostel Leave
            </button>
          )}

          {userRole === 'admin' && (
            <div className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>Warden Administration Desk</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Hostel & Warden Details Ribbon */}
      <div className="bg-slate-900 text-white rounded-xl p-5 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Assigned Hostel</div>
          <div className="text-sm font-bold text-white mt-0.5 truncate">{student.hostel}</div>
          <div className="text-xs text-teal-400 mt-0.5">{student.roomNo}</div>
        </div>

        <div>
          <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Chief Warden</div>
          <div className="text-sm font-bold text-white mt-0.5">{student.wardenName}</div>
          <div className="text-xs text-slate-400 mt-0.5">Contact: warden.bh2@bput.ac.in</div>
        </div>

        <div>
          <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Curfew Hours</div>
          <div className="text-sm font-bold text-white mt-0.5">09:30 PM (Main Gate)</div>
          <div className="text-xs text-slate-400 mt-0.5">Biometric check active</div>
        </div>

        <div>
          <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Emergency Parent Contact</div>
          <div className="text-sm font-bold text-white mt-0.5">{student.guardianName}</div>
          <div className="text-xs text-teal-400 font-mono mt-0.5">{student.guardianPhone}</div>
        </div>
      </div>

      {/* 3. Leave Applications Cards */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900">
          Leave Applications & Gate Pass History
        </h3>

        {leaves.map((leave) => {
          const isApproved = leave.status === 'Approved';
          const isPending = leave.status === 'Pending';

          return (
            <div
              key={leave.id}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5"
            >
              <div className="space-y-2.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-700">
                    {leave.id}
                  </span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span className="text-xs font-bold text-slate-900">
                    {leave.studentName} ({leave.regNo})
                  </span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span className="text-xs font-mono text-slate-500">
                    {leave.hostel} · {leave.roomNo}
                  </span>

                  {isApproved && (
                    <span className="text-[11px] px-2 py-0.5 rounded font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Approved · Gate Pass Active
                    </span>
                  )}
                  {isPending && (
                    <span className="text-[11px] px-2 py-0.5 rounded font-semibold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      Under Warden Verification
                    </span>
                  )}
                  {leave.status === 'Rejected' && (
                    <span className="text-[11px] px-2 py-0.5 rounded font-semibold bg-rose-50 text-rose-800 border border-rose-200 flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5 text-rose-600" />
                      Application Rejected
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Departure: <strong>{leave.departureDate} at {leave.departureTime}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Return: <strong>{leave.returnDate} by {leave.returnTime}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Destination: <strong>{leave.destination}</strong></span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="font-semibold text-slate-700">Reason: </span>
                  {leave.reason}
                  <span className="block mt-1 text-[11px] text-slate-500">
                    Emergency Contact: {leave.emergencyContact} ({leave.emergencyPhone})
                  </span>
                </p>

                {leave.wardenRemark && (
                  <div className="text-xs text-teal-900 bg-teal-50 border border-teal-100 p-2.5 rounded-lg">
                    <span className="font-semibold">Warden Remarks: </span>
                    {leave.wardenRemark}
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex sm:flex-col items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                {isApproved && (
                  <button
                    onClick={() => setSelectedGatePass(leave)}
                    className="w-full px-3.5 py-2 text-xs font-semibold rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <QrCode className="w-4 h-4" />
                    Digital Gate Pass
                  </button>
                )}

                {userRole === 'admin' && isPending && (
                  <>
                    <button
                      onClick={() => setSelectedReviewLeave(leave)}
                      className="w-full px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                    >
                      Verify & Approve
                    </button>
                    <button
                      onClick={() => onUpdateStatus(leave.id, 'Approved', 'Parental phone approval logged. Pass active.')}
                      className="w-full px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" /> Approve
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Digital Gate Pass Modal */}
      {selectedGatePass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono text-teal-700 font-bold uppercase tracking-wider">
                  BPUT Security Gate Clearance Pass
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Hostel Outpass · {selectedGatePass.gatePassId}
                </h3>
              </div>
              <button
                onClick={() => setSelectedGatePass(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Simulated QR Code & Security Stamp */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-2">
              <div className="w-32 h-32 mx-auto bg-white border border-slate-300 rounded-lg p-2 flex flex-col items-center justify-center shadow-xs">
                {/* SVG QR Code Simulation */}
                <div className="grid grid-cols-6 gap-1 w-full h-full p-1">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <div
                      key={i}
                      className={`${
                        (i % 2 === 0 && i % 3 === 0) || i < 8 || i > 28
                          ? 'bg-slate-900'
                          : 'bg-teal-700/80'
                      } rounded-xs`}
                    />
                  ))}
                </div>
              </div>
              <div className="text-xs font-mono font-bold text-slate-800 tracking-wider">
                {selectedGatePass.gatePassId}
              </div>
              <div className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 py-0.5 px-2 rounded inline-block">
                VALID SECURITY CLEARANCE
              </div>
            </div>

            <div className="space-y-2 text-xs border border-slate-100 rounded-lg p-3 bg-white">
              <div className="flex justify-between">
                <span className="text-slate-400">Student:</span>
                <span className="font-bold text-slate-900">{selectedGatePass.studentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Reg No:</span>
                <span className="font-mono text-slate-800">{selectedGatePass.regNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Hostel & Room:</span>
                <span className="text-slate-800">{selectedGatePass.hostel} · {selectedGatePass.roomNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Valid From:</span>
                <span className="font-mono text-slate-800">{selectedGatePass.departureDate} ({selectedGatePass.departureTime})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Return By:</span>
                <span className="font-mono text-slate-800">{selectedGatePass.returnDate} ({selectedGatePass.returnTime})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Destination:</span>
                <span className="text-slate-800 font-medium">{selectedGatePass.destination}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => window.print()}
                className="px-3 py-2 text-xs font-semibold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Pass
              </button>
              <button
                onClick={() => setSelectedGatePass(null)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Student Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-mono text-teal-700 font-semibold uppercase">
                  BPUT Hostel Requisition
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  Apply for Hostel Leave & Outpass
                </h3>
              </div>
              <button
                onClick={() => setShowApplyModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Departure Date *</label>
                  <input
                    type="date"
                    required
                    min={getTodayLocalDate()}
                    value={depDate}
                    onChange={(e) => {
                      setDepDate(e.target.value);
                      if (retDate < e.target.value) {
                        setRetDate(e.target.value);
                      }
                      if (e.target.value >= getTodayLocalDate()) {
                        setDateError(null);
                      }
                    }}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Must be today or a future date
                  </span>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Departure Time *</label>
                  <input
                    type="text"
                    required
                    value={depTime}
                    onChange={(e) => setDepTime(e.target.value)}
                    placeholder="e.g. 05:30 PM"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Expected Return Date *</label>
                  <input
                    type="date"
                    required
                    min={depDate || getTodayLocalDate()}
                    value={retDate}
                    onChange={(e) => {
                      setRetDate(e.target.value);
                      if (e.target.value >= depDate) {
                        setDateError(null);
                      }
                    }}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Must be on or after departure date
                  </span>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Return Time *</label>
                  <input
                    type="text"
                    required
                    value={retTime}
                    onChange={(e) => setRetTime(e.target.value)}
                    placeholder="e.g. 08:00 PM"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Destination Address / City *</label>
                <input
                  type="text"
                  required
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Home address, Bhubaneswar, Odisha"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Reason for Leave *</label>
                <input
                  type="text"
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Family gathering, medical appointment, festival"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Parent / Emergency Contact *</label>
                  <input
                    type="text"
                    required
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Emergency Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800"
                  />
                </div>
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
                  Leave applied! Sent to {student.wardenName} for gate clearance.
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
                  Submit for Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Admin Decision Modal */}
      {selectedReviewLeave && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-mono text-amber-700 font-semibold uppercase">
                  Warden Approval Desk
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  Hostel Outpass Request · {selectedReviewLeave.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedReviewLeave(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-2">
              <div>
                <span className="text-slate-400">Student: </span>
                <strong className="text-slate-900">{selectedReviewLeave.studentName} ({selectedReviewLeave.regNo})</strong>
              </div>
              <div>
                <span className="text-slate-400">Room: </span>
                <span className="text-slate-800">{selectedReviewLeave.hostel} · {selectedReviewLeave.roomNo}</span>
              </div>
              <div>
                <span className="text-slate-400">Dates: </span>
                <span className="text-slate-800">{selectedReviewLeave.departureDate} to {selectedReviewLeave.returnDate}</span>
              </div>
              <div>
                <span className="text-slate-400">Destination & Reason: </span>
                <span className="text-slate-800">{selectedReviewLeave.destination} ({selectedReviewLeave.reason})</span>
              </div>
              <div>
                <span className="text-slate-400">Emergency Phone: </span>
                <span className="font-mono text-teal-700 font-bold">{selectedReviewLeave.emergencyPhone} ({selectedReviewLeave.emergencyContact})</span>
              </div>
            </div>

            <div className="text-xs">
              <label className="block text-slate-700 font-semibold mb-1">
                Warden Verification Remark
              </label>
              <textarea
                rows={2}
                placeholder="Parent consent confirmed via phone call. Gate clearance granted."
                value={wardenRemark}
                onChange={(e) => setWardenRemark(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800"
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
                Issue Gate Pass
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
