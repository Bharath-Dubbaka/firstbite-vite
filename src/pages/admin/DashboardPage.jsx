// src/pages/admin/AdminDashboard.jsx
//
// ── SETUP NOTES ──────────────────────────────────────────────────────────────
// 1. If you get 500 errors, your BASE_URL is probably wrong.
//    In src/lib/constants.js it should be:
//      export const BASE_URL = "http://localhost:9999/api";   ← your backend
//    NOT  "http://localhost:5173/..."  (that's Vite's dev server)
//
// 2. Add to router:
//      <Route path="/admin/dashboard" element={<AdminDashboard />} />
//
// 3. Add NavLink in AdminLayout.jsx:
//      <NavLink to="/admin/dashboard" icon={<LayoutDashboard size={18} />}>
//        Dashboard
//      </NavLink>
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { BASE_URL } from "../../lib/constants";
import { useNavigate } from "react-router-dom";
import {
   IndianRupee,
   ShoppingBag,
   ChefHat,
   Table2,
   Utensils,
   CheckCircle,
   RefreshCw,
   ArrowUpRight,
   ArrowDownRight,
   Zap,
   Flame,
   Calendar,
   ChevronLeft,
   ChevronRight,
   AlertCircle,
} from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n) => Number(n || 0).toLocaleString("en-IN");
const fmtTime = (d) =>
   new Date(d).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
   });
const fmtDate = (d) =>
   new Date(d).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
   });
const isoDate = (d) => {
   // Get current date in IST
   const ist = new Date(d.getTime() + 5.5 * 60 * 60 * 1000);
   return ist.toISOString().slice(0, 10);
};
const getISTDateStr = (isoString) => {
   // createdAt comes from MongoDB as UTC ISO string
   // Add 5:30 to get IST date
   const utc = new Date(isoString);
   const ist = new Date(utc.getTime() + 5.5 * 60 * 60 * 1000);
   return ist.toISOString().slice(0, 10); // "2026-02-24"
};

// ─── Tiny SVG Sparkline ───────────────────────────────────────────────────────
function Sparkline({ data = [], color = "#6366f1" }) {
   if (data.length < 2) return null;
   const max = Math.max(...data, 1),
      min = Math.min(...data);
   const W = 72,
      H = 30;
   const pts = data
      .map((v, i) => {
         const x = (i / (data.length - 1)) * W;
         const y = H - ((v - min) / (max - min || 1)) * H * 0.85 - H * 0.07;
         return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");
   return (
      <svg width={W} height={H} className="overflow-visible opacity-80">
         <polyline
            fill="none"
            stroke={color}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={pts}
         />
      </svg>
   );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
   icon: Icon,
   label,
   value,
   sub,
   delta,
   color,
   spark,
   onClick,
}) {
   const positive = delta > 0;
   return (
      <div
         onClick={onClick}
         className={`bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-3 transition-all hover:shadow-md ${onClick ? "cursor-pointer hover:-translate-y-0.5" : ""}`}
      >
         <div className="flex items-start justify-between">
            <div
               className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}
            >
               <Icon size={17} className="text-white" />
            </div>
            {spark && <Sparkline data={spark} />}
         </div>
         <div>
            <div className="text-2xl font-black text-gray-900 tracking-tight leading-none">
               {value}
            </div>
            <div className="text-[11px] text-gray-500 font-medium mt-1">
               {label}
            </div>
         </div>
         {(sub || delta !== undefined) && (
            <div className="flex items-center gap-2 border-t border-gray-50 pt-2">
               {delta !== undefined && delta !== null && (
                  <span
                     className={`flex items-center gap-0.5 text-[11px] font-bold ${positive ? "text-emerald-600" : "text-red-500"}`}
                  >
                     {positive ? (
                        <ArrowUpRight size={11} />
                     ) : (
                        <ArrowDownRight size={11} />
                     )}
                     {Math.abs(delta)}% vs prev day
                  </span>
               )}
               {sub && <span className="text-[11px] text-gray-400">{sub}</span>}
            </div>
         )}
      </div>
   );
}

