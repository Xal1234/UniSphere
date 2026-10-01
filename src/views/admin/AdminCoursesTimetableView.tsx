import React, { useState } from 'react';
import {
  BookOpen,
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  FileText,
  CalendarCheck,
  ChevronRight,
  X,
  Award,
} from 'lucide-react';
import { FacultyCourse, StaffTimetableSlot } from '../../types';

interface AdminCoursesTimetableViewProps {
  courses: FacultyCourse[];
  timetable: StaffTimetableSlot[];
  onTakeAttendanceForCourse?: (courseCode: string) => void;
}

export const AdminCoursesTimetableView: React.FC<AdminCoursesTimetableViewProps> = ({
  courses,
  timetable,
  onTakeAttendanceForCourse,
}) => {
  const [selectedDay, setSelectedDay] = useState<StaffTimetableSlot['day']>('Monday');
  const [selectedCourseDetail, setSelectedCourseDetail] = useState<FacultyCourse | null>(null);

  const days: StaffTimetableSlot['day'][] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const dailySchedule = timetable.filter((t) => t.day === selectedDay);

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-teal-700 tracking-wide uppercase">
            Faculty Teaching Portfolio & Academic Load
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            Courses & Instructional Timetable
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Teaching load: 14 Credit Hours/Week · Affiliated to School of Computer Science & Engineering
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold">
            Spring 2026 Session
          </span>
        </div>
      </div>

      {/* 2. Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {courses.map((c) => (
          <div
            key={c.code}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded border border-teal-100">
                  {c.code} · {c.credits} Credits
                </span>
                <span className="text-[11px] font-medium text-slate-500">{c.semester}</span>
              </div>

              <h3 className="text-sm font-bold text-slate-900">{c.name}</h3>

              <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>Enrolled: <strong>{c.enrolledCount} Students</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarCheck className="w-3.5 h-3.5 text-slate-400" />
                  <span>Delivered: <strong>{c.conductedClasses} Classes</strong> (Avg: {c.avgAttendance}%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>Room: <strong>{c.room}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-[11px]">{c.schedule}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setSelectedCourseDetail(c)}
                className="text-xs font-semibold text-teal-700 hover:underline"
              >
                Syllabus & Units
              </button>
              {onTakeAttendanceForCourse && (
                <button
                  onClick={() => onTakeAttendanceForCourse(c.code)}
                  className="px-3 py-1 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                >
                  Mark Class
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 3. Comprehensive Teaching Timetable */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Weekly Instructional & Senate Timetable
            </h3>
            <p className="text-xs text-slate-500">
              Schedule of theory classes, laboratory sessions, office consultation hours, and university committees
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            {days.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  selectedDay === day
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {dailySchedule.map((slot) => (
            <div
              key={slot.id}
              className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-4">
                <div className="w-28 shrink-0">
                  <div className="text-[10px] uppercase font-mono text-slate-400 font-semibold">Slot Time</div>
                  <div className="text-xs font-bold text-slate-800 font-mono mt-0.5">{slot.time}</div>
                </div>
                <div className="border-l border-slate-200 pl-4 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-teal-700">{slot.courseCode}</span>
                    <span className="text-sm font-bold text-slate-900">{slot.courseName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-slate-200 text-slate-800">
                      {slot.type}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 flex flex-wrap items-center gap-x-4">
                    <span>Batch: <strong>{slot.batch}</strong></span>
                    <span>Venue: <strong>{slot.room}</strong></span>
                  </div>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                  Active in ERP
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Course Details Modal */}
      {selectedCourseDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[11px] font-mono text-teal-700 font-bold uppercase">
                  {selectedCourseDetail.code} · Teaching Dossier
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  {selectedCourseDetail.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCourseDetail(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Credits:</span>
                <span className="font-bold text-slate-900">{selectedCourseDetail.credits} Credits (BPUT Standard)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Enrolled Candidates:</span>
                <span className="font-mono text-slate-800">{selectedCourseDetail.enrolledCount} Registered Students</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Class Progress:</span>
                <span className="font-mono text-teal-700 font-bold">{selectedCourseDetail.conductedClasses} of 48 Sessions Delivered (87.5%)</span>
              </div>
            </div>

            <div className="text-xs space-y-2">
              <h4 className="font-bold text-slate-800">Module Outline:</h4>
              <div className="space-y-1.5 text-slate-600">
                <div className="p-2 rounded bg-slate-50 border border-slate-100">
                  <strong>Module 1:</strong> Relational Model, Relational Algebra, Calculus & Formal SQL (Completed)
                </div>
                <div className="p-2 rounded bg-slate-50 border border-slate-100">
                  <strong>Module 2:</strong> Normalization (1NF, 2NF, 3NF, BCNF) & Dependency Preservation (Completed)
                </div>
                <div className="p-2 rounded bg-teal-50/60 border border-teal-100">
                  <strong>Module 3 (In-Progress):</strong> Query Processing, Optimization, Cost Estimation & Indexing
                </div>
                <div className="p-2 rounded bg-slate-50 border border-slate-100">
                  <strong>Module 4:</strong> Transaction Management, ACID properties, Concurrency Protocols & Recovery
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedCourseDetail(null)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
