import React, { useState } from 'react';
import {
  UserCircle,
  FileText,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  Building,
  Calendar,
  ShieldCheck,
  Send,
  X,
  FileCheck,
  Briefcase,
  AlertCircle,
  Info,
  Sun,
  Moon,
  Monitor,
  Laptop,
  Tablet,
  Smartphone,
  Sliders,
  Check,
} from 'lucide-react';
import { AdminProfile, StaffLeaveRequest, StaffTimetableSlot, Notice, CampusEvent, ThemePreference, DevicePreference, DensityPreference } from '../../types';
import { initialStaffDocuments } from '../../data/mockData';

interface AdminStaffProfileViewProps {
  admin: AdminProfile;
  staffLeaves: StaffLeaveRequest[];
  timetable: StaffTimetableSlot[];
  notices?: Notice[];
  events?: CampusEvent[];
  onSubmitStaffLeave: (newLeave: Omit<StaffLeaveRequest, 'id' | 'submittedAt' | 'status' | 'approvedBy'>) => void;
  openLeaveModalDirectly?: boolean;
  themePreference?: ThemePreference;
  onToggleTheme?: (theme: ThemePreference) => void;
  devicePreference?: DevicePreference;
  onChangeDevicePreference?: (device: DevicePreference) => void;
  densityPreference?: DensityPreference;
  onChangeDensityPreference?: (density: DensityPreference) => void;
}

