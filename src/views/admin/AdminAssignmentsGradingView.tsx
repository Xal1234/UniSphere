import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Award,
  CheckCircle2,
  Clock,
  Filter,
  X,
  Send,
  Upload,
  FileText,
  Search,
  Check,
} from 'lucide-react';
import { Assignment, FacultyCourse } from '../../types';

interface AdminAssignmentsGradingViewProps {
  assignments: Assignment[];
  courses: FacultyCourse[];
  onCreateAssignment: (newAsn: Omit<Assignment, 'id' | 'status' | 'submittedDate' | 'marksObtained' | 'feedback' | 'submissionNote'>) => void;
  onGradeAssignment: (assignmentId: string, marks: number, feedback: string) => void;
  openCreateModalDirectly?: boolean;
}

export const AdminAssignmentsGradingView: React.FC<AdminAssignmentsGradingViewProps> = ({
  assignments,
  courses,
  onCreateAssignment,
  onGradeAssignment,
  openCreateModalDirectly = false,
}) => {
  const [showCreateModal, setShowCreateModal] = useState<boolean>(openCreateModalDirectly);
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');
  const [gradingModalAsn, setGradingModalAsn] = useState<Assignment | null>(null);

  // New assignment form fields
  const [courseCode, setCourseCode] = useState<string>(courses[0]?.code || 'RCS6C001');
  const [asnTitle, setAsnTitle] = useState<string>('');
  const [asnDesc, setAsnDesc] = useState<string>('');
  const [asnDueDate, setAsnDueDate] = useState<string>('2026-10-18');
  const [asnMaxMarks, setAsnMaxMarks] = useState<number>(20);
  const [formSuccess, setFormSuccess] = useState<boolean>(false);

  // Grading form fields
  const [evalMarks, setEvalMarks] = useState<number>(18);
  const [evalFeedback, setEvalFeedback] = useState<string>('');

  const filteredAssignments = assignments.filter((a) => {
    if (selectedCourseFilter !== 'All' && a.courseCode !== selectedCourseFilter) return false;
    if (selectedStatusFilter !== 'All' && a.status !== selectedStatusFilter) return false;
    return true;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const courseObj = courses.find((c) => c.code === courseCode);
    onCreateAssignment({
      courseCode,
      courseName: courseObj ? courseObj.name : 'Computer Science Subject',
      title: asnTitle,
      description: asnDesc,
      faculty: 'Dr. Sanghamitra Mohanty',
      dueDate: asnDueDate,
      maxMarks: Number(asnMaxMarks),
    });
    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      setShowCreateModal(false);
      setAsnTitle('');
      setAsnDesc('');
    }, 700);
  };

  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingModalAsn) return;
    onGradeAssignment(gradingModalAsn.id, Number(evalMarks), evalFeedback);
    setGradingModalAsn(null);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-teal-700 tracking-wide uppercase">
            Continuous Internal Assessment (CIE) Faculty Console
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            Assignment Authoring & Student Grading
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Publish coursework questions, monitor submission counts, and record continuous internal assessment marks.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors shadow-xs flex items-center gap-1.5 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          Create New Course Assignment
        </button>
      </div>

      {/* 2. Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            {['All', 'Submitted', 'Pending', 'Evaluated'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatusFilter(st)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  selectedStatusFilter === st
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Course Filter */}
          <select
            value={selectedCourseFilter}
            onChange={(e) => setSelectedCourseFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-xs text-slate-800 font-medium ml-2"
          >
            <option value="All">All Courses</option>
            {courses.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code}
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-slate-500">
          Showing <span className="font-semibold text-slate-800">{filteredAssignments.length}</span> assignments
        </div>
      </div>

      {/* 3. Assignment Roster & Submissions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAssignments.map((asn) => {
          const isEvaluated = asn.status === 'Evaluated';
          const isSubmitted = asn.status === 'Submitted';

          return (
            <div
              key={asn.id}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-mono font-bold text-teal-700">
                      {asn.courseCode} · {asn.courseName}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-0.5">{asn.title}</h3>
                  </div>

                  {isEvaluated ? (
                    <span className="text-[11px] px-2.5 py-0.5 rounded font-semibold bg-blue-50 text-blue-800 border border-blue-200 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-blue-600" />
                      Graded ({asn.marksObtained}/{asn.maxMarks})
                    </span>
                  ) : isSubmitted ? (
                    <span className="text-[11px] px-2.5 py-0.5 rounded font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Ready to Grade
                    </span>
                  ) : (
                    <span className="text-[11px] px-2.5 py-0.5 rounded font-semibold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      Awaiting Submissions
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {asn.description}
                </p>

                <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <span>Due Date: <strong className="font-mono text-slate-800">{asn.dueDate}</strong></span>
                  <span className="font-mono">Max: {asn.maxMarks} Marks</span>
                </div>

                {/* If submitted or evaluated */}
                {(isSubmitted || isEvaluated) && (
                  <div className="p-3 rounded-lg border border-slate-100 bg-slate-50 text-xs space-y-1">
                    <div className="font-semibold text-slate-800 flex justify-between">
                      <span>Submitted Solution:</span>
                      <span className="font-mono text-teal-700">Rahul_Pattnaik_Assignment.pdf</span>
                    </div>
                    {asn.submissionNote && (
                      <p className="text-slate-500 text-[11px] italic">"{asn.submissionNote}"</p>
                    )}
                    {isEvaluated && (
                      <div className="pt-1.5 border-t border-slate-200 text-blue-900 font-semibold flex justify-between">
                        <span>Faculty Score:</span>
                        <span>{asn.marksObtained} / {asn.maxMarks} Marks</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">
                  Faculty: {asn.faculty}
                </span>

                <button
                  onClick={() => {
                    setGradingModalAsn(asn);
                    setEvalMarks(asn.marksObtained || Math.floor(asn.maxMarks * 0.85));
                    setEvalFeedback(asn.feedback || 'Well-structured solutions with clear algorithmic complexity analysis.');
                  }}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5"
                >
                  <Award className="w-3.5 h-3.5" />
                  {isEvaluated ? 'Edit Marks & Feedback' : 'Grade Submission'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Create New Assignment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-mono text-teal-700 font-bold uppercase">
                  Continuous Evaluation Assignment Authoring
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  Publish New Course Assignment
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
                  <label className="block text-slate-700 font-semibold mb-1">Target Course *</label>
                  <select
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-medium"
                  >
                    {courses.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code} - {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Due Date *</label>
                  <input
                    type="date"
                    required
                    value={asnDueDate}
                    onChange={(e) => setAsnDueDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Assignment Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Assignment 5: B+ Tree Indexing & Transaction Concurrency"
                  value={asnTitle}
                  onChange={(e) => setAsnTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Problem Statement & Instructions *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="State the questions, expected implementation, code zip requirements, and evaluation rubric..."
                  value={asnDesc}
                  onChange={(e) => setAsnDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Maximum Marks (Internal Weightage) *</label>
                <input
                  type="number"
                  min="5"
                  max="100"
                  required
                  value={asnMaxMarks}
                  onChange={(e) => setAsnMaxMarks(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-mono font-bold"
                />
              </div>

              {formSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Assignment published! Now visible in student coursework deadlines.
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
                  Publish to Students
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Grade Student Submission Modal */}
      {gradingModalAsn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-mono text-teal-700 font-bold uppercase">
                  Faculty Grading Console
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  Evaluate: {gradingModalAsn.title}
                </h3>
              </div>
              <button
                onClick={() => setGradingModalAsn(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Course Code:</span>
                <span className="font-mono font-bold text-slate-800">{gradingModalAsn.courseCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Student File:</span>
                <span className="font-mono text-teal-700 font-semibold">Rahul_Pattnaik_Assignment.pdf</span>
              </div>
              {gradingModalAsn.submissionNote && (
                <div className="text-slate-600 text-[11px] italic">
                  Note: "{gradingModalAsn.submissionNote}"
                </div>
              )}
            </div>

            <form onSubmit={handleGradeSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Marks Awarded (Max: {gradingModalAsn.maxMarks}) *
                </label>
                <input
                  type="number"
                  min="0"
                  max={gradingModalAsn.maxMarks}
                  required
                  value={evalMarks}
                  onChange={(e) => setEvalMarks(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono font-bold text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Instructor Evaluator Feedback & Corrective Notes *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide feedback on algorithm complexity, schema normalization, and query performance..."
                  value={evalFeedback}
                  onChange={(e) => setEvalFeedback(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setGradingModalAsn(null)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700 font-semibold flex items-center gap-1.5"
                >
                  <Award className="w-3.5 h-3.5" />
                  Save & Publish Grade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
