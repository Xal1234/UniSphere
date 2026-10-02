export type UserRole = 'student' | 'admin';

export type ThemePreference = 'light' | 'dark' | 'system';
export type DevicePreference = 'responsive' | 'desktop' | 'tablet' | 'mobile';
export type DensityPreference = 'comfortable' | 'compact';

export interface UserPreferences {
  theme: ThemePreference;
  device: DevicePreference;
  density: DensityPreference;
}

export interface StudentProfile {
  id: string;
  name: string;
  rollNo: string;
  regNo: string;
  course: string;
  branch: string;
  semester: string;
  batch: string;
  email: string;
  phone: string;
  hostel: string;
  roomNo: string;
  wardenName: string;
  guardianName: string;
  guardianPhone: string;
  bloodGroup: string;
  advisor: string;
}

export interface AdminProfile {
  id: string;
  name: string;
  employeeId: string;
  designation: string;
  department: string;
  email: string;
  phone: string;
  roleType: 'Academic Dean' | 'Chief Warden' | 'HoD CSE' | 'Accounts Officer';
}

export interface AttendanceCourse {
  code: string;
  name: string;
  faculty: string;
  conducted: number;
  attended: number;
  percentage: number;
  credits: number;
  weeklyTrend: { day: string; status: 'present' | 'absent' | 'holiday' }[];
}

export interface TimetableSlot {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  time: string;
  courseCode: string;
  courseName: string;
  faculty: string;
  room: string;
  type: 'Theory' | 'Lab' | 'Tutorial';
}

export interface ClassLeaveRequest {
  id: string;
  studentId: string;
  studentName: string;
  regNo: string;
  date: string;
  period: string;
  reason: 'Medical' | 'Campus Drive' | 'Technical Fest' | 'Family Emergency' | 'Other';
  note: string;
  submittedAt: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  reviewedBy?: string;
  reviewedAt?: string;
  adminRemark?: string;
}

export interface HostelLeaveRequest {
  id: string;
  studentId: string;
  studentName: string;
  regNo: string;
  hostel: string;
  roomNo: string;
  departureDate: string;
  departureTime: string;
  returnDate: string;
  returnTime: string;
  destination: string;
  reason: string;
  emergencyContact: string;
  emergencyPhone: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Out Campus' | 'Returned';
  submittedAt: string;
  gatePassId: string;
  wardenRemark?: string;
}

export interface Assignment {
  id: string;
  courseCode: string;
  courseName: string;
  title: string;
  description: string;
  faculty: string;
  dueDate: string;
  maxMarks: number;
  status: 'Pending' | 'Submitted' | 'Evaluated';
  submittedDate?: string;
  marksObtained?: number;
  feedback?: string;
  submissionNote?: string;
}

export interface CampusEvent {
  id: string;
  title: string;
  category: 'Technical' | 'Cultural' | 'Sports' | 'Workshop' | 'Academic';
  date: string;
  time: string;
  venue: string;
  description: string;
  organizer: string;
  attendeesCount: number;
  isRsvpd: boolean;
  isPast: boolean;
  bannerTag?: string;
  status?: 'Published' | 'Draft' | 'Cancelled';
}

export interface ResultSubject {
  code: string;
  name: string;
  credits: number;
  grade: 'O' | 'E' | 'A' | 'B' | 'C' | 'D' | 'F';
  gradePoint: number;
  status: 'Passed' | 'Failed' | 'Pending Evaluation';
}

export interface SemesterResult {
  semester: number;
  semesterName: string;
  sgpa: number;
  cgpa: number;
  status: 'Published' | 'Under Evaluation';
  publishDate: string;
  subjects: ResultSubject[];
}

export interface FeeTransaction {
  id: string;
  receiptNo: string;
  date: string;
  amount: number;
  mode: 'Net Banking' | 'UPI' | 'Challan' | 'Debit Card';
  category: 'Tuition Fee' | 'Hostel & Mess' | 'Exam Fee' | 'Development Fee';
  status: 'Successful' | 'Pending';
}