// ─── Date Navigator ───────────────────────────────────────────────────────────
function DateNav({ selected, onChange }) {
   const today = isoDate(new Date());

   const shift = (days) => {
      const d = new Date(selected);
      d.setDate(d.getDate() + days);
      if (d > new Date()) return;
      onChange(isoDate(d));
   };

   const presets = [
      { label: "Today", value: isoDate(new Date()) },
      { label: "Yesterday", value: isoDate(new Date(Date.now() - 86400000)) },
      {
         label: "2 days ago",
         value: isoDate(new Date(Date.now() - 2 * 86400000)),
      },
   ];

   return (
      <div className="flex items-center gap-2 flex-wrap">
         {presets.map((p) => (
            <button
               key={p.value}
               onClick={() => onChange(p.value)}
               className={`text-[11px] font-bold px-3 py-1.5 rounded-lg border transition-all ${
                  selected === p.value
                     ? "bg-indigo-600 text-white border-indigo-600"
                     : "bg-white text-gray-600 border-gray-200 hover:border-indigo-400 hover:text-indigo-600"
               }`}
            >
               {p.label}
            </button>
         ))}

         {/* Custom date picker with prev/next arrows */}
         <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg px-2 py-1 hover:border-indigo-300 transition-colors">
            <button
               onClick={() => shift(-1)}
               className="text-gray-400 hover:text-gray-700 transition-colors p-0.5"
            >
               <ChevronLeft size={13} />
            </button>
            <input
               type="date"
               value={selected}
               max={today}
               onChange={(e) => e.target.value && onChange(e.target.value)}
               className="text-[11px] font-bold text-gray-700 border-none outline-none bg-transparent cursor-pointer w-28"
            />
            <button
               onClick={() => shift(1)}
               disabled={selected === today}
               className="text-gray-400 hover:text-gray-700 transition-colors p-0.5 disabled:opacity-25"
            >
               <ChevronRight size={13} />
            </button>
         </div>
      </div>
   );
}

// ─── Bar Chart (14-day revenue) ───────────────────────────────────────────────
function BarChart({ data }) {
   if (!data?.length)
      return (
         <div className="h-28 flex items-center justify-center text-xs text-gray-400">
            No data
         </div>
      );
   const max = Math.max(...data.map((d) => d.amount), 1);
   return (
      <div className="flex items-end gap-1 h-28 w-full">
         {data.map((d, i) => (
            <div
               key={i}
               className="flex-1 flex flex-col items-center gap-1 group"
            >
               <div className="relative w-full">
                  <div
                     className={`w-full rounded-t transition-all duration-300 ${d.isSelected ? "bg-indigo-700" : "bg-indigo-400 hover:bg-indigo-500"}`}
                     style={{
                        height: `${Math.max((d.amount / max) * 96, 3)}px`,
                     }}
                  />
                  <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[9px] px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 text-center">
                     ₹{fmt(d.amount)}
                     <br />
                     {d.orders} orders
                  </div>
               </div>
               <span
                  className={`text-[8px] font-bold leading-none text-center ${d.isSelected ? "text-indigo-700" : "text-gray-400"}`}
               >
                  {d.label}
               </span>
            </div>
         ))}
      </div>
   );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
   const map = {
      placed: "bg-blue-50   text-blue-700   border-blue-200",
      confirmed: "bg-yellow-50 text-yellow-700 border-yellow-200",
      preparing: "bg-orange-50 text-orange-700 border-orange-200",
      ready: "bg-purple-50 text-purple-700 border-purple-200",
      served: "bg-indigo-50 text-indigo-700 border-indigo-200",
      billing: "bg-pink-50   text-pink-700   border-pink-200",
      completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
      cancelled: "bg-red-50    text-red-700    border-red-200",
      delivered: "bg-green-50  text-green-700  border-green-200",
   };
   return (
      <span
         className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${map[status] || "bg-gray-50 text-gray-500 border-gray-200"}`}
      >
         {status?.toUpperCase()}
      </span>
   );
}

// ─── Kitchen Progress Card ────────────────────────────────────────────────────
function KitchenCard({ order }) {
   const total = order.items.length;
   const done = order.items.filter(
      (i) => i.status === "ready" || i.status === "served",
   ).length;
   const pct = total ? Math.round((done / total) * 100) : 0;
   const ageMin = Math.floor((Date.now() - new Date(order.createdAt)) / 60000);
   const urgency =
      ageMin > 20
         ? "text-red-600 bg-red-50"
         : ageMin > 10
           ? "text-orange-600 bg-orange-50"
           : "text-emerald-600 bg-emerald-50";

   return (
      <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 hover:border-indigo-200 transition-colors">
         <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
               <span className="font-bold text-sm text-gray-800">
                  {order.tableNumber ? `T-${order.tableNumber}` : "Online"}
               </span>
               <StatusBadge status={order.orderStatus} />
            </div>
            <span
               className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${urgency}`}
            >
               {ageMin < 1 ? "Just now" : `${ageMin}m ago`}
            </span>
         </div>
         <div className="flex items-center gap-2 mb-2">
            <div className="flex-1 bg-gray-200 rounded-full h-1.5">
               <div
                  className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
               />
            </div>
            <span className="text-[10px] text-gray-500 font-medium">
               {done}/{total} ready
            </span>
         </div>
         <div className="flex flex-wrap gap-1">
            {order.items.slice(0, 5).map((item, idx) => (
               <span
                  key={idx}
                  className={`text-[9px] px-1.5 py-0.5 rounded border font-medium ${
                     item.status === "ready" || item.status === "served"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : item.status === "preparing"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-gray-100 text-gray-500 border-gray-200"
                  }`}
               >
                  {item.quantity}× {item.name}
               </span>
            ))}
            {order.items.length > 5 && (
               <span className="text-[9px] text-gray-400">
                  +{order.items.length - 5}
               </span>
            )}
         </div>
      </div>
   );
}

