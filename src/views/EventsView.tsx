import React, { useState } from 'react';
import {
  Calendar,
  Search,
  Filter,
  MapPin,
  Clock,
  Users,
  Check,
  Plus,
  X,
  History,
  Sparkles,
  Edit3,
  Ban,
  Send,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { CampusEvent, UserRole } from '../types';

interface EventsViewProps {
  events: CampusEvent[];
  userRole: UserRole;
  onToggleRsvp: (id: string) => void;
  onAddEvent?: (event: Omit<CampusEvent, 'id' | 'attendeesCount' | 'isRsvpd' | 'isPast'>) => void;
  onUpdateEvent?: (id: string, updated: Partial<CampusEvent>) => void;
  onCancelEvent?: (id: string) => void;
}

export const EventsView: React.FC<EventsViewProps> = ({
  events,
  userRole,
  onToggleRsvp,
  onAddEvent,
  onUpdateEvent,
  onCancelEvent,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showPastEvents, setShowPastEvents] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CampusEvent | null>(null);

  // New event form state
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventCategory, setNewEventCategory] = useState<CampusEvent['category']>('Technical');
  const [newEventDate, setNewEventDate] = useState('2026-11-04');
  const [newEventTime, setNewEventTime] = useState('10:00 AM - 04:00 PM');
  const [newEventVenue, setNewEventVenue] = useState('Auditorium 2');
  const [newEventDesc, setNewEventDesc] = useState('');
  const [newEventOrganizer, setNewEventOrganizer] = useState('Robotics Society');
  const [newEventStatus, setNewEventStatus] = useState<CampusEvent['status']>('Published');

  // Edit event form state
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState<CampusEvent['category']>('Technical');
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editVenue, setEditVenue] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editOrganizer, setEditOrganizer] = useState('');
  const [editStatus, setEditStatus] = useState<CampusEvent['status']>('Published');

  const categories = ['All', 'Technical', 'Workshop', 'Sports', 'Cultural', 'Academic'];

  const filteredUpcoming = events
    .filter((e) => !e.isPast)
    .filter((e) => {
      if (selectedCategory !== 'All' && e.category !== selectedCategory) return false;
      if (
        searchQuery &&
        !e.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !e.venue.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    });

  const pastEvents = events.filter((e) => e.isPast);

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onAddEvent) return;
    onAddEvent({
      title: newEventTitle,
      category: newEventCategory,
      date: newEventDate,
      time: newEventTime,
      venue: newEventVenue,
      description: newEventDesc || 'Official university approved campus event.',
      organizer: newEventOrganizer,
      status: newEventStatus,
    });
    setShowCreateModal(false);
    setNewEventTitle('');
    setNewEventDesc('');
  };

  const handleStartEdit = (evt: CampusEvent) => {
    setEditingEvent(evt);
    setEditTitle(evt.title);
    setEditCategory(evt.category);
    setEditDate(evt.date);
    setEditTime(evt.time);
    setEditVenue(evt.venue);
    setEditDesc(evt.description);
    setEditOrganizer(evt.organizer);
    setEditStatus(evt.status || 'Published');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent || !onUpdateEvent) return;
    onUpdateEvent(editingEvent.id, {
      title: editTitle,
      category: editCategory,
      date: editDate,
      time: editTime,
      venue: editVenue,
      description: editDesc,
      organizer: editOrganizer,
      status: editStatus,
    });
    setEditingEvent(null);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-teal-700 tracking-wide uppercase">
            Campus Life & Symposia
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            University Events & Workshops
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Technical symposiums, hackathons, sports championships, and cultural galas at BPUT.
          </p>
        </div>

        {userRole === 'admin' && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Publish New Event
          </button>
        )}
      </div>

      {/* 2. Search & Category Filters */}
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

        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search event title or venue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <button
            onClick={() => setShowPastEvents(!showPastEvents)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1.5 ${
              showPastEvents
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            {showPastEvents ? 'Hide Past' : 'Past Events'}
          </button>
        </div>
      </div>

      {/* 3. Upcoming Events Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">
            Upcoming Campus Calendar ({filteredUpcoming.length})
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredUpcoming.map((evt) => (
            <div
              key={evt.id}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded border border-teal-100">
                      {evt.category}
                    </span>
                    {evt.status === 'Cancelled' ? (
                      <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 flex items-center gap-1">
                        <Ban className="w-3 h-3 text-rose-600" />
                        Cancelled
                      </span>
                    ) : evt.status === 'Draft' ? (
                      <span className="text-[10px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        Draft
                      </span>
                    ) : evt.bannerTag ? (
                      <span className="text-[10px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {evt.bannerTag}
                      </span>
                    ) : null}
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{evt.attendeesCount} RSVP'd</span>
                  </div>
                </div>

                <h4 className="text-base font-bold text-slate-900">
                  {evt.title}
                </h4>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {evt.description}
                </p>

                <div className="space-y-1.5 text-xs text-slate-600 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span><strong>Date:</strong> {evt.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span><strong>Timing:</strong> {evt.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span><strong>Location:</strong> {evt.venue}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] text-slate-400">
                  Organized by {evt.organizer}
                </span>

                <div className="flex items-center gap-2">
                  {userRole === 'admin' && (
                    <>
                      <button
                        onClick={() => handleStartEdit(evt)}
                        className="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3 text-slate-500" />
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (evt.status === 'Cancelled') {
                            if (onUpdateEvent) onUpdateEvent(evt.id, { status: 'Published' });
                          } else {
                            if (onCancelEvent) onCancelEvent(evt.id);
                            else if (onUpdateEvent) onUpdateEvent(evt.id, { status: 'Cancelled' });
                          }
                        }}
                        className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1 ${
                          evt.status === 'Cancelled'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                            : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                        }`}
                      >
                        {evt.status === 'Cancelled' ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Restore
                          </>
                        ) : (
                          <>
                            <Ban className="w-3 h-3 text-rose-600" />
                            Cancel
                          </>
                        )}
                      </button>
                    </>
                  )}

                  {userRole === 'student' && (
                    <button
                      disabled={evt.status === 'Cancelled'}
                      onClick={() => onToggleRsvp(evt.id)}
                      className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 shadow-xs ${
                        evt.status === 'Cancelled'
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                          : evt.isRsvpd
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                          : 'bg-slate-900 text-white hover:bg-slate-800'
                      }`}
                    >
                      {evt.status === 'Cancelled' ? (
                        'Event Cancelled'
                      ) : evt.isRsvpd ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          Confirmed RSVP
                        </>
                      ) : (
                        <>RSVP Now</>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Past Events Archive Section */}
      {showPastEvents && (
        <div className="space-y-3 pt-4 border-t border-slate-200">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-slate-500" />
            <h3 className="text-base font-bold text-slate-900">
              Past Campus Highlights & Concluded Events
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pastEvents.map((evt) => (
              <div
                key={evt.id}
                className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-600 space-y-2 opacity-90"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase text-slate-500 bg-slate-200 px-2 py-0.5 rounded">
                    {evt.category} · Concluded
                  </span>
                  <span className="text-xs font-mono text-slate-500">{evt.date}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{evt.title}</h4>
                <p className="text-xs text-slate-500">{evt.description}</p>
                <div className="text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-200">
                  <span>Venue: {evt.venue}</span>
                  <span>{evt.attendeesCount} participants</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Admin Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-mono text-teal-700 font-bold uppercase">
                  SAC Administrative Console
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  Publish New Campus Event
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. National Seminar on AI Ethics in Cyber-Physical Systems"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Category *</label>
                  <select
                    value={newEventCategory}
                    onChange={(e) => setNewEventCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800"
                  >
                    <option value="Technical">Technical</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Sports">Sports</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Academic">Academic</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Date *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2026-11-04"
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Time Schedule *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 10:00 AM - 04:00 PM"
                    value={newEventTime}
                    onChange={(e) => setNewEventTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Venue / Auditorium *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aryabhatta Conference Hall"
                    value={newEventVenue}
                    onChange={(e) => setNewEventVenue(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Organizing Body / Cell</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Department of CSE / BPUT Student Council"
                  value={newEventOrganizer}
                  onChange={(e) => setNewEventOrganizer(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Overview of speakers, itinerary, participation rules..."
                  value={newEventDesc}
                  onChange={(e) => setNewEventDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800"
                />
              </div>

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
                  <Sparkles className="w-3.5 h-3.5" />
                  Publish Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Edit Event Modal */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-mono text-teal-700 font-bold uppercase">
                  SAC Administrative Console · {editingEvent.id}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  Update Campus Event Details
                </h3>
              </div>
              <button
                onClick={() => setEditingEvent(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Category *</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800"
                  >
                    <option value="Technical">Technical</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Sports">Sports</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Academic">Academic</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Date *</label>
                  <input
                    type="text"
                    required
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Time Schedule *</label>
                  <input
                    type="text"
                    required
                    value={editTime}
                    onChange={(e) => setEditTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Venue / Auditorium *</label>
                  <input
                    type="text"
                    required
                    value={editVenue}
                    onChange={(e) => setEditVenue(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Organizing Body</label>
                  <input
                    type="text"
                    required
                    value={editOrganizer}
                    onChange={(e) => setEditOrganizer(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Publication Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-semibold"
                  >
                    <option value="Published">Published & Active</option>
                    <option value="Draft">Draft (Internal)</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
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
    </div>
  );
};
