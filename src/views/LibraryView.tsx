import React, { useState } from 'react';
import {
  Library,
  Search,
  BookOpen,
  Calendar,
  Clock,
  CheckCircle2,
  RefreshCw,
  BookmarkPlus,
  BookmarkCheck,
  AlertCircle,
  MapPin,
} from 'lucide-react';
import { BorrowedBook, LibraryBook, UserRole } from '../types';

interface LibraryViewProps {
  borrowedBooks: BorrowedBook[];
  catalogBooks: LibraryBook[];
  userRole: UserRole;
  onRenewBook: (borrowedId: string) => void;
  onReserveBook: (catalogId: string) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  borrowedBooks,
  catalogBooks,
  userRole,
  onRenewBook,
  onReserveBook,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [reservedBooks, setReservedBooks] = useState<string[]>([]);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  const filteredCatalog = catalogBooks.filter((book) => {
    if (
      searchQuery &&
      !book.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !book.author.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !book.category.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const handleRenew = (id: string, title: string) => {
    onRenewBook(id);
    setActionSuccessMessage(`Successfully renewed loan period for "${title}". New due date updated by 14 days.`);
    setTimeout(() => setActionSuccessMessage(null), 3000);
  };

  const handleReserve = (id: string, title: string) => {
    if (reservedBooks.includes(id)) return;
    setReservedBooks([...reservedBooks, id]);
    onReserveBook(id);
    setActionSuccessMessage(`Reserved copy of "${title}". Ready for pickup at Central Circulation Desk.`);
    setTimeout(() => setActionSuccessMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-teal-700 tracking-wide uppercase">
            BPUT Central Library & Learning Resource Centre
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            Library Loans & Online Public Access Catalog (OPAC)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Borrowing quota: 4 Books max · Circulation Desk: Ground Floor Library Wing
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            Fine Balance: ₹0.00 (No Dues)
          </div>
        </div>
      </div>

      {/* Action feedback banner */}
      {actionSuccessMessage && (
        <div className="p-3 bg-teal-50 border border-teal-200 text-teal-900 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-teal-600" />
          {actionSuccessMessage}
        </div>
      )}

      {/* 2. Current Borrowed Books Section */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Your Borrowed Volumes ({borrowedBooks.filter((b) => b.status !== 'Returned').length} Active Loans)
            </h3>
            <p className="text-xs text-slate-500">Renew books online before the scheduled due date</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {borrowedBooks.map((loan) => {
            const isDueSoon = loan.status === 'Due Soon';
            const isReturned = loan.status === 'Returned';

            return (
              <div
                key={loan.id}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                  isReturned
                    ? 'bg-slate-50 border-slate-200 opacity-75'
                    : isDueSoon
                    ? 'bg-amber-50/40 border-amber-200'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-mono text-slate-500">
                      Acc: {loan.accessionNo}
                    </span>
                    {isReturned ? (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-semibold">
                        Returned
                      </span>
                    ) : isDueSoon ? (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
                        Due in 4 Days
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                        Active Loan
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-slate-900">{loan.title}</h4>
                  <p className="text-xs text-slate-600">{loan.author}</p>

                  <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex justify-between">
                    <span>Issued: {loan.issueDate}</span>
                    <span className="font-semibold text-slate-800">Due: {loan.dueDate}</span>
                  </div>
                </div>

                {!isReturned && (
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">
                      {loan.renewalsLeft} renewal(s) remaining
                    </span>
                    {loan.renewalsLeft > 0 ? (
                      <button
                        onClick={() => handleRenew(loan.id, loan.title)}
                        className="px-3 py-1 text-xs font-semibold rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" /> Renew Loan
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-medium">Max renewals reached</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Searchable Library Catalogue */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Central Library Catalogue (OPAC Search)
            </h3>
            <p className="text-xs text-slate-500">Search textbooks, reference volumes, and journals</p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, author, or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Book Title & Edition</th>
                <th className="py-3 px-4">Author</th>
                <th className="py-3 px-4">Shelf / Bay Location</th>
                <th className="py-3 px-4 text-center">Availability</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCatalog.map((bk) => {
                const isReserved = reservedBooks.includes(bk.id);
                return (
                  <tr key={bk.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{bk.title}</div>
                      <div className="text-[11px] text-slate-500">{bk.edition} · ISBN: {bk.isbn}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">{bk.author}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-slate-600 bg-slate-100 px-2 py-0.5 rounded font-mono text-[11px]">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {bk.shelf}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="font-mono font-bold text-slate-900 tabular-nums">
                        {bk.availableCopies} / {bk.totalCopies}
                      </div>
                      <div className="text-[10px] text-emerald-700 font-medium">Available</div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleReserve(bk.id, bk.title)}
                        disabled={isReserved}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 ml-auto ${
                          isReserved
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 cursor-default'
                            : 'bg-slate-900 text-white hover:bg-slate-800'
                        }`}
                      >
                        {isReserved ? (
                          <>
                            <BookmarkCheck className="w-3.5 h-3.5 text-emerald-600" />
                            Reserved
                          </>
                        ) : (
                          <>
                            <BookmarkPlus className="w-3.5 h-3.5" />
                            Reserve Copy
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
