import React, { useState } from 'react';
import {
  LifeBuoy,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  Send,
  MessageSquare,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { HelpdeskTicket, UserRole, StudentProfile } from '../types';

interface HelpdeskViewProps {
  tickets: HelpdeskTicket[];
  userRole: UserRole;
  student: StudentProfile;
  onCreateTicket: (ticket: Omit<HelpdeskTicket, 'id' | 'ticketNo' | 'createdAt' | 'updatedAt' | 'status'>) => void;
  onUpdateTicketStatus: (id: string, status: HelpdeskTicket['status'], resolution?: string) => void;
}

export const HelpdeskView: React.FC<HelpdeskViewProps> = ({
  tickets,
  userRole,
  student,
  onCreateTicket,
  onUpdateTicketStatus,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedTicketToResolve, setSelectedTicketToResolve] = useState<HelpdeskTicket | null>(null);
  const [resolutionNote, setResolutionNote] = useState('');

  // Ticket Form States
  const [category, setCategory] = useState<HelpdeskTicket['category']>('Wi-Fi & LAN');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<HelpdeskTicket['priority']>('Medium');
  const [formSuccess, setFormSuccess] = useState(false);

  const filteredTickets = tickets.filter((t) => {
    if (selectedStatus !== 'All' && t.status !== selectedStatus) return false;
    return true;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateTicket({
      studentName: student.name,
      regNo: student.regNo,
      category,
      subject,
      description,
      priority,
    });
    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      setShowCreateModal(false);
      setSubject('');
      setDescription('');
    }, 800);
  };

  const handleResolveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicketToResolve) return;
    onUpdateTicketStatus(
      selectedTicketToResolve.id,
      'Resolved',
      resolutionNote.trim() || 'Service ticket investigated and rectified by university administration.'
    );
    setSelectedTicketToResolve(null);
    setResolutionNote('');
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-teal-700 tracking-wide uppercase">
            Campus Infrastructure & Student Grievances
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            Campus Helpdesk & Service Tickets
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Log maintenance issues for hostel rooms, university Wi-Fi, ERP records, or examination cell.
          </p>
        </div>

        {userRole === 'student' && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Raise New Service Ticket
          </button>
        )}
      </div>

      {/* 2. Filter Tabs */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          {['All', 'Open', 'In Progress', 'Resolved'].map((st) => (
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

        <div className="text-xs text-slate-500">
          Showing <span className="font-semibold text-slate-800">{filteredTickets.length}</span> tickets
        </div>
      </div>

      {/* 3. Ticket List */}
      <div className="space-y-3">
        {filteredTickets.map((t) => (
          <div
            key={t.id}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-start justify-between gap-4"
          >
            <div className="space-y-2 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono font-bold text-slate-700">
                  {t.ticketNo}
                </span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
                  {t.category}
                </span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="text-xs text-slate-500">
                  By {t.studentName} ({t.regNo})
                </span>

                {t.status === 'Open' && (
                  <span className="text-[11px] px-2 py-0.5 rounded font-semibold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-rose-600" /> Open Ticket
                  </span>
                )}
                {t.status === 'In Progress' && (
                  <span className="text-[11px] px-2 py-0.5 rounded font-semibold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-600" /> In Progress
                  </span>
                )}
                {t.status === 'Resolved' && (
                  <span className="text-[11px] px-2 py-0.5 rounded font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Resolved
                  </span>
                )}

                <span
                  className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded font-bold ${
                    t.priority === 'High' || t.priority === 'Urgent'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {t.priority} Priority
                </span>
              </div>

              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                {t.subject}
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                {t.description}
              </p>

              {t.assignedTo && (
                <div className="text-[11px] text-slate-500 flex items-center gap-2">
                  <span className="font-semibold text-slate-700">Assigned Desk:</span>
                  <span>{t.assignedTo}</span>
                </div>
              )}

              {t.resolution && (
                <div className="text-xs bg-emerald-50/60 border border-emerald-100 p-2.5 rounded-lg text-emerald-900">
                  <span className="font-bold">Resolution Note: </span>
                  {t.resolution}
                </div>
              )}

              <div className="text-[10px] text-slate-400 font-mono pt-1">
                Created: {t.createdAt} · Updated: {t.updatedAt}
              </div>
            </div>

            {/* Admin actions: resolve ticket */}
            {userRole === 'admin' && t.status !== 'Resolved' && (
              <div className="shrink-0 self-start">
                <button
                  onClick={() => setSelectedTicketToResolve(t)}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  Resolve Ticket
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 4. Student Create Ticket Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-mono text-teal-700 font-bold uppercase">
                  BPUT Campus Maintenance
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  Raise Campus Service Ticket
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Issue Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-medium"
                  >
                    <option value="Hostel Maintenance">Hostel Maintenance & Plumbing</option>
                    <option value="Wi-Fi & LAN">Wi-Fi & Campus LAN</option>
                    <option value="ERP & Portal">ERP & Portal Grade Discrepancy</option>
                    <option value="Exam Cell">Exam Cell & Admit Card</option>
                    <option value="ID Card">Student Smart ID Card</option>
                    <option value="Library">Library Fine & Access</option>
                    <option value="Transport">University Bus & Transport</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Priority Level *</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-medium"
                  >
                    <option value="Low">Low (General Query)</option>
                    <option value="Medium">Medium (Standard Request)</option>
                    <option value="High">High (Impacting Studies/Hostel)</option>
                    <option value="Urgent">Urgent (Immediate Safety/Exam Issue)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Subject / Issue Summary *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wi-Fi router DNS lookup failing in Brahmaputra Room 304"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Detailed Description & Location *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide precise location, room number, or steps to reproduce the issue..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800"
                />
              </div>

              {formSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Ticket dispatched to technical officer. Tracking ID created.
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700 font-semibold flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Admin Resolve Ticket Modal */}
      {selectedTicketToResolve && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-mono text-amber-700 font-bold uppercase">
                  Service Desk Resolution
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  Resolve {selectedTicketToResolve.ticketNo}
                </h3>
              </div>
              <button
                onClick={() => setSelectedTicketToResolve(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1.5">
              <div className="font-bold text-slate-900">{selectedTicketToResolve.subject}</div>
              <div className="text-slate-600 text-[11px]">{selectedTicketToResolve.description}</div>
            </div>

            <form onSubmit={handleResolveSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Resolution Summary / Corrective Action *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe the action taken (e.g., Access point replaced, electrical circuit rewired, ledger credit verified)..."
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedTicketToResolve(null)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 font-semibold flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Mark as Resolved
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