export interface FeeBreakdown {
  category: string;
  amount: number;
  paid: number;
  due: number;
}

export interface AdmissionApplicant {
  id: string;
  applicantName: string;
  applicationNo: string;
  program: string;
  branch: string;
  entranceExam: 'JEE Main' | 'OJEE' | 'GATE';
  entranceRank: number;
  category: 'General' | 'OBC' | 'SC' | 'ST' | 'TFW';
  applicationDate: string;
  status: 'Submitted' | 'Under Review' | 'Shortlisted' | 'Provisionally Admitted' | 'Rejected';
  documentsVerified: number;
  totalDocuments: number;
  contactEmail: string;
  contactPhone: string;
  remarks?: string;
}

export interface Notice {
  id: string;
  title: string;
  category: 'Academic' | 'Exams' | 'Placement' | 'Hostels' | 'Administrative';
  date: string;
  department: string;
  isUrgent: boolean;
  content: string;
  signedBy: string;
  attachmentName?: string;
}

export interface LibraryBook {
  id: string;
  title: string;
  author: string;
  isbn: string;
  edition: string;
  category: string;
  shelf: string;
  availableCopies: number;
  totalCopies: number;
}

export interface BorrowedBook {
  id: string;
  bookId: string;
  title: string;
  author: string;
  accessionNo: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  fineAmount: number;
  status: 'Active' | 'Due Soon' | 'Overdue' | 'Returned';
  renewalsLeft: number;
}

export interface HelpdeskTicket {
  id: string;
  ticketNo: string;
  studentName: string;
  regNo: string;
  category: 'Hostel Maintenance' | 'Wi-Fi & LAN' | 'ERP & Portal' | 'Exam Cell' | 'ID Card' | 'Transport' | 'Library';
  subject: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Open' | 'In Progress' | 'Resolved';
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  resolution?: string;
}

export interface StudentDocument {
  id: string;
  name: string;
  type: string;
  fileSize: string;
  status: 'Verified' | 'Pending Verification' | 'Rejected';
  verifiedOn?: string;
  remarks?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'notice' | 'leave' | 'fee' | 'assignment' | 'event' | 'attendance';
  read: boolean;
  linkTab?: string;
  targetRole?: 'student' | 'admin' | 'both';
  targetUserId?: string;
}

export interface ClassAttendanceRecord {
  id: string;
  courseCode: string;
  courseName: string;
  sessionDate: string;
  sessionPeriod: string;
  markedBy: string;
  markedAt: string;
  lastEditedAt?: string;
  presentStudentIds: string[];
  absentStudentIds: string[];
  totalEnrolled: number;
  remarks?: string;
}

export type StaffPersona = 'Dean & Chief Warden' | 'Course Faculty' | 'Hostel Warden' | 'Office Administrator';

export interface StaffLeaveRequest {
  id: string;
  staffId: string;
  staffName: string;
  department: string;
  leaveType: 'Casual Leave (CL)' | 'Duty Leave (DL)' | 'Earned Leave (EL)' | 'Medical Leave';
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  handoverFaculty: string;
  submittedAt: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  approvedBy: string;
  remarks?: string;
}

export interface FacultyCourse {
  code: string;
  name: string;
  semester: string;
  branch: string;
  enrolledCount: number;
  conductedClasses: number;
  avgAttendance: number;
  room: string;
  schedule: string;
  credits: number;
}

export interface StaffTimetableSlot {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  time: string;
  courseCode: string;
  courseName: string;
  room: string;
  type: 'Lecture' | 'Lab' | 'Meeting' | 'Consultation';
  batch: string;
}

export interface StudentRecord {
  id: string;
  name: string;
  rollNo: string;
  regNo: string;
  branch: string;
  semester: string;
  cgpa: number;
  attendancePct: number;
  hostel: string;
  roomNo: string;
  email: string;
  phone: string;
  pendingSubmissions: number;
  status: 'Good Standing' | 'Attendance Defaulter' | 'On Approved Leave';
}

