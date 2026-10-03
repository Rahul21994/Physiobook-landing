import { useState, useCallback, useMemo } from "react";
import { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { TooltipProvider } from "@/components/ui/tooltip";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const adminQueryClient = new QueryClient();

type Booking = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  appointmentType: string;
  preferredDate: string;
  mainConcern: string | null;
  affectedArea: string | null;
  painLevel: number | null;
  problemDuration: string | null;
  recoveryGoal: string | null;
  notes: string | null;
  status: string;
  createdAt: string;
  city?: string | null;
};

type Contact = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  createdAt: string;
};

type AdminReview = {
  id: number;
  name: string;
  city: string | null;
  service: string | null;
  rating: number;
  body: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
};

type ReviewStatus = AdminReview["status"];

function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  completed: "bg-blue-100 text-blue-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

const STATUS_DOT: Record<string, string> = {
  pending: "bg-yellow-400",
  confirmed: "bg-green-500",
  cancelled: "bg-red-400",
  completed: "bg-blue-400",
};

function StatusBadge({ status }: { status: string }) {
  const label = status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[status] ?? "bg-gray-100 text-gray-700"}`}
      data-status={status}
    >
      {label}
    </span>
  );
}

function ReviewRating({ rating }: { rating: number }) {
  return (
    <span className="text-amber-500 tracking-tight" aria-label={`${rating} star review`}>
      {"★".repeat(rating)}
      <span className="text-gray-300">{"★".repeat(Math.max(0, 5 - rating))}</span>
    </span>
  );
}

function LoginScreen({ onLogin }: { onLogin: (token: string) => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${BASE}/api/bookings`, { headers: authHeaders(password) });
      if (res.status === 401) setError("Incorrect password. Please try again.");
      else if (res.ok) { sessionStorage.setItem("admin_token", password); onLogin(password); }
      else setError("Unexpected error. Please try again.");
    } catch { setError("Could not reach server. Please try again."); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50">
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-full bg-[#3d6b5e] flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0-1.657-1.343-3-3-3S6 9.343 6 11v2h12v-2c0-1.657-1.343-3-3-3s-3 1.343-3 3z" />
              <rect x="3" y="13" width="18" height="8" rx="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Goswami Institute</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Admin Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3d6b5e]"
              placeholder="Enter password"
              required
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#3d6b5e] text-white py-2 rounded-lg text-sm font-medium hover:bg-[#2e5248] disabled:opacity-50 transition-colors"
          >
            {loading ? "Checking…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function CalendarView({
  bookings,
  updateStatus,
}: {
  bookings: Booking[];
  updateStatus: (args: { id: number; status: string }) => void;
}) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const byDate = useMemo(() => {
    const map: Record<string, Booking[]> = {};
    for (const b of bookings) {
      const key = b.preferredDate.slice(0, 10);
      if (!map[key]) map[key] = [];
      map[key].push(b);
    }
    return map;
  }, [bookings]);

  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const selectedBookings = selectedDate ? (byDate[selectedDate] ?? []) : [];

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="flex gap-6">
      <div className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
          <h2 className="text-base font-semibold text-gray-900">{MONTHS[month]} {year}</h2>
          <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <div className="grid grid-cols-7 border-b border-gray-100">
          {DAYS.map(d => (
            <div key={d} className="py-2 text-center text-xs font-medium text-gray-400 uppercase tracking-wide">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {cells.map((day, idx) => {
            if (!day) return <div key={`empty-${idx}`} className="border-r border-b border-gray-50 min-h-[80px]" />;

            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const dayBookings = byDate[dateStr] ?? [];
            const isToday = dateStr === todayStr;
            const isSelected = dateStr === selectedDate;

            return (
              <div
                key={dateStr}
                onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                className={`border-r border-b border-gray-50 min-h-[80px] p-2 cursor-pointer transition-colors ${
                  isSelected ? "bg-[#3d6b5e]/8 ring-1 ring-inset ring-[#3d6b5e]/30" :
                  dayBookings.length > 0 ? "hover:bg-gray-50" : "hover:bg-gray-50/60"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full ${
                    isToday ? "bg-[#3d6b5e] text-white" : isSelected ? "text-[#3d6b5e] font-semibold" : "text-gray-700"
                  }`}>
                    {day}
                  </span>
                  {dayBookings.length > 0 && (
                    <span className="text-[10px] text-gray-400 font-medium">{dayBookings.length}</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {dayBookings.slice(0, 3).map(b => (
                    <span
                      key={b.id}
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${STATUS_DOT[b.status] ?? "bg-gray-300"}`}
                      title={`${b.firstName} ${b.lastName} — ${b.status}`}
                    />
                  ))}
                  {dayBookings.length > 3 && (
                    <span className="text-[10px] text-gray-400">+{dayBookings.length - 3}</span>
                  )}
                </div>
                {dayBookings.length > 0 && dayBookings.length <= 2 && (
                  <div className="mt-1 space-y-0.5">
                    {dayBookings.map(b => (
                      <p key={b.id} className="text-[10px] text-gray-500 truncate leading-tight">
                        {b.firstName} {b.lastName}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="px-4 py-3 border-t border-gray-100 flex items-center gap-4">
          {Object.entries(STATUS_DOT).map(([status, dot]) => (
            <span key={status} className="flex items-center gap-1.5 text-xs text-gray-500 capitalize">
              <span className={`w-2 h-2 rounded-full ${dot}`} />
              {status}
            </span>
          ))}
        </div>
      </div>

      {selectedDate && (
        <div className="w-80 flex-shrink-0 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden self-start">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">
                {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-IN", { weekday: "long" })}
              </p>
              <h3 className="text-sm font-semibold text-gray-900 mt-0.5">
                {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </h3>
            </div>
            <button onClick={() => setSelectedDate(null)} className="p-1 rounded hover:bg-gray-100 transition-colors">
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          {selectedBookings.length === 0 ? (
            <div className="p-6 text-center text-gray-400 text-sm">No appointments on this day.</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {selectedBookings.map(b => (
                <div key={b.id} className="px-4 py-3">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{b.firstName} {b.lastName}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{b.appointmentType}</p>
                    </div>
                    <StatusBadge status={b.status} />
                  </div>
                  <div className="text-xs text-gray-400 space-y-0.5 mb-2">
                    <p>{b.email}</p>
                    <p>{b.phone}</p>
                     {b.mainConcern && <p><span className="font-medium text-gray-500">Problem:</span> {b.mainConcern}</p>}
                     {b.affectedArea && <p><span className="font-medium text-gray-500">Area:</span> {b.affectedArea}</p>}
                     {b.painLevel !== null && <p><span className="font-medium text-gray-500">Pain:</span> {b.painLevel}/10</p>}
                     {b.problemDuration && <p><span className="font-medium text-gray-500">Started:</span> {b.problemDuration}</p>}
                     {b.recoveryGoal && <p><span className="font-medium text-gray-500">Goal:</span> {b.recoveryGoal}</p>}
                    {b.notes && <p className="italic mt-1 text-gray-400">"{b.notes}"</p>}
                  </div>
                  <select
                    value={b.status}
                    onChange={(e) => updateStatus({ id: b.id, status: e.target.value })}
                    className="w-full text-xs border border-gray-200 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#3d6b5e] bg-white"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Dashboard({ token, onLogout }: { token: string; onLogout: () => void }) {
  const [tab, setTab] = useState<"calendar" | "bookings" | "contacts" | "reviews">("calendar");
  const [reviewStatusFilter, setReviewStatusFilter] = useState<"all" | ReviewStatus>("all");
  const [activeReviewAction, setActiveReviewAction] = useState<number | null>(null);
  const [reviewFeedback, setReviewFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const qc = useQueryClient();

  const bookingsQ = useQuery<Booking[]>({
    queryKey: ["admin-bookings"],
    queryFn: async () => {
      const res = await fetch(`${BASE}/api/bookings`, { headers: authHeaders(token) });
      if (!res.ok) throw new Error("Failed to fetch bookings");
      return res.json();
    },
    refetchInterval: 30000,
  });

  const contactsQ = useQuery<Contact[]>({
    queryKey: ["admin-contacts"],
    queryFn: async () => {
      const res = await fetch(`${BASE}/api/contacts`, { headers: authHeaders(token) });
      if (!res.ok) throw new Error("Failed to fetch contacts");
      return res.json();
    },
    refetchInterval: 30000,
  });

  const reviewsQ = useQuery<AdminReview[]>({
    queryKey: ["admin-reviews"],
    queryFn: async () => {
      const res = await fetch(`${BASE}/api/reviews/admin`, { headers: authHeaders(token) });
      if (!res.ok) throw new Error("Failed to fetch reviews");
      return res.json();
    },
    refetchInterval: 30000,
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await fetch(`${BASE}/api/bookings/${id}`, {
        method: "PATCH",
        headers: authHeaders(token),
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      return res.json();
    },
    onSuccess: (_data, variables) => {
      const booking = bookings.find((candidate) => candidate.id === variables.id);
      trackEvent("booking_status_updated", {
        route: "admin",
        status: variables.status,
        city: booking?.city || "unspecified",
      });
      qc.invalidateQueries({ queryKey: ["admin-bookings"] });
    },
  });

  const updateReviewStatus = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: "approved" | "rejected" }) => {
      const res = await fetch(`${BASE}/api/reviews/${id}`, {
        method: "PATCH",
        headers: authHeaders(token),
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to update review");
      }
      return res.json();
    },
    onMutate: ({ id }) => {
      setActiveReviewAction(id);
      setReviewFeedback(null);
    },
    onSuccess: async (_data, variables) => {
      await qc.invalidateQueries({ queryKey: ["admin-reviews"] });
      setReviewFeedback({
        type: "success",
        message: `Review ${variables.status === "approved" ? "approved" : "rejected"} successfully.`,
      });
    },
    onError: (error) => {
      setReviewFeedback({
        type: "error",
        message: error instanceof Error ? error.message : "Could not update the review.",
      });
    },
    onSettled: () => {
      setActiveReviewAction(null);
    },
  });

  const bookings = bookingsQ.data ?? [];
  const contacts = contactsQ.data ?? [];
  const reviews = reviewsQ.data ?? [];
  const visibleReviews = reviewStatusFilter === "all"
    ? reviews
    : reviews.filter((review) => review.status === reviewStatusFilter);
  const pendingBookingCount = bookings.filter((b) => b.status === "pending").length;
  const pendingReviewCount = reviews.filter((review) => review.status === "pending").length;

  const confirmedCount = bookings.filter((b) => b.status === "confirmed").length;

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#3d6b5e] flex items-center justify-center">
            <span className="text-white text-xs font-bold">G</span>
          </div>
          <div>
            <h1 className="text-base font-semibold text-gray-900">Goswami Institute — Admin</h1>
            <p className="text-xs text-gray-500">goswamirehab.com</p>
          </div>
        </div>
        <button onClick={onLogout} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
          Sign out
        </button>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500">Total Bookings</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{bookings.length}</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500">Pending Bookings</p>
            <p className="text-3xl font-bold text-yellow-600 mt-1">{pendingBookingCount}</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500">Confirmed</p>
            <p className="text-3xl font-bold text-green-600 mt-1">{confirmedCount}</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500">Contact Enquiries</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{contacts.length}</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500">Pending Reviews</p>
            <p className="text-3xl font-bold text-orange-600 mt-1">{pendingReviewCount}</p>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          {(["calendar", "bookings", "contacts", "reviews"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                tab === t
                  ? "bg-[#3d6b5e] text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {t === "contacts" ? "Contact Enquiries" : t.charAt(0).toUpperCase() + t.slice(1)}
              {t === "bookings" && pendingBookingCount > 0 && (
                <span className="ml-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {pendingBookingCount}
                </span>
              )}
              {t === "reviews" && pendingReviewCount > 0 && (
                <span className="ml-2 bg-orange-400 text-orange-950 text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {pendingReviewCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {tab === "calendar" && (
          bookingsQ.isLoading
            ? <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-10 text-center text-gray-400 text-sm">Loading calendar…</div>
            : <CalendarView bookings={bookings} updateStatus={(args) => updateStatus.mutate(args)} />
        )}

        {tab === "bookings" && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {bookingsQ.isLoading ? (
              <div className="p-10 text-center text-gray-400 text-sm">Loading bookings…</div>
            ) : bookings.length === 0 ? (
              <div className="p-10 text-center text-gray-400 text-sm">No bookings yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                    <tr>
                      <th className="px-4 py-3 text-left">#</th>
                      <th className="px-4 py-3 text-left">Patient</th>
                      <th className="px-4 py-3 text-left">Contact</th>
                      <th className="px-4 py-3 text-left">Appointment</th>
                      <th className="px-4 py-3 text-left">Date</th>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {bookings.map((b) => (
                      <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-gray-400">{b.id}</td>
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {b.firstName} {b.lastName}
                          {b.notes && <p className="text-xs text-gray-400 mt-0.5 max-w-xs truncate">{b.notes}</p>}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          <div>{b.email}</div>
                          <div className="text-xs text-gray-400">{b.phone}</div>
                        </td>
                         <td className="px-4 py-3 text-gray-700">
                           <div>{b.appointmentType}</div>
                           {b.mainConcern && <div className="text-xs text-gray-400 mt-1 max-w-xs truncate">{b.mainConcern}</div>}
                         </td>
                        <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{b.preferredDate}</td>
                        <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                        <td className="px-4 py-3">
                          <select
                            value={b.status}
                            onChange={(e) => updateStatus.mutate({ id: b.id, status: e.target.value })}
                            className="text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#3d6b5e] bg-white"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="completed">Completed</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {tab === "contacts" && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {contactsQ.isLoading ? (
              <div className="p-10 text-center text-gray-400 text-sm">Loading enquiries…</div>
            ) : contacts.length === 0 ? (
              <div className="p-10 text-center text-gray-400 text-sm">No enquiries yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                    <tr>
                      <th className="px-4 py-3 text-left">#</th>
                      <th className="px-4 py-3 text-left">From</th>
                      <th className="px-4 py-3 text-left">Subject</th>
                      <th className="px-4 py-3 text-left">Message</th>
                      <th className="px-4 py-3 text-left">Received</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {contacts.map((c) => (
                      <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-gray-400">{c.id}</td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-900">{c.name}</div>
                          <div className="text-xs text-gray-400">{c.email}</div>
                          {c.phone && <div className="text-xs text-gray-400">{c.phone}</div>}
                        </td>
                        <td className="px-4 py-3 text-gray-700">{c.subject}</td>
                        <td className="px-4 py-3 text-gray-600 max-w-xs">
                          <p className="line-clamp-2">{c.message}</p>
                        </td>
                        <td className="px-4 py-3 text-gray-400 whitespace-nowrap text-xs">
                          {new Date(c.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit", month: "short", year: "numeric",
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {tab === "reviews" && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">Review moderation</h2>
                <p className="mt-1 text-xs text-gray-500">
                  Review the full submission before deciding whether it should appear publicly.
                </p>
              </div>
              <div>
                <label htmlFor="admin-review-status-filter" className="mb-1 block text-xs font-medium text-gray-600">
                  Show status
                </label>
                <select
                  id="admin-review-status-filter"
                  data-testid="admin-review-status-filter"
                  value={reviewStatusFilter}
                  onChange={(event) => setReviewStatusFilter(event.target.value as "all" | ReviewStatus)}
                  className="min-w-40 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#3d6b5e]"
                >
                  <option value="all">All reviews ({reviews.length})</option>
                  <option value="pending">Pending ({reviews.filter((review) => review.status === "pending").length})</option>
                  <option value="approved">Approved ({reviews.filter((review) => review.status === "approved").length})</option>
                  <option value="rejected">Rejected ({reviews.filter((review) => review.status === "rejected").length})</option>
                </select>
              </div>
            </div>
            {reviewsQ.isError && (
              <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                {reviewsQ.error instanceof Error ? reviewsQ.error.message : "Could not load reviews."}
              </p>
            )}
            {reviewFeedback && (
              <p
                className={`rounded-lg px-4 py-3 text-sm ${reviewFeedback.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
                role="status"
                data-testid={`admin-review-${reviewFeedback.type}-feedback`}
              >
                {reviewFeedback.message}
              </p>
            )}
            {reviewsQ.isLoading ? (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-10 text-center text-gray-400 text-sm">Loading reviews…</div>
            ) : visibleReviews.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-10 text-center text-gray-400 text-sm">No patient reviews yet.</div>
            ) : (
              visibleReviews.map((review) => (
                <article
                  key={review.id}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm p-5"
                  data-testid={`admin-review-${review.id}`}
                  data-review-status={review.status}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-3">
                        <h2 className="font-semibold text-gray-900">{review.name}</h2>
                        <StatusBadge status={review.status} />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {review.city || "Location not provided"} · {new Date(review.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                      {review.service && <p className="text-xs text-gray-500 mt-1">Service: {review.service}</p>}
                    </div>
                    <ReviewRating rating={review.rating} />
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-gray-700 whitespace-pre-line">{review.body}</p>
                  {review.status === "pending" && (
                    <div className="mt-5 flex flex-wrap gap-2 border-t border-gray-100 pt-4">
                      <button
                        type="button"
                        onClick={() => updateReviewStatus.mutate({ id: review.id, status: "approved" })}
                        disabled={updateReviewStatus.isPending}
                        data-testid={`admin-review-approve-${review.id}`}
                        className="rounded-lg bg-[#3d6b5e] px-4 py-2 text-sm font-medium text-white hover:bg-[#2e5248] disabled:opacity-50"
                      >
                        {activeReviewAction === review.id && updateReviewStatus.isPending ? "Saving…" : "Approve review"}
                      </button>
                      <button
                        type="button"
                        onClick={() => updateReviewStatus.mutate({ id: review.id, status: "rejected" })}
                        disabled={updateReviewStatus.isPending}
                        data-testid={`admin-review-reject-${review.id}`}
                        className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
                      >
                        Reject review
                      </button>
                    </div>
                  )}
                </article>
              ))
            )}
            {updateReviewStatus.isError && (
              <p className="text-sm text-red-600" role="alert">
                {updateReviewStatus.error instanceof Error ? updateReviewStatus.error.message : "Could not update the review."}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Admin() {
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem("admin_token"));
  const handleLogin = useCallback((t: string) => setToken(t), []);
  const handleLogout = useCallback(() => { sessionStorage.removeItem("admin_token"); setToken(null); }, []);

  return (
    <QueryClientProvider client={adminQueryClient}>
      <TooltipProvider>
        {!token ? <LoginScreen onLogin={handleLogin} /> : <Dashboard token={token} onLogout={handleLogout} />}
      </TooltipProvider>
    </QueryClientProvider>
  );
}
