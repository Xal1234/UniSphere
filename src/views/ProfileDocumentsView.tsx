import React, { useState } from 'react';
import {
  UserCircle,
  FileText,
  Upload,
  CheckCircle2,
  Clock,
  AlertCircle,
  ShieldCheck,
  Building,
  User,
  Phone,
  Mail,
  Heart,
  X,
  FileCheck,
  Sun,
  Moon,
  Monitor,
  Laptop,
  Tablet,
  Smartphone,
  Sliders,
  Check,
} from 'lucide-react';
import { StudentProfile, AdminProfile, StudentDocument, UserRole, ThemePreference, DevicePreference, DensityPreference } from '../types';

interface ProfileDocumentsViewProps {
  student: StudentProfile;
  admin: AdminProfile;
  documents: StudentDocument[];
  userRole: UserRole;
  onUploadDocument: (name: string) => void;
  themePreference?: ThemePreference;
  onToggleTheme?: (theme: ThemePreference) => void;
  devicePreference?: DevicePreference;
  onChangeDevicePreference?: (device: DevicePreference) => void;
  densityPreference?: DensityPreference;
  onChangeDensityPreference?: (density: DensityPreference) => void;
}

export const ProfileDocumentsView: React.FC<ProfileDocumentsViewProps> = ({
  student,
  admin,
  documents,
  userRole,
  onUploadDocument,
  themePreference = 'light',
  onToggleTheme,
  devicePreference = 'responsive',
  onChangeDevicePreference,
  densityPreference = 'comfortable',
  onChangeDensityPreference,
}) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newDocName, setNewDocName] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName.trim()) return;
    onUploadDocument(newDocName.trim());
    setUploadSuccess(true);
    setTimeout(() => {
      setUploadSuccess(false);
      setShowUploadModal(false);
      setNewDocName('');
    }, 700);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-teal-700 tracking-wide uppercase">
            BPUT Student Identity & Document Vault
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            {userRole === 'student' ? student.name : admin.name}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {userRole === 'student'
              ? `Reg No: ${student.regNo} · ${student.branch} · Batch ${student.batch}`
              : `${admin.designation} · ${admin.department}`}
          </p>
        </div>

        {userRole === 'student' && (
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors shadow-xs flex items-center gap-1.5 self-start md:self-auto"
          >
            <Upload className="w-4 h-4" />
            Upload New Document
          </button>
        )}
      </div>

      {/* 2. Profile Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Academic & University Particulars */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <UserCircle className="w-4 h-4 text-teal-700" />
            <h3 className="text-sm font-bold text-slate-900">
              Academic & University Records
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Full Name</span>
              <span className="font-bold text-slate-900">{student.name}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">University Reg. No</span>
              <span className="font-mono font-bold text-slate-900">{student.regNo}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Class Roll Number</span>
              <span className="font-mono text-slate-800">{student.rollNo}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Degree Program</span>
              <span className="text-slate-800 font-semibold">{student.course}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Branch & Dept</span>
              <span className="text-slate-800 font-semibold">{student.branch}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Current Semester</span>
              <span className="text-slate-800">{student.semester}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Faculty Advisor</span>
              <span className="text-teal-700 font-medium">{student.advisor}</span>
            </div>
          </div>
        </div>

        {/* Contact, Hostel & Emergency Particulars */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Building className="w-4 h-4 text-teal-700" />
            <h3 className="text-sm font-bold text-slate-900">
              Campus Residence & Guardian Contact
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">University Email</span>
              <span className="font-mono text-slate-800">{student.email}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Student Phone</span>
              <span className="font-mono text-slate-800">{student.phone}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Hall of Residence</span>
              <span className="font-semibold text-slate-900">{student.hostel}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Room Number</span>
              <span className="text-slate-800">{student.roomNo}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Hostel Superintendent</span>
              <span className="text-slate-800">{student.wardenName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Parent / Guardian</span>
              <span className="text-slate-800 font-medium">{student.guardianName} ({student.guardianPhone})</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Blood Group</span>
              <span className="font-mono font-bold text-rose-700">{student.bloodGroup}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Portal Appearance, Background & Device Preferences */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <div className="text-[11px] font-semibold text-teal-700 tracking-wide uppercase">
              User Experience Customization
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
              Adjust spacing for data tables, student lists, grade cards, and schedules.
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
                <div className="text-[10px] text-slate-400 mt-0.5">Generous spacing</div>
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
                <div className="text-[10px] text-slate-400 mt-0.5">High information density</div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Document Vault & Checklist */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Verified Academic Document Vault
            </h3>
            <p className="text-xs text-slate-500">Certificates verified by BPUT Academic Section & Registrar</p>
          </div>
          <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
            {documents.filter((d) => d.status === 'Verified').length} of {documents.length} Verified
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Document Title</th>
                <th className="py-3 px-4">Type & Size</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4">Verification Remarks</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-teal-700 shrink-0" />
                    <span>{doc.name}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-500">
                    {doc.type} · {doc.fileSize}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold ${
                        doc.status === 'Verified'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {doc.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {doc.remarks || `Verified on ${doc.verifiedOn || 'Enrollment'}`}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => alert(`Opening preview of verified certificate: ${doc.name}`)}
                      className="text-xs font-semibold text-teal-700 hover:text-teal-800 hover:underline"
                    >
                      View Certificate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Upload Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-mono text-teal-700 font-bold uppercase">
                  BPUT Digital Locker
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  Upload Student Document
                </h3>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Document Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Income Certificate / Gap Certificate / Medical Fitness"
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Choose File (PDF/JPG) *</label>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center bg-slate-50 hover:bg-slate-100/50 transition-colors">
                  <Upload className="w-6 h-6 text-teal-600 mx-auto mb-1" />
                  <div className="text-slate-800 font-semibold">Select PDF Document</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Maximum file size 10MB</div>
                </div>
              </div>

              {uploadSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Document uploaded and submitted for academic office verification!
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700 font-semibold flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Upload Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
