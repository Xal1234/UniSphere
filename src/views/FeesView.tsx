import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  Clock,
  Download,
  AlertCircle,
  Receipt,
  ArrowRight,
  ShieldCheck,
  Check,
  X,
  FileText,
  Printer,
  Search,
  Filter,
  Users,
  Building,
} from 'lucide-react';
import { FeeBreakdown, FeeTransaction, StudentProfile, UserRole } from '../types';

interface FeesViewProps {
  breakdowns: FeeBreakdown[];
  transactions: FeeTransaction[];
  student: StudentProfile;
  userRole?: UserRole;
  onPayFee: (category: string, amount: number, mode: FeeTransaction['mode']) => void;
  openPayModalDirectly?: boolean;
}

export const FeesView: React.FC<FeesViewProps> = ({
  breakdowns,
  transactions,
  student,
  userRole = 'student',
  onPayFee,
  openPayModalDirectly = false,
}) => {
  const [showPayModal, setShowPayModal] = useState<boolean>(openPayModalDirectly);
  const [selectedCategory, setSelectedCategory] = useState<string>('Hostel & Mess Charges (Spring 2026)');
  const [payAmount, setPayAmount] = useState<number>(8000);
  const [payMode, setPayMode] = useState<FeeTransaction['mode']>('UPI');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  const [selectedReceipt, setSelectedReceipt] = useState<FeeTransaction | null>(null);

  // Admin filter states
  const [adminSearch, setAdminSearch] = useState('');
  const [adminStatusFilter, setAdminStatusFilter] = useState<'All' | 'Cleared' | 'Arrears'>('All');
  const [clearanceIssuedId, setClearanceIssuedId] = useState<string | null>(null);

  const totalFee = breakdowns.reduce((sum, b) => sum + b.amount, 0);
  const totalPaid = breakdowns.reduce((sum, b) => sum + b.paid, 0);
  const totalDue = breakdowns.reduce((sum, b) => sum + b.due, 0);

  // Sample student fee ledger for admin view
  const sampleStudentFeeLedger = [
    {
      id: 'STU-01',
      rollNo: '2201209042',
      name: 'Rahul Pattnaik',
      branch: 'Computer Science & Engineering',
      semester: '6th Sem',
      totalDemand: 88000,
      paid: 80000,
      due: 8000,
      status: 'Arrears Pending',
    },
    {
      id: 'STU-02',
      rollNo: '2201209015',
      name: 'Ananya Priyadarshini',
      branch: 'Computer Science & Engineering',
      semester: '6th Sem',
      totalDemand: 88000,
      paid: 88000,
      due: 0,
      status: 'Fee Cleared',
    },
    {
      id: 'STU-03',
      rollNo: '2201209058',
      name: 'Soumyaranjan Das',
      branch: 'Computer Science & Engineering',
      semester: '6th Sem',
      totalDemand: 88000,
      paid: 88000,
      due: 0,
      status: 'Fee Cleared',
    },
    {
      id: 'STU-04',
      rollNo: '2201209071',
      name: 'Biswajit Mohapatra',
      branch: 'Electronics & Telecommunication',
      semester: '6th Sem',
      totalDemand: 82000,
      paid: 70000,
      due: 12000,
      status: 'Arrears Pending',
    },
    {
      id: 'STU-05',
      rollNo: '2201209089',
      name: 'Lipsa Nayak',
      branch: 'Mechanical Engineering',
      semester: '6th Sem',
      totalDemand: 80000,
      paid: 80000,
      due: 0,
      status: 'Fee Cleared',
    },
  ];

  const filteredStudentLedger = sampleStudentFeeLedger.filter((s) => {
    if (adminStatusFilter === 'Cleared' && s.due > 0) return false;
    if (adminStatusFilter === 'Arrears' && s.due === 0) return false;
    if (
      adminSearch &&
      !s.name.toLowerCase().includes(adminSearch.toLowerCase()) &&
      !s.rollNo.includes(adminSearch) &&
      !s.branch.toLowerCase().includes(adminSearch.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const handleExecutePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      onPayFee(selectedCategory, Number(payAmount), payMode);
      setIsProcessing(false);
      setPaymentSuccess(true);
      setTimeout(() => {
        setPaymentSuccess(false);
        setShowPayModal(false);
      }, 1000);
    }, 700);
  };

  // If Admin Mode, render the Institutional Bursar & Department Fee Collections Console
  if (userRole === 'admin') {
    return (
      <div className="space-y-6">
        {/* 1. Header */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-teal-700 tracking-wide uppercase">
              University Bursar & Finance Division
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Fee Collections & Department Clearance Register
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Institutional session fee realisation, departmental arrears, and student examination clearance tracking.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold">
              Fiscal Year 2025-26
            </span>
          </div>
        </div>

        {/* 2. Top Financial Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="text-xs font-semibold text-slate-500 uppercase">Total Fee Demand</div>
            <div className="mt-2 text-2xl font-bold font-mono text-slate-900 tabular-nums">
              ₹4,85,00,000
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Tuition, Hostel & Amenities (All Batches)</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="text-xs font-semibold text-slate-500 uppercase">Realised Collections</div>
            <div className="mt-2 text-2xl font-bold font-mono text-emerald-600 tabular-nums">
              ₹4,12,50,000
            </div>
            <p className="text-[11px] text-emerald-700 font-medium mt-1">85.05% Realisation Rate</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="text-xs font-semibold text-slate-500 uppercase">Outstanding Arrears</div>
            <div className="mt-2 text-2xl font-bold font-mono text-purple-600 tabular-nums">
              ₹72,50,000
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Due across CSE, ETC, & ME</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="text-xs font-semibold text-slate-500 uppercase">Exam Clearances</div>
            <div className="mt-2 text-2xl font-bold font-mono text-slate-900 tabular-nums">
              1,420 / 1,600
            </div>
            <p className="text-[11px] text-teal-700 font-semibold mt-1">88.75% Students Cleared</p>
          </div>
        </div>

        {/* 3. Departmental Collections Breakdown */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">
            Department-wise Fee Recovery Performance
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-900">Computer Science & Engg</span>
                <span className="font-mono text-emerald-700 font-semibold">88.6%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '88.6%' }} />
              </div>
              <div className="text-[11px] text-slate-500 flex justify-between">
                <span>Collected: ₹1.64 Cr</span>
                <span>Due: ₹21.0 L</span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-900">Electronics & Telecommunication</span>
                <span className="font-mono text-emerald-700 font-semibold">84.0%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '84%' }} />
              </div>
              <div className="text-[11px] text-slate-500 flex justify-between">
                <span>Collected: ₹1.26 Cr</span>
                <span>Due: ₹24.0 L</span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-900">Mechanical Engineering</span>
                <span className="font-mono text-emerald-700 font-semibold">81.6%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '81.6%' }} />
              </div>
              <div className="text-[11px] text-slate-500 flex justify-between">
                <span>Collected: ₹1.22 Cr</span>
                <span>Due: ₹27.5 L</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Student Fee Clearance & Dues Register */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Student Fee Clearance & Exam Hall Slip Register
              </h3>
              <p className="text-xs text-slate-500">Track payment clearance and issue no-dues verification for BPUT examinations</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs">
                {(['All', 'Cleared', 'Arrears'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setAdminStatusFilter(f)}
                    className={`px-3 py-1 rounded-md font-medium transition-colors ${
                      adminStatusFilter === f
                        ? 'bg-white text-slate-900 shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search student or roll no..."
                  value={adminSearch}
                  onChange={(e) => setAdminSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Roll No & Name</th>
                  <th className="py-3 px-4">Branch & Semester</th>
                  <th className="py-3 px-4 text-right">Fee Demand</th>
                  <th className="py-3 px-4 text-right">Amount Paid</th>
                  <th className="py-3 px-4 text-right">Balance Due</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Clearance Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudentLedger.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{s.name}</div>
                      <div className="font-mono text-[11px] text-slate-500">{s.rollNo}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">{s.branch}</div>
                      <div className="text-[11px] text-slate-500">{s.semester}</div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-800">
                      ₹{s.totalDemand.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-emerald-700 font-semibold">
                      ₹{s.paid.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold">
                      <span className={s.due > 0 ? 'text-purple-600' : 'text-slate-500'}>
                        ₹{s.due.toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {s.due === 0 ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded font-semibold text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Fee Cleared
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded font-semibold text-[11px] bg-amber-50 text-amber-800 border border-amber-200">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                          ₹{s.due.toLocaleString('en-IN')} Due
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {clearanceIssuedId === s.id ? (
                        <span className="text-[11px] text-emerald-700 font-bold flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Slip Issued
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            setClearanceIssuedId(s.id);
                            setTimeout(() => setClearanceIssuedId(null), 3000);
                          }}
                          className="px-2.5 py-1 text-xs font-semibold rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                          {s.due === 0 ? 'Issue No-Dues Slip' : 'Issue Conditional Slip'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-teal-700 tracking-wide uppercase">
            University Accounts & Bursar Office
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            Fee Ledger & Payment Portal
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Student Reg: {student.regNo} · Academic Session 2025-26
          </p>
        </div>

        {totalDue > 0 ? (
          <button
            onClick={() => {
              setPayAmount(totalDue);
              setShowPayModal(true);
            }}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors shadow-xs flex items-center gap-1.5"
          >
            <CreditCard className="w-4 h-4" />
            Pay Outstanding Balance (₹{totalDue.toLocaleString('en-IN')})
          </button>
        ) : (
          <div className="px-3.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            All Dues Cleared (No Arrears)
          </div>
        )}
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Total Billable Fee</div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-900 tabular-nums">
            ₹{totalFee.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Tuition, Hostel & Amenities</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Paid to Date</div>
          <div className="mt-2 text-2xl font-bold font-mono text-emerald-600 tabular-nums">
            ₹{totalPaid.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-emerald-700 font-medium mt-1">Verified with Bank Settlement</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Outstanding Due</div>
          <div
            className={`mt-2 text-2xl font-bold font-mono tabular-nums ${
              totalDue > 0 ? 'text-purple-600' : 'text-slate-900'
            }`}
          >
            ₹{totalDue.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {totalDue > 0 ? 'Due before 15 Oct 2026' : 'Nil Balance'}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Next Deadline</div>
          <div className="mt-2 text-base font-bold text-slate-900">
            15 October 2026
          </div>
          <p className="text-[11px] text-amber-700 font-semibold mt-1">Late fee waived as per notice</p>
        </div>
      </div>

      {/* 3. Fee Breakdown Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">
            Itemized Semester Fee Schedule
          </h3>
          <span className="text-xs text-slate-500">6th Semester · B.Tech (2025-26)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Fee Component</th>
                <th className="py-3 px-4 text-right">Total Amount</th>
                <th className="py-3 px-4 text-right">Amount Paid</th>
                <th className="py-3 px-4 text-right">Balance Due</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {breakdowns.map((b, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    {b.category}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-800">
                    ₹{b.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums text-emerald-700 font-semibold">
                    ₹{b.paid.toLocaleString('en-IN')}
                  </td>
                  <td
                    className={`py-3.5 px-4 text-right font-mono tabular-nums font-bold ${
                      b.due > 0 ? 'text-purple-600' : 'text-slate-400'
                    }`}
                  >
                    ₹{b.due.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {b.due === 0 ? (
                      <span className="text-[11px] px-2 py-0.5 rounded font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        Paid Full
                      </span>
                    ) : (
                      <span className="text-[11px] px-2 py-0.5 rounded font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                        Unpaid Due
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {b.due > 0 && (
                      <button
                        onClick={() => {
                          setSelectedCategory(b.category);
                          setPayAmount(b.due);
                          setShowPayModal(true);
                        }}
                        className="text-xs font-semibold text-teal-700 hover:text-teal-800 hover:underline"
                      >
                        Pay ₹{b.due.toLocaleString('en-IN')}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Payment History & Transaction Receipts */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Transaction & Official Receipt History
            </h3>
            <p className="text-xs text-slate-500">Official e-receipts recognized by BPUT finance division</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Receipt Number</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">E-Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    {txn.receiptNo}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">{txn.date}</td>
                  <td className="py-3.5 px-4 text-slate-700 font-medium">{txn.category}</td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold tabular-nums text-slate-900">
                    ₹{txn.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{txn.mode}</td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="text-[11px] px-2 py-0.5 rounded font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {txn.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedReceipt(txn)}
                      className="text-xs font-semibold text-teal-700 hover:text-teal-800 inline-flex items-center gap-1"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Demo Safe Online Payment Modal */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-mono text-teal-700 font-bold uppercase">
                  BPUT Online Fee Settlement
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  Confirm Fee Payment
                </h3>
              </div>
              <button
                onClick={() => setShowPayModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg text-xs">
              <span className="font-bold">Sandbox Environment: </span>
              This is a safe demonstration checkout. No real money or card numbers are requested.
            </div>

            <form onSubmit={handleExecutePayment} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Target Fee Component
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    const found = breakdowns.find((b) => b.category === e.target.value);
                    if (found && found.due > 0) setPayAmount(found.due);
                  }}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-medium"
                >
                  {breakdowns
                    .filter((b) => b.due > 0)
                    .map((b) => (
                      <option key={b.category} value={b.category}>
                        {b.category} (Due: ₹{b.due.toLocaleString('en-IN')})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Amount to Pay (INR) *
                </label>
                <input
                  type="number"
                  min="100"
                  max={totalDue}
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono font-bold text-base"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Payment Mode *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['UPI', 'Net Banking', 'Debit Card'] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setPayMode(mode)}
                      className={`p-2.5 rounded-lg border text-center font-semibold text-xs transition-colors ${
                        payMode === mode
                          ? 'border-teal-600 bg-teal-50 text-teal-900'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {paymentSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Payment verified! Balance updated and e-receipt generated.
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPayModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-4 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700 font-semibold flex items-center gap-1.5"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  {isProcessing ? 'Processing Transaction...' : `Pay ₹${payAmount.toLocaleString('en-IN')}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Official Receipt Preview Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-teal-700">
                  BPUT BURSAR OFFICE RECEIPT
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Receipt: {selectedReceipt.receiptNo}
                </h3>
              </div>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 border border-slate-200 rounded-lg bg-slate-50 text-xs space-y-3 font-sans">
              <div className="text-center pb-2 border-b border-slate-200">
                <div className="text-sm font-bold text-slate-900">
                  BIJU PATNAIK UNIVERSITY OF TECHNOLOGY, ODISHA
                </div>
                <div className="text-[10px] text-slate-500">
                  Electronic Fee Collection Receipt
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Student Name:</span>
                  <span className="font-bold text-slate-900">{student.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Registration No:</span>
                  <span className="font-mono text-slate-900">{student.regNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Date of Payment:</span>
                  <span className="font-mono text-slate-800">{selectedReceipt.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment Category:</span>
                  <span className="text-slate-800 font-semibold">{selectedReceipt.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment Mode:</span>
                  <span className="text-slate-800">{selectedReceipt.mode}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-sm text-slate-900">
                  <span>Amount Paid:</span>
                  <span className="font-mono text-teal-700">₹{selectedReceipt.amount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="pt-2 text-[10px] text-slate-400 text-center">
                System generated digital receipt · Valid without physical signature
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Receipt
              </button>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
