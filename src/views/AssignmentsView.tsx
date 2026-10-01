import React, { useState } from 'react';
import {
  BookOpen,
  Filter,
  CheckCircle2,
  Clock,
  Award,
  Upload,
  FileCheck,
  X,
  Send,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { Assignment, UserRole } from '../types';

interface AssignmentsViewProps {
  assignments: Assignment[];
  userRole: UserRole;
  onSubmitAssignment: (id: string, note?: string) => void;
  onGradeAssignment?: (id: string, marks: number, feedback: string) => void;
  initialSubmitId?: string | null;
}

export const AssignmentsView: React.FC<AssignmentsViewProps> = ({
  assignments,
  userRole,
  onSubmitAssignment,
  onGradeAssignment,
  initialSubmitId,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<'All' | 'Pending' | 'Submitted' | 'Evaluated'>('All');
  const [selectedCourse, setSelectedCourse] = useState<string>('All');
  const [activeSubmitModalId, setActiveSubmitModalId] = useState<string | null>(initialSubmitId || null);
  const [activeGradeModalId, setActiveGradeModalId] = useState<string | null>(null);

  // Submit form state
  const [submissionFile, setSubmissionFile] = useState('Rahul_Pattnaik_Assignment.pdf');
  const [submissionNote, setSubmissionNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Grade form state
  const [awardedMarks, setAwardedMarks] = useState<number>(18);
  const [gradeFeedback, setGradeFeedback] = useState('Good structural approach and rigorous query formulation.');

  const coursesList = Array.from(new Set(assignments.map((a) => a.courseCode)));

  const filteredAssignments = assignments.filter((a) => {
    if (selectedStatus !== 'All' && a.status !== selectedStatus) return false;
    if (selectedCourse !== 'All' && a.courseCode !== selectedCourse) return false;
    return true;
  });

  const handlePerformSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSubmitModalId) return;
    setIsSubmitting(true);
    setTimeout(() => {
      onSubmitAssignment(activeSubmitModalId, submissionNote || 'Uploaded final solutions PDF');
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setActiveSubmitModalId(null);
        setSubmissionNote('');
      }, 700);
    }, 500);
  };

  const handlePerformGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeGradeModalId || !onGradeAssignment) return;
    onGradeAssignment(activeGradeModalId, Number(awardedMarks), gradeFeedback);
    setActiveGradeModalId(null);
  };

  const targetSubmitAssignment = assignments.find((a) => a.id === activeSubmitModalId);
  const targetGradeAssignment = assignments.find((a) => a.id === activeGradeModalId);

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-teal-700 tracking-wide uppercase">
            Coursework & Laboratory Submissions
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            Continuous Internal Evaluation (CIE)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Internal assessments contribute 30% weightage toward BPUT semester grade sheets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-600">
            Pending: <strong className="text-amber-600 font-mono">{assignments.filter((a) => a.status === 'Pending').length}</strong> | 
            Graded: <strong className="text-blue-600 font-mono">{assignments.filter((a) => a.status === 'Evaluated').length}</strong>
          </div>
        </div>
      </div>

      {/* 2. Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Status filter tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            {(['All', 'Pending', 'Submitted', 'Evaluated'] as const).map((st) => (
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

          {/* Course dropdown */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 ml-2">
            <Filter className="w-3.5 h-3.5" />
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1 text-xs text-slate-800 font-medium focus:ring-1 focus:ring-teal-500"
            >
              <option value="All">All Courses</option>
              {coursesList.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-500">
          Showing <span className="font-semibold text-slate-800">{filteredAssignments.length}</span> assignments
        </div>
      </div>

      {/* 3. Assignment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAssignments.map((asn) => {
          const isPending = asn.status === 'Pending';
          const isSubmitted = asn.status === 'Submitted';
          const isEvaluated = asn.status === 'Evaluated';

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
                    <h3 className="text-sm font-bold text-slate-900 mt-1">
                      {asn.title}
                    </h3>
                  </div>

                  {isPending && (
                    <span className="text-[11px] px-2 py-0.5 rounded font-semibold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1 shrink-0">
                      <Clock className="w-3 h-3 text-amber-600" /> Pending
                    </span>
                  )}
                  {isSubmitted && (
                    <span className="text-[11px] px-2 py-0.5 rounded font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1 shrink-0">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Submitted
                    </span>
                  )}
                  {isEvaluated && (
                    <span className="text-[11px] px-2 py-0.5 rounded font-semibold bg-blue-50 text-blue-800 border border-blue-200 flex items-center gap-1 shrink-0">
                      <Award className="w-3 h-3 text-blue-600" /> Evaluated
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {asn.description}
                </p>

                <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <span>Instructor: <strong className="text-slate-700">{asn.faculty}</strong></span>
                  <span className="font-mono text-slate-700 font-semibold">
                    Due: {asn.dueDate}
                  </span>
                </div>

                {isEvaluated && (
                  <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-lg text-xs space-y-1">
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-blue-900">Score Awarded:</span>
                      <span className="text-blue-900 font-mono text-sm">
                        {asn.marksObtained} / {asn.maxMarks} Marks
                      </span>
                    </div>
                    {asn.feedback && (
                      <p className="text-blue-800 text-[11px] italic">
                        "{asn.feedback}"
                      </p>
                    )}
                  </div>
                )}

                {isSubmitted && !isEvaluated && (
                  <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-[11px] text-slate-600">
                    <div className="font-medium text-slate-800">
                      Submitted on {asn.submittedDate || 'Recently'}
                    </div>
                    {asn.submissionNote && (
                      <div className="text-slate-500 italic mt-0.5">Note: {asn.submissionNote}</div>
                    )}
                  </div>
                )}
              </div>

              {/* Action button */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono">
                  Weightage: {asn.maxMarks} Marks
                </span>

                {userRole === 'student' && isPending && (
                  <button
                    onClick={() => setActiveSubmitModalId(asn.id)}
                    className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors shadow-xs flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Submit Assignment
                  </button>
                )}

                {userRole === 'student' && isSubmitted && (
                  <button
                    onClick={() => setActiveSubmitModalId(asn.id)}
                    className="px-3 py-1 text-xs font-medium rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  >
                    Update Submission
                  </button>
                )}

                {userRole === 'admin' && (
                  <button
                    onClick={() => {
                      setActiveGradeModalId(asn.id);
                      setAwardedMarks(asn.marksObtained || Math.floor(asn.maxMarks * 0.85));
                    }}
                    className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5"
                  >
                    <Award className="w-3.5 h-3.5" />
                    {isEvaluated ? 'Update Marks' : 'Evaluate & Grade'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Student Submit Modal */}
      {targetSubmitAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-mono text-teal-700 font-bold uppercase">
                  {targetSubmitAssignment.courseCode} · Coursework Portal
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  Submit: {targetSubmitAssignment.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveSubmitModalId(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePerformSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Attach Solution File (PDF / ZIP / DOCX) *
                </label>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center bg-slate-50 hover:bg-slate-100/50 transition-colors">
                  <Upload className="w-6 h-6 text-teal-600 mx-auto mb-1" />
                  <div className="text-slate-800 font-semibold">{submissionFile}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Click to simulate selecting another file (Max size: 25MB)
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Submission Comments / GitHub Link (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Include repository link, test cases implemented, or any assumptions made..."
                  value={submissionNote}
                  onChange={(e) => setSubmissionNote(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:ring-1 focus:ring-teal-500"
                />
              </div>

              {submitSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Assignment submitted successfully to faculty portal!
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveSubmitModalId(null)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700 font-semibold flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  {isSubmitting ? 'Uploading...' : 'Confirm Submission'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Faculty / Admin Grade Modal */}
      {targetGradeAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-mono text-amber-700 font-bold uppercase">
                  Faculty Grading Console
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  Evaluate: {targetGradeAssignment.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveGradeModalId(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePerformGrade} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Marks Awarded (Max: {targetGradeAssignment.maxMarks}) *
                </label>
                <input
                  type="number"
                  min="0"
                  max={targetGradeAssignment.maxMarks}
                  required
                  value={awardedMarks}
                  onChange={(e) => setAwardedMarks(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono font-bold text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Evaluator Feedback & Corrective Notes
                </label>
                <textarea
                  rows={3}
                  value={gradeFeedback}
                  onChange={(e) => setGradeFeedback(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveGradeModalId(null)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 font-semibold flex items-center gap-1.5"
                >
                  <Award className="w-3.5 h-3.5" />
                  Save Grade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