// ─── Floor Grid ───────────────────────────────────────────────────────────────
function FloorGrid({ tables, navigate }) {
   if (!tables.length)
      return (
         <p className="text-gray-400 text-xs text-center py-8">
            No tables configured
         </p>
      );
   return (
      <div className="grid grid-cols-5 sm:grid-cols-7 lg:grid-cols-9 gap-2">
         {tables.map((t) => (
            <button
               key={t._id}
               title={
                  t.status === "occupied"
                     ? `₹${t.currentOrderId?.totalAmount || 0} · ${t.currentOrderId?.orderStatus || ""}`
                     : `Available · ${t.capacity} seats`
               }
               onClick={() =>
                  t.status === "available"
                     ? navigate("/admin/pos", {
                          state: { tableNumber: t.tableNumber },
                       })
                     : navigate("/admin/orders")
               }
               className={`aspect-square rounded-xl flex flex-col items-center justify-center text-[11px] font-bold border-2 transition-all hover:scale-105 active:scale-95 relative
            ${
               t.status === "available"
                  ? "bg-emerald-50 border-emerald-400 text-emerald-700"
                  : t.status === "occupied"
                    ? "bg-red-50    border-red-400    text-red-700"
                    : t.status === "reserved"
                      ? "bg-blue-50   border-blue-400   text-blue-700"
                      : "bg-gray-100 border-gray-300 text-gray-400"
            }`}
            >
               <span className="text-sm leading-none">T{t.tableNumber}</span>
               <span className="text-[9px] opacity-60 mt-0.5">
                  {t.capacity}p
               </span>
               {t.status === "occupied" && (
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
               )}
            </button>
         ))}
      </div>
   );
}

// ─── Order Status Funnel ──────────────────────────────────────────────────────
function OrderFunnel({ orders }) {
   const statuses = [
      "confirmed",
      "preparing",
      "ready",
      "served",
      "billing",
      "completed",
      "cancelled",
   ];
   const counts = statuses
      .map((s) => ({ s, n: orders.filter((o) => o.orderStatus === s).length }))
      .filter((x) => x.n > 0);

   if (!counts.length)
      return (
         <p className="text-gray-400 text-xs text-center py-8">
            No orders for this date
         </p>
      );

   const max = Math.max(...counts.map((x) => x.n), 1);
   const colors = {
      confirmed: "bg-yellow-400",
      preparing: "bg-orange-400",
      ready: "bg-purple-400",
      served: "bg-indigo-400",
      billing: "bg-pink-400",
      completed: "bg-emerald-500",
      cancelled: "bg-red-400",
   };

   return (
      <div className="space-y-2.5">
         {counts.map(({ s, n }) => (
            <div key={s} className="flex items-center gap-3">
               <span className="text-[10px] font-bold text-gray-500 w-20 text-right capitalize shrink-0">
                  {s}
               </span>
               <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                  <div
                     className={`h-full rounded-full transition-all duration-700 ${colors[s] || "bg-gray-400"}`}
                     style={{ width: `${(n / max) * 100}%` }}
                  />
               </div>
               <span className="text-[11px] font-black text-gray-700 w-5 shrink-0">
                  {n}
               </span>
            </div>
         ))}
      </div>
   );
}