export const AdminStaffProfileView: React.FC<AdminStaffProfileViewProps> = ({
  admin,
  staffLeaves,
  timetable,
  notices = [],
  events = [],
  onSubmitStaffLeave,
  openLeaveModalDirectly = false,
  themePreference = 'light',
  onToggleTheme,
  devicePreference = 'responsive',
  onChangeDevicePreference,
  densityPreference = 'comfortable',
  onChangeDensityPreference,
}) => {
  const [showApplyModal, setShowApplyModal] = useState<boolean>(openLeaveModalDirectly);
  const [activeTab, setActiveTab] = useState<'profile' | 'schedule' | 'leaves' | 'bulletins'>('profile');
  const [selectedDay, setSelectedDay] = useState<StaffTimetableSlot['day']>('Monday');

  // Form states
  const [leaveType, setLeaveType] = useState<StaffLeaveRequest['leaveType']>('Casual Leave (CL)');
  const [startDate, setStartDate] = useState<string>('2026-10-28');
  const [endDate, setEndDate] = useState<string>('2026-10-29');
  const [reason, setReason] = useState<string>('Attending International Conference on Intelligent Database Systems as Keynote Speaker.');
  const [handoverFaculty, setHandoverFaculty] = useState<string>('Dr. Ananya Behera (Associate Prof., CSE)');
  const [formSuccess, setFormSuccess] = useState<boolean>(false);

  const calculateDays = (start: string, end: string) => {
    const d1 = new Date(start);
    const d2 = new Date(end);
    const diff = Math.max(1, Math.round((d2.getTime() - d1.getTime()) / (1000 * 3600 * 24)) + 1);
    return isNaN(diff) ? 1 : diff;
  };

  const handleLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const days = calculateDays(startDate, endDate);
    onSubmitStaffLeave({
      staffId: admin.employeeId,
      staffName: admin.name,
      department: admin.department,
      leaveType,
      startDate,
      endDate,
      totalDays: days,
      reason,
      handoverFaculty,
    });
    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      setShowApplyModal(false);
      setReason('');
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-teal-700 tracking-wide uppercase">
            Staff Self-Service & Faculty Personnel Dossier
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            My Staff Profile & Leave Requests
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {admin.name} · {admin.designation} · Employee Code: {admin.employeeId}
          </p>
        </div>

        <button
          onClick={() => setShowApplyModal(true)}
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors shadow-xs flex items-center gap-1.5 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          Apply Staff Leave
        </button>
      </div>

      {/* Sub-navigation tabs for Staff Self-Service */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg max-w-xl text-xs">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex-1 py-1.5 px-3 rounded-md font-medium transition-colors ${
            activeTab === 'profile'
              ? 'bg-white text-slate-900 shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Overview & Dossier
        </button>
        <button
          onClick={() => setActiveTab('schedule')}
          className={`flex-1 py-1.5 px-3 rounded-md font-medium transition-colors ${
            activeTab === 'schedule'
              ? 'bg-white text-slate-900 shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          My Teaching Schedule
        </button>
        <button
          onClick={() => setActiveTab('leaves')}
          className={`flex-1 py-1.5 px-3 rounded-md font-medium transition-colors ${
            activeTab === 'leaves'
              ? 'bg-white text-slate-900 shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Staff Leaves ({staffLeaves.length})
        </button>
        <button
          onClick={() => setActiveTab('bulletins')}
          className={`flex-1 py-1.5 px-3 rounded-md font-medium transition-colors ${
            activeTab === 'bulletins'
              ? 'bg-white text-slate-900 shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Staff Bulletins & Events
        </button>
      </div>

      {/* Tab 1: Profile & Dossier */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Employment Particulars */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <UserCircle className="w-4 h-4 text-teal-700" />
                <h3 className="text-sm font-bold text-slate-900">
                  Staff Employment Records
                </h3>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Employee ID:</span>
                  <span className="font-mono font-bold text-slate-900">{admin.employeeId}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Designation:</span>
                  <span className="font-semibold text-slate-900">{admin.designation}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Department:</span>
                  <span className="text-slate-800">{admin.department}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Official Email:</span>
                  <span className="font-mono text-slate-800">{admin.email}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Phone Contact:</span>
                  <span className="font-mono text-slate-800">{admin.phone}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Administrative Role:</span>
                  <span className="text-teal-700 font-bold">{admin.roleType}</span>
                </div>
              </div>
            </div>

            {/* Staff Leave Balances */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Briefcase className="w-4 h-4 text-teal-700" />
                <h3 className="text-sm font-bold text-slate-900">
                  Annual Staff Leave Entitlement (2025-26)
                </h3>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-lg border border-slate-100 bg-slate-50">
                  <div className="text-[10px] uppercase font-semibold text-slate-400">Casual Leave</div>
                  <div className="text-xl font-bold font-mono text-slate-900 mt-1">8 / 12</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Days remaining</div>
                </div>
                <div className="p-3 rounded-lg border border-slate-100 bg-slate-50">
                  <div className="text-[10px] uppercase font-semibold text-slate-400">Duty Leave</div>
                  <div className="text-xl font-bold font-mono text-teal-700 mt-1">13 / 15</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Academic events</div>
                </div>
                <div className="p-3 rounded-lg border border-slate-100 bg-slate-50">
                  <div className="text-[10px] uppercase font-semibold text-slate-400">Earned Leave</div>
                  <div className="text-xl font-bold font-mono text-slate-900 mt-1">24</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Accrued balance</div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong>Governance Rule:</strong> Staff leave requests are evaluated and sanctioned by the Office of the Vice Chancellor / Registrar. Faculty members cannot approve their own leave.
                </div>
              </div>
            </div>
          </div>

          {/* Staff Gazetted Credentials & Documents */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Official Faculty Credentials & University Documents
                </h3>
                <p className="text-xs text-slate-500">Government gazette notifications and Ph.D. degree credentials</p>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {initialStaffDocuments.map((doc) => (
                <div key={doc.id} className="p-4 flex items-center justify-between hover:bg-slate-50/60 transition-colors">
                  <div className="flex items-center gap-3">
                    <FileCheck className="w-5 h-5 text-teal-600 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-slate-900">{doc.name}</div>
                      <div className="text-[11px] font-mono text-slate-500">
                        {doc.type} · {doc.fileSize} · Date: {doc.date}
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified in University Archives
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Staff Display, Background & Device Preferences */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <div className="text-[11px] font-semibold text-teal-700 tracking-wide uppercase">
                  Staff Workspace Ergonomics
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  Background Theme & Device Viewport Preferences
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                Active: <strong className="text-slate-800 capitalize">{themePreference} Theme</strong> · <strong className="text-slate-800 capitalize">{devicePreference} View</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {/* Theme Preference Box */}
              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Sun className="w-4 h-4 text-amber-500" />
                    Background Theme
                  </span>
                  <span className="text-[10px] uppercase font-mono text-slate-400">Canvas</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Select between daytime academic white canvas and deep midnight slate.
                </p>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => onToggleTheme && onToggleTheme('light')}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      themePreference === 'light'
                        ? 'bg-white border-teal-500 shadow-xs ring-1 ring-teal-500'
                        : 'bg-white/80 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">Light Theme</span>
                      {themePreference === 'light' && <Check className="w-3.5 h-3.5 text-teal-600" />}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Daytime clean slate</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => onToggleTheme && onToggleTheme('dark')}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      themePreference === 'dark'
                        ? 'bg-slate-900 border-teal-500 text-white shadow-xs ring-1 ring-teal-500'
                        : 'bg-slate-900/90 border-slate-700 text-slate-200 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold">Dark Theme</span>
                      {themePreference === 'dark' && <Check className="w-3.5 h-3.5 text-teal-400" />}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Night slate canvas</div>
                  </button>
                </div>
              </div>

              {/* Device Preference Box */}
              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Monitor className="w-4 h-4 text-teal-600" />
                    Device Viewport Mode
                  </span>
                  <span className="text-[10px] uppercase font-mono text-slate-400">Layout</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Preview interface across simulated hardware frames or fluid auto responsiveness.
                </p>

                <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px]">
                  {[
                    { id: 'responsive', label: 'Auto Fluid', icon: Monitor },
                    { id: 'desktop', label: 'Desktop (1360px)', icon: Laptop },
                    { id: 'tablet', label: 'Tablet (820px)', icon: Tablet },
                    { id: 'mobile', label: 'Phone (420px)', icon: Smartphone },
                  ].map((d) => {
                    const DIcon = d.icon;
                    const isSelected = devicePreference === d.id;
                    return (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => onChangeDevicePreference && onChangeDevicePreference(d.id as DevicePreference)}
                        className={`p-2 rounded-lg border flex items-center gap-2 transition-all ${
                          isSelected
                            ? 'bg-white border-teal-500 text-teal-900 font-bold shadow-xs'
                            : 'bg-white/80 border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <DIcon className={`w-3.5 h-3.5 ${isSelected ? 'text-teal-600' : 'text-slate-400'}`} />
                        <span className="truncate">{d.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Layout Density Box */}
              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-blue-600" />
                    Information Density
                  </span>
                  <span className="text-[10px] uppercase font-mono text-slate-400">Scale</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Adjust spacing for grade sheets, biometric registers, and student rosters.
                </p>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => onChangeDensityPreference && onChangeDensityPreference('comfortable')}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      densityPreference === 'comfortable'
                        ? 'bg-white border-teal-500 shadow-xs ring-1 ring-teal-500'
                        : 'bg-white/80 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">Comfortable</span>
                      {densityPreference === 'comfortable' && <Check className="w-3.5 h-3.5 text-teal-600" />}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Standard spacing</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => onChangeDensityPreference && onChangeDensityPreference('compact')}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      densityPreference === 'compact'
                        ? 'bg-white border-teal-500 shadow-xs ring-1 ring-teal-500'
                        : 'bg-white/80 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">Compact</span>
                      {densityPreference === 'compact' && <Check className="w-3.5 h-3.5 text-teal-600" />}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">High roster density</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: My Teaching Schedule */}
      {activeTab === 'schedule' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Weekly Teaching & Laboratory Schedule
              </h3>
              <p className="text-xs text-slate-500">
                Direct schedule allocation for {admin.name} ({admin.designation})
              </p>
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs">
              {(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as StaffTimetableSlot['day'][]).map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDay(d)}
                  className={`px-3 py-1 rounded-md font-medium transition-colors ${
                    selectedDay === d
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {d.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {timetable.filter((t) => t.day === selectedDay).length > 0 ? (
              timetable
                .filter((t) => t.day === selectedDay)
                .map((slot) => (
                  <div
                    key={slot.id}
                    className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-200 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-teal-500/15 border border-teal-400/30 flex items-center justify-center text-teal-800 font-bold text-xs shrink-0">
                        {slot.type.slice(0, 4)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-teal-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                            {slot.courseCode}
                          </span>
                          <span className="text-xs font-bold text-slate-900">
                            {slot.courseName}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                          <span>{slot.time}</span>
                          <span>·</span>
                          <span>Room: <strong className="text-slate-700">{slot.room}</strong></span>
                          <span>·</span>
                          <span>Batch: <strong className="text-slate-700">{slot.batch}</strong></span>
                        </div>
                      </div>
                    </div>

                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 self-start sm:self-auto">
                      Assigned Instructor
                    </span>
                  </div>
                ))
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">
                No teaching sessions scheduled for {selectedDay}. Dedicated to office hours and committee duties.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Staff Leave Applications */}
      {activeTab === 'leaves' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong>University Governance Policy:</strong> Staff Casual Leave, Duty Leave, and Earned Leave are submitted to the Vice Chancellor / Registrar's Executive Council. Faculty members cannot evaluate or sanction their own applications.
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  My Submitted Staff Leave Applications
                </h3>
                <p className="text-xs text-slate-500">Track sanctions from university registrar and executive council</p>
              </div>
              <button
                onClick={() => setShowApplyModal(true)}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors shadow-xs flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Apply Leave
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Application ID</th>
                    <th className="py-3 px-4">Leave Type</th>
                    <th className="py-3 px-4">Duration & Dates</th>
                    <th className="py-3 px-4">Reason & Academic Duty</th>
                    <th className="py-3 px-4">Class Handover Colleague</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {staffLeaves.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {l.id}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        {l.leaveType}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-700">
                        {l.startDate} to {l.endDate} ({l.totalDays} day{l.totalDays > 1 ? 's' : ''})
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 max-w-xs">
                        {l.reason}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium">
                        {l.handoverFaculty}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {l.status === 'Approved' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded font-semibold text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Approved ({l.approvedBy})
                          </span>
                        ) : l.status === 'Pending' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded font-semibold text-[11px] bg-amber-50 text-amber-800 border border-amber-200">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            Pending Review ({l.approvedBy})
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded font-semibold text-[11px] bg-rose-50 text-rose-800 border border-rose-200">
                            <XCircle className="w-3.5 h-3.5 text-rose-600" />
                            Rejected
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Staff Bulletins & Events */}
      {activeTab === 'bulletins' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Staff Relevant Notices */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <FileText className="w-4 h-4 text-teal-700" />
                <h3 className="text-sm font-bold text-slate-900">
                  Staff & Administrative Circulars
                </h3>
              </div>

              <div className="space-y-3">
                {notices.slice(0, 4).map((n) => (
                  <div
                    key={n.id}
                    className="p-3 rounded-lg border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors space-y-1"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                        {n.department}
                      </span>
                      <span className="text-slate-400 font-mono">{n.date}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 mt-1">{n.title}</h4>
                    <p className="text-[11px] text-slate-600 line-clamp-2">{n.content}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Staff & Academic Events */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Calendar className="w-4 h-4 text-teal-700" />
                <h3 className="text-sm font-bold text-slate-900">
                  Faculty Development & Academic Events
                </h3>
              </div>

              <div className="space-y-3">
                {events.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-3 rounded-lg border border-slate-100 bg-slate-50/70 space-y-1"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-slate-700">
                        {evt.category}
                      </span>
                      <span className="text-slate-400 font-mono">{evt.date}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900">{evt.title}</h4>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2">
                      <span>Venue: {evt.venue}</span>
                      <span>·</span>
                      <span>{evt.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Apply Staff Leave Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-mono text-teal-700 font-bold uppercase">
                  BPUT Faculty Service Form
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  Apply for Staff Leave / Deputation
                </h3>
              </div>
              <button
                onClick={() => setShowApplyModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleLeaveSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Leave Category *</label>
                  <select
                    value={leaveType}
                    onChange={(e) => setLeaveType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-medium"
                  >
                    <option value="Casual Leave (CL)">Casual Leave (CL)</option>
                    <option value="Duty Leave (DL)">Duty Leave (DL - NBA/Conference/Thesis)</option>
                    <option value="Earned Leave (EL)">Earned Leave (EL)</option>
                    <option value="Medical Leave">Medical Leave</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Colleague Taking Classes *</label>
                  <input
                    type="text"
                    required
                    value={handoverFaculty}
                    onChange={(e) => setHandoverFaculty(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">End Date *</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Detailed Reason & Academic Duty *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="State the purpose (e.g. Conference keynote, external Ph.D. viva voce, family function)..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800"
                />
              </div>

              {formSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Staff leave requisition dispatched to Registrar Office for sanction.
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
                  Submit to Registrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
