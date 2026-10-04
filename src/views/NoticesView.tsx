import React, { useState } from 'react';
import {
  Bell,
  Search,
  Filter,
  AlertCircle,
  Download,
  Calendar,
  Building2,
  X,
  FileText,
  Pin,
  Plus,
  Edit3,
  Send,
  CheckCircle2,
} from 'lucide-react';
import { Notice, UserRole } from '../types';

interface NoticesViewProps {
  notices: Notice[];
  userRole?: UserRole;
  onPublishNotice?: (notice: Omit<Notice, 'id'>) => void;
  onUpdateNotice?: (id: string, updated: Partial<Notice>) => void;
}

export const NoticesView: React.FC<NoticesViewProps> = ({
  notices,
  userRole = 'student',
  onPublishNotice,
  onUpdateNotice,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeNoticeModal, setActiveNoticeModal] = useState<Notice | null>(null);
  const [showPublishModal, setShowPublishModal] = useState<boolean>(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);

  // New notice form states
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<Notice['category']>('Academic');
  const [newAudience, setNewAudience] = useState<NonNullable<Notice['audience']>>('All Students');
  const [newDept, setNewDept] = useState('Office of the Dean & Examination Cell');
  const [newIsUrgent, setNewIsUrgent] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [newSignedBy, setNewSignedBy] = useState('Dr. Sanghamitra Mohanty (Dean Academic Affairs)');
  const [newAttachment, setNewAttachment] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  // Edit form states
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState<Notice['category']>('Academic');
  const [editDept, setEditDept] = useState('');
  const [editIsUrgent, setEditIsUrgent] = useState(false);
  const [editContent, setEditContent] = useState('');

  const categories = ['All', 'Academic', 'Exams', 'Placement', 'Hostels', 'Administrative'];

  const filteredNotices = notices.filter((n) => {
    if (selectedCategory !== 'All' && n.category !== selectedCategory) return false;
    if (
      searchQuery &&
      !n.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !n.department.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !n.content.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const handlePublishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onPublishNotice) return;
    onPublishNotice({
      title: newTitle,
      category: newCategory,
      audience: newAudience,
      date: new Date().toISOString().split('T')[0],
      department: newDept,
      isUrgent: newIsUrgent,
      content: newContent,
      signedBy: newSignedBy,
      attachmentName: newAttachment.trim() || undefined,
    });
    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      setShowPublishModal(false);
      setNewTitle('');
      setNewContent('');
      setNewAttachment('');
    }, 700);
  };

  const handleStartEdit = (n: Notice) => {
    setEditingNotice(n);
    setEditTitle(n.title);
    setEditCategory(n.category);
    setEditDept(n.department);
    setEditIsUrgent(n.isUrgent);
    setEditContent(n.content);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNotice || !onUpdateNotice) return;
    onUpdateNotice(editingNotice.id, {
      title: editTitle,
      category: editCategory,
      department: editDept,
      isUrgent: editIsUrgent,
      content: editContent,
    });
    setEditingNotice(null);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-teal-700 tracking-wide uppercase">
            Official University Bulletin Board
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            {userRole === 'admin' ? 'Publish & Manage Campus Notices' : 'Notices & Administrative Circulars'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {userRole === 'admin'
              ? 'Draft and publish official university notices, circulars, and urgent campus alerts.'
              : 'Published under the authority of Biju Patnaik University of Technology, Odisha.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {userRole === 'admin' && (
            <button
              onClick={() => setShowPublishModal(true)}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Publish Campus Notice
            </button>
          )}
          <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold font-mono">
            {notices.length} Active Circulars
          </span>
        </div>
      </div>

      {/* 2. Filters & Search */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                selectedCategory === cat
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search circulars..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* 3. Notices List */}
      <div className="space-y-3">
        {filteredNotices.map((n) => (
          <div
            key={n.id}
            onClick={() => setActiveNoticeModal(n)}
            className={`bg-white border rounded-xl p-5 shadow-xs hover:border-slate-300 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 ${
              n.isUrgent ? 'border-l-4 border-l-rose-500 border-slate-200' : 'border-slate-200'
            }`}
          >
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-mono text-slate-500">
                  {n.date}
                </span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
                  {n.category}
                </span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="text-[11px] font-medium text-slate-600">
                  {n.department}
                </span>
                {n.isUrgent && (
                  <span className="text-[11px] px-2 py-0.5 rounded font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                    <Pin className="w-3 h-3 text-rose-600" />
                    Pinned Urgent
                  </span>
                )}
              </div>

              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                {n.title}
              </h3>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {n.content}
              </p>

              <div className="text-[11px] text-slate-400 pt-1 flex items-center gap-3">
                <span>Signed by: {n.signedBy}</span>
                {n.attachmentName && (
                  <span className="text-teal-700 font-medium flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    {n.attachmentName}
                  </span>
                )}
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              {userRole === 'admin' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartEdit(n);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                  Edit
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveNoticeModal(n);
                }}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors"
              >
                Read Notice
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 4. Publish Notice Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-mono text-teal-700 font-bold uppercase">
                  BPUT Administration Portal
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  Publish Official Campus Circular
                </h3>
              </div>
              <button
                onClick={() => setShowPublishModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePublishSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Notice Headline / Subject *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule of 6th Semester Mid-Term Examinations..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Category *</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-medium"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Exams">Exams</option>
                    <option value="Placement">Placement</option>
                    <option value="Hostels">Hostels</option>
                    <option value="Administrative">Administrative</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Issuing Department *</label>
                  <input
                    type="text"
                    required
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Target Audience *</label>
                  <select
                    value={newAudience}
                    onChange={(e) => setNewAudience(e.target.value as NonNullable<Notice['audience']>)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800"
                  >
                    <option value="All Students">All Students</option>
                    <option value="CSE Students">CSE Students</option>
                    <option value="Hostel Residents">Hostel Residents</option>
                    <option value="Staff">Staff</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Notice Body & Details *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Official notification text, instructions, and dates..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800 leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Signatory Authority *</label>
                  <input
                    type="text"
                    required
                    value={newSignedBy}
                    onChange={(e) => setNewSignedBy(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Attachment File Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Schedule_Routine_2026.pdf"
                    value={newAttachment}
                    onChange={(e) => setNewAttachment(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200">
                <input
                  type="checkbox"
                  id="urgentNotice"
                  checked={newIsUrgent}
                  onChange={(e) => setNewIsUrgent(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                />
                <label htmlFor="urgentNotice" className="text-slate-800 font-semibold cursor-pointer">
                  Pin as Urgent Notification (Show with red highlight flag)
                </label>
              </div>

              {formSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Notice published successfully to campus bulletin board.
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPublishModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700 font-semibold flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Publish Circular
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Edit Notice Modal */}
      {editingNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-mono text-teal-700 font-bold uppercase">
                  Edit Circular · {editingNotice.id}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  Update Published Notice
                </h3>
              </div>
              <button
                onClick={() => setEditingNotice(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Notice Headline</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Category</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-medium"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Exams">Exams</option>
                    <option value="Placement">Placement</option>
                    <option value="Hostels">Hostels</option>
                    <option value="Administrative">Administrative</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Department</label>
                  <input
                    type="text"
                    required
                    value={editDept}
                    onChange={(e) => setEditDept(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Notice Content</label>
                <textarea
                  rows={4}
                  required
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800 leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200">
                <input
                  type="checkbox"
                  id="editUrgentNotice"
                  checked={editIsUrgent}
                  onChange={(e) => setEditIsUrgent(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                />
                <label htmlFor="editUrgentNotice" className="text-slate-800 font-semibold cursor-pointer">
                  Pin as Urgent Notification
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingNotice(null)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700 font-semibold flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Notice Reader Dialog */}
      {activeNoticeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xl max-w-xl w-full p-6 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-teal-700 font-bold uppercase">
                    {activeNoticeModal.department}
                  </span>
                  {activeNoticeModal.isUrgent && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 font-bold border border-rose-200">
                      URGENT NOTIFICATION
                    </span>
                  )}
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {activeNoticeModal.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveNoticeModal(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-slate-500 flex items-center justify-between border-b border-slate-100 pb-2">
              <span>Date of Notification: <strong>{activeNoticeModal.date}</strong></span>
              <span>Circular Ref: <strong>BPUT/NOTIF/2026/{activeNoticeModal.id}</strong></span>
            </div>

            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3 py-1">
              <p>{activeNoticeModal.content}</p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-2">
              <div className="text-slate-500">Signatory Authority:</div>
              <div className="font-bold text-slate-900">{activeNoticeModal.signedBy}</div>
              <div className="text-slate-500">Biju Patnaik University of Technology, Rourkela, Odisha</div>

              {activeNoticeModal.attachmentName && (
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <span className="font-mono text-teal-700 font-semibold flex items-center gap-1.5">
                    <FileText className="w-4 h-4" />
                    {activeNoticeModal.attachmentName}
                  </span>
                  <button
                    onClick={() => alert(`Simulated download of ${activeNoticeModal.attachmentName}`)}
                    className="text-xs font-semibold text-slate-800 hover:text-teal-700 flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download PDF
                  </button>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveNoticeModal(null)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800"
              >
                Close Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