// ─── Live Clock ───────────────────────────────────────────────────────────────
function LiveClock() {
   const [now, setNow] = useState(new Date());
   useEffect(() => {
      const t = setInterval(() => setNow(new Date()), 1000);
      return () => clearInterval(t);
   }, []);
   return (
      <div className="text-right hidden sm:block">
         <div className="text-base font-black text-gray-800 tabular-nums leading-none">
            {now.toLocaleTimeString("en-IN", {
               hour: "2-digit",
               minute: "2-digit",
               second: "2-digit",
            })}
         </div>
         <div className="text-[10px] text-gray-400 mt-0.5">
            {now.toLocaleDateString("en-IN", {
               weekday: "short",
               day: "numeric",
               month: "short",
            })}
         </div>
      </div>
   );
}

// ─────────────────────────────────────────────────────────────────────────────
//  MAIN DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
   const navigate = useNavigate();

   const [selectedDate, setSelectedDate] = useState(isoDate(new Date()));
   const [allOrders, setAllOrders] = useState([]);
   const [tables, setTables] = useState([]);
   const [kitchenOrders, setKitchenOrders] = useState([]);
   const [loading, setLoading] = useState(true);
   const [refreshing, setRefreshing] = useState(false);
   const [error, setError] = useState("");
   const [lastRefresh, setLastRefresh] = useState(new Date());

   const token = () => localStorage.getItem("adminToken");
   const cfg = () => ({ headers: { Authorization: `Bearer ${token()}` } });

   const fetchAll = useCallback(async (silent = false) => {
      if (!silent) setLoading(true);
      else setRefreshing(true);
      setError("");

      const [ordersRes, tablesRes, kitchenRes] = await Promise.allSettled([
         axios.get(`${BASE_URL}/admin/orders`, cfg()),
         axios.get(`${BASE_URL}/admin/inhouse/tables`, cfg()),
         axios.get(`${BASE_URL}/admin/inhouse/kitchen-display`, cfg()),
      ]);

      if (ordersRes.status === "fulfilled") {
         setAllOrders(ordersRes.value.data.data || []);
      } else {
         const msg =
            ordersRes.reason?.response?.data?.error ||
            ordersRes.reason?.message ||
            "Unknown error";
         setError(
            `Could not load orders: ${msg}. Check that BASE_URL in constants.js points to your backend (e.g. http://localhost:9999/api)`,
         );
      }
      if (tablesRes.status === "fulfilled")
         setTables(tablesRes.value.data.data || []);
      if (kitchenRes.status === "fulfilled")
         setKitchenOrders(kitchenRes.value.data.data || []);

      setLastRefresh(new Date());
      setLoading(false);
      setRefreshing(false);
   }, []);

   useEffect(() => {
      fetchAll();
   }, [fetchAll]);
   useEffect(() => {
      const t = setInterval(() => fetchAll(true), 45000);
      return () => clearInterval(t);
   }, [fetchAll]);

   // ── Compute stats for selected date ──────────────────────────────────────
   const isToday = selectedDate === isoDate(new Date());

   const dayOrders = allOrders.filter(
      (o) => getISTDateStr(o.createdAt) === selectedDate,
   );

   // Just subtract 1 day from the string directly — no timezone math needed
   const [sy, sm, sd] = selectedDate.split("-").map(Number);
   const prevDateObj = new Date(Date.UTC(sy, sm - 1, sd - 1));
   const prevDate = prevDateObj.toISOString().slice(0, 10); // "2026-02-23"
   const prevOrders = allOrders.filter(
      (o) => getISTDateStr(o.createdAt) === prevDate,
   );

   const dayRevenue = dayOrders
      .filter((o) => o.paymentStatus === "completed")
      .reduce((s, o) => s + (o.finalAmount || 0), 0);
   const prevRevenue = prevOrders
      .filter((o) => o.paymentStatus === "completed")
      .reduce((s, o) => s + (o.finalAmount || 0), 0);
   const revDelta = prevRevenue
      ? Math.round(((dayRevenue - prevRevenue) / prevRevenue) * 100)
      : null;

   const orderDelta = prevOrders.length
      ? Math.round(
           ((dayOrders.length - prevOrders.length) / prevOrders.length) * 100,
        )
      : null;

   const completedOrders = dayOrders.filter(
      (o) => o.paymentStatus === "completed",
   ).length;
   const cancelledOrders = dayOrders.filter(
      (o) => o.orderStatus === "cancelled",
   ).length;
   const pendingPayments = dayOrders.filter(
      (o) => o.paymentStatus === "pending" && o.orderStatus !== "cancelled",
   ).length;
   const inhouseCount = dayOrders.filter(
      (o) => o.orderSource === "in-house",
   ).length;
   const onlineCount = dayOrders.filter(
      (o) => o.orderSource === "online",
   ).length;
   const avgOrderValue = completedOrders
      ? Math.round(dayRevenue / completedOrders)
      : 0;

   // 14-day revenue chart
   const barChart14 = Array.from({ length: 14 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (13 - i));
      const dateStr = isoDate(d);
      const ds = new Date(d);
      ds.setHours(0, 0, 0, 0);
      const de = new Date(d);
      de.setHours(23, 59, 59, 999);
      const dayOs = allOrders.filter(
         (o) => getISTDateStr(o.createdAt) === dateStr,
      );
      return {
         label: d.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
         }),
         amount: dayOs
            .filter((o) => o.paymentStatus === "completed")
            .reduce((s, o) => s + (o.finalAmount || 0), 0),
         orders: dayOs.length,
         isSelected: dateStr === selectedDate,
      };
   });

   // Sparkline (14 days of revenue)
   const spark14 = barChart14.map((d) => d.amount);

   // Top items for selected day
   const itemMap = {};
   dayOrders.forEach((o) => {
      (o.items || []).forEach((i) => {
         const name = i.name || i.menuItem?.name || "Unknown";
         itemMap[name] = (itemMap[name] || 0) + (i.quantity || 1);
      });
   });
   const topItems = Object.entries(itemMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 7);

   // Table counts
   const occupiedTables = tables.filter((t) => t.status === "occupied").length;
   const availableTables = tables.filter(
      (t) => t.status === "available",
   ).length;

   // Kitchen urgency
   const urgentKitchen = kitchenOrders.filter((o) =>
      o.items.some((i) => i.status === "pending" || i.status === "preparing"),
   ).length;

   // ── Render ────────────────────────────────────────────────────────────────
   if (loading)
      return (
         <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-3">
               <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
               <p className="text-gray-500 text-sm font-medium">
                  Loading dashboard…
               </p>
            </div>
         </div>
      );

   return (
      <div className="space-y-5 pb-12">
         {/* ── Header ────────────────────────────────────────────────────── */}
         <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
               <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                  Dashboard
               </h1>
               <p className="text-[11px] text-gray-400 mt-0.5">
                  {isToday
                     ? "Live · today"
                     : `Viewing ${new Date(selectedDate).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}`}
                  {refreshing && (
                     <span className="ml-2 text-indigo-500 animate-pulse">
                        · syncing…
                     </span>
                  )}
                  {!refreshing && (
                     <span className="ml-2">
                        · last sync{" "}
                        {lastRefresh.toLocaleTimeString("en-IN", {
                           hour: "2-digit",
                           minute: "2-digit",
                        })}
                     </span>
                  )}
               </p>
            </div>
            <div className="flex items-center gap-3">
               <LiveClock />
               <button
                  onClick={() => fetchAll(true)}
                  disabled={refreshing}
                  className="flex items-center gap-1.5 text-[11px] px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-40 font-medium"
               >
                  <RefreshCw
                     size={11}
                     className={refreshing ? "animate-spin" : ""}
                  />{" "}
                  Refresh
               </button>
            </div>
         </div>

         {/* ── Date Navigator ──────────────────────────────────────────────── */}
         <div className="bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-sm flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-2 shrink-0">
               <Calendar size={14} className="text-indigo-500" />
               <span className="text-[11px] font-bold text-gray-600">
                  Date:
               </span>
            </div>
            <DateNav selected={selectedDate} onChange={setSelectedDate} />
            {!isToday && (
               <span className="text-[10px] text-amber-600 bg-amber-50 border border-amber-200 px-2 py-1 rounded-lg font-medium ml-auto shrink-0">
                  📅 Historical view — floor & kitchen still show live data
               </span>
            )}
         </div>

         {/* ── Error Banner ────────────────────────────────────────────────── */}
         {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm flex items-start gap-2">
               <AlertCircle size={15} className="shrink-0 mt-0.5" />
               <span>{error}</span>
            </div>
         )}

         {/* ── Stat Cards ──────────────────────────────────────────────────── */}
         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
               icon={IndianRupee}
               label={
                  isToday
                     ? "Today's Revenue"
                     : `Revenue · ${new Date(selectedDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`
               }
               value={`₹${fmt(dayRevenue)}`}
               delta={revDelta}
               sub={
                  revDelta === null ? undefined : `prev: ₹${fmt(prevRevenue)}`
               }
               color="bg-indigo-500"
               spark={spark14}
            />
            <StatCard
               icon={ShoppingBag}
               label={isToday ? "Today's Orders" : "Orders on this day"}
               value={dayOrders.length}
               delta={orderDelta}
               sub={`${completedOrders} paid · ${cancelledOrders} cancelled`}
               color="bg-orange-500"
            />
            <StatCard
               icon={Table2}
               label="Live Tables (now)"
               value={`${occupiedTables}/${tables.length}`}
               sub={`${availableTables} available right now`}
               color={
                  occupiedTables > availableTables
                     ? "bg-red-500"
                     : "bg-emerald-500"
               }
               onClick={() => navigate("/admin/tables")}
            />
            <StatCard
               icon={ChefHat}
               label="Kitchen Queue (live)"
               value={kitchenOrders.length}
               sub={
                  urgentKitchen > 0
                     ? `${urgentKitchen} orders need attention`
                     : "All on track"
               }
               color={
                  urgentKitchen > 3
                     ? "bg-red-500"
                     : urgentKitchen > 0
                       ? "bg-orange-500"
                       : "bg-emerald-500"
               }
               onClick={() => navigate("/admin/kitchen")}
            />
         </div>

         {/* ── Secondary metrics ───────────────────────────────────────────── */}
         <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
               {
                  label: "Avg Order Value",
                  value: `₹${fmt(avgOrderValue)}`,
                  color: "text-indigo-700 bg-indigo-50  border-indigo-100",
               },
               {
                  label: "Pending Payments",
                  value: pendingPayments,
                  color: "text-amber-700  bg-amber-50   border-amber-100",
               },
               {
                  label: "In-house Orders",
                  value: inhouseCount,
                  color: "text-blue-700   bg-blue-50    border-blue-100",
               },
               {
                  label: "Online Orders",
                  value: onlineCount,
                  color: "text-orange-700 bg-orange-50  border-orange-100",
               },
            ].map((s) => (
               <div
                  key={s.label}
                  className={`${s.color} border rounded-xl px-4 py-3 flex items-center justify-between`}
               >
                  <span className="text-[11px] font-semibold opacity-80">
                     {s.label}
                  </span>
                  <span className="text-xl font-black">{s.value}</span>
               </div>
            ))}
         </div>

         {/* ── Revenue Chart + Order Funnel ─────────────────────────────────── */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 lg:col-span-2">
               <div className="flex items-center justify-between mb-4">
                  <div>
                     <h2 className="font-bold text-gray-800 text-sm">
                        Revenue — Last 14 Days
                     </h2>
                     <p className="text-[10px] text-gray-400">
                        Completed payments only · darker bar = selected date
                     </p>
                  </div>
                  <span className="text-xs font-black text-indigo-700 bg-indigo-50 px-2 py-1 rounded-lg">
                     ₹{fmt(spark14.reduce((a, b) => a + b, 0))} total
                  </span>
               </div>
               <BarChart data={barChart14} />
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
               <div className="mb-4">
                  <h2 className="font-bold text-gray-800 text-sm">
                     Order Status
                  </h2>
                  <p className="text-[10px] text-gray-400">
                     {isToday
                        ? "Today"
                        : new Date(selectedDate).toLocaleDateString("en-IN", {
                             day: "numeric",
                             month: "short",
                          })}{" "}
                     · {dayOrders.length} total
                  </p>
               </div>
               <OrderFunnel orders={dayOrders} />
            </div>
         </div>

         {/* ── Floor Plan + Kitchen ─────────────────────────────────────────── */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
               <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                     <h2 className="font-bold text-gray-800 text-sm">
                        Floor Plan
                     </h2>
                     <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                        {availableTables} free
                     </span>
                     <span className="text-[10px] bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded-full font-bold">
                        {occupiedTables} busy
                     </span>
                  </div>
                  <button
                     onClick={() => navigate("/admin/tables")}
                     className="text-[10px] text-indigo-600 font-bold flex items-center gap-1 hover:underline"
                  >
                     Manage <ArrowUpRight size={10} />
                  </button>
               </div>
               <FloorGrid tables={tables} navigate={navigate} />
               <p className="text-[9px] text-gray-400 mt-3">
                  🟢 Tap free table → opens POS &nbsp;·&nbsp; 🔴 Tap occupied →
                  view orders
               </p>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
               <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                     <h2 className="font-bold text-gray-800 text-sm">
                        Live Kitchen Queue
                     </h2>
                     {urgentKitchen > 0 && (
                        <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full font-bold animate-pulse">
                           {urgentKitchen} urgent
                        </span>
                     )}
                  </div>
                  <button
                     onClick={() => navigate("/admin/kitchen")}
                     className="text-[10px] text-indigo-600 font-bold flex items-center gap-1 hover:underline"
                  >
                     Full KDS <ArrowUpRight size={10} />
                  </button>
               </div>
               {kitchenOrders.length ? (
                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                     {[...kitchenOrders]
                        .sort(
                           (a, b) =>
                              new Date(a.createdAt) - new Date(b.createdAt),
                        )
                        .map((o) => (
                           <KitchenCard key={o._id} order={o} />
                        ))}
                  </div>
               ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                     <CheckCircle size={28} className="text-emerald-400 mb-2" />
                     <p className="text-sm font-semibold">Kitchen is clear</p>
                     <p className="text-xs">No active orders right now</p>
                  </div>
               )}
            </div>
         </div>

         {/* ── Top Items + Orders Table ─────────────────────────────────────── */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
               <div className="flex items-center gap-2 mb-4">
                  <Flame size={14} className="text-orange-500" />
                  <h2 className="font-bold text-gray-800 text-sm">Top Items</h2>
                  <span className="text-[10px] text-gray-400 ml-auto">
                     {isToday
                        ? "Today"
                        : new Date(selectedDate).toLocaleDateString("en-IN", {
                             day: "numeric",
                             month: "short",
                          })}
                  </span>
               </div>
               {topItems.length ? (
                  <div className="space-y-3">
                     {topItems.map(([name, count], i) => {
                        const pct = Math.round(
                           (count / (topItems[0]?.[1] || 1)) * 100,
                        );
                        return (
                           <div key={name} className="flex items-center gap-2">
                              <span
                                 className={`text-[10px] font-black w-4 text-center shrink-0 ${
                                    i === 0
                                       ? "text-yellow-500"
                                       : i === 1
                                         ? "text-gray-400"
                                         : i === 2
                                           ? "text-orange-400"
                                           : "text-gray-300"
                                 }`}
                              >
                                 #{i + 1}
                              </span>
                              <div className="flex-1 min-w-0">
                                 <div className="flex justify-between items-center mb-1">
                                    <span className="text-[11px] font-semibold text-gray-700 truncate max-w-[130px]">
                                       {name}
                                    </span>
                                    <span className="text-[11px] font-black text-gray-700 shrink-0 ml-1">
                                       {count}
                                    </span>
                                 </div>
                                 <div className="w-full bg-gray-100 rounded-full h-1.5">
                                    <div
                                       className="bg-indigo-400 h-1.5 rounded-full"
                                       style={{ width: `${pct}%` }}
                                    />
                                 </div>
                              </div>
                           </div>
                        );
                     })}
                  </div>
               ) : (
                  <p className="text-gray-400 text-xs text-center py-8">
                     No orders for this date
                  </p>
               )}
            </div>

            {/* Orders table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
               <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100">
                  <h2 className="font-bold text-gray-800 text-sm">
                     {isToday
                        ? "Today's Orders"
                        : `Orders · ${new Date(selectedDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`}
                     <span className="ml-2 text-[10px] text-gray-400 font-normal">
                        {dayOrders.length} total
                     </span>
                  </h2>
                  <button
                     onClick={() => navigate("/admin/orders")}
                     className="text-[10px] text-indigo-600 font-bold flex items-center gap-1 hover:underline"
                  >
                     All orders <ArrowUpRight size={10} />
                  </button>
               </div>

               {/* Mobile */}
               <div className="md:hidden divide-y divide-gray-50 max-h-64 overflow-y-auto">
                  {dayOrders.length ? (
                     dayOrders.map((o) => (
                        <div
                           key={o._id}
                           className="px-4 py-3 flex items-center justify-between gap-3"
                        >
                           <div className="min-w-0">
                              <p className="text-xs font-bold text-gray-800 truncate font-mono">
                                 #{o.orderNumber.slice(-8)}
                              </p>
                              <p className="text-[10px] text-gray-400">
                                 {o.orderSource === "in-house"
                                    ? `T-${o.tableNumber}`
                                    : "Online"}{" "}
                                 · {fmtTime(o.createdAt)}
                              </p>
                           </div>
                           <StatusBadge status={o.orderStatus} />
                           <span className="text-sm font-black text-indigo-700 whitespace-nowrap">
                              ₹{fmt(o.finalAmount)}
                           </span>
                        </div>
                     ))
                  ) : (
                     <p className="text-center text-gray-400 text-xs py-10">
                        No orders on this date
                     </p>
                  )}
               </div>

               {/* Desktop */}
               <div className="hidden md:block overflow-x-auto max-h-72 overflow-y-auto">
                  <table className="w-full text-sm">
                     <thead className="sticky top-0 z-10 bg-white">
                        <tr className="text-[10px] text-gray-400 uppercase font-bold bg-gray-50/80">
                           {[
                              "Order #",
                              "Source",
                              "Customer",
                              "Items",
                              "Status",
                              "Payment",
                              "Amount",
                              "Time",
                           ].map((h) => (
                              <th
                                 key={h}
                                 className={`px-4 py-2.5 ${h === "Amount" || h === "Time" ? "text-right" : "text-left"}`}
                              >
                                 {h}
                              </th>
                           ))}
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-50">
                        {dayOrders.map((o) => (
                           <tr
                              key={o._id}
                              className="hover:bg-gray-50/50 transition-colors"
                           >
                              <td className="px-4 py-2.5">
                                 <span className="font-bold text-[11px] text-gray-700 font-mono">
                                    #{o.orderNumber.slice(-8)}
                                 </span>
                              </td>
                              <td className="px-4 py-2.5">
                                 <span
                                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                       o.orderSource === "in-house"
                                          ? "bg-indigo-50 text-indigo-700"
                                          : "bg-orange-50 text-orange-700"
                                    }`}
                                 >
                                    {o.orderSource === "in-house"
                                       ? `T-${o.tableNumber}`
                                       : "Online"}
                                 </span>
                              </td>
                              <td className="px-4 py-2.5 text-[11px] text-gray-600 max-w-[110px] truncate">
                                 {o.customerName || o.userId?.name || "—"}
                              </td>
                              <td className="px-4 py-2.5 text-[11px] text-gray-500">
                                 {o.items?.length || 0} item
                                 {o.items?.length !== 1 ? "s" : ""}
                              </td>
                              <td className="px-4 py-2.5">
                                 <StatusBadge status={o.orderStatus} />
                              </td>
                              <td className="px-4 py-2.5">
                                 <span
                                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                       o.paymentStatus === "completed"
                                          ? "text-emerald-700 bg-emerald-50"
                                          : o.paymentStatus === "pending"
                                            ? "text-yellow-700 bg-yellow-50"
                                            : "text-red-700 bg-red-50"
                                    }`}
                                 >
                                    {o.paymentStatus?.toUpperCase()}
                                 </span>
                              </td>
                              <td className="px-4 py-2.5 text-right font-black text-[12px] text-gray-800">
                                 ₹{fmt(o.finalAmount)}
                              </td>
                              <td className="px-4 py-2.5 text-right text-[10px] text-gray-400">
                                 {fmtTime(o.createdAt)}
                              </td>
                           </tr>
                        ))}
                        {!dayOrders.length && (
                           <tr>
                              <td
                                 colSpan={8}
                                 className="text-center text-gray-400 text-xs py-10"
                              >
                                 No orders on this date
                              </td>
                           </tr>
                        )}
                     </tbody>
                  </table>
               </div>
            </div>
         </div>

         {/* ── Quick Actions ────────────────────────────────────────────────── */}
         <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
               {
                  label: "Open POS",
                  sub: "Punch a new order",
                  icon: Zap,
                  to: "/admin/pos",
                  bg: "bg-indigo-600 hover:bg-indigo-700",
               },
               {
                  label: "Kitchen",
                  sub: "Live KDS view",
                  icon: ChefHat,
                  to: "/admin/kitchen",
                  bg: "bg-orange-500 hover:bg-orange-600",
               },
               {
                  label: "All Orders",
                  sub: "Search & manage",
                  icon: ShoppingBag,
                  to: "/admin/orders",
                  bg: "bg-gray-800   hover:bg-gray-900",
               },
               {
                  label: "Menu Manager",
                  sub: "Items & availability",
                  icon: Utensils,
                  to: "/admin/menu",
                  bg: "bg-emerald-600 hover:bg-emerald-700",
               },
            ].map(({ label, sub, icon: Icon, to, bg }) => (
               <button
                  key={to}
                  onClick={() => navigate(to)}
                  className={`${bg} text-white rounded-xl p-4 text-left transition-all hover:shadow-lg active:scale-95`}
               >
                  <Icon size={18} className="mb-2 opacity-80" />
                  <p className="font-bold text-sm">{label}</p>
                  <p className="text-[10px] opacity-60 mt-0.5">{sub}</p>
               </button>
            ))}
         </div>
      </div>
   );
}
