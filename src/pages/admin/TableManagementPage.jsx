import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../lib/constants";
import { Users, Clock, ReceiptIndianRupee } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TableManagementPage() {
   const [tables, setTables] = useState([]);
   const [summary, setSummary] = useState({});
   const [loading, setLoading] = useState(true);
   const navigate = useNavigate();

   useEffect(() => {
      fetchTables();
   }, []);

   const fetchTables = async () => {
      try {
         const token = localStorage.getItem("adminToken");
         const res = await axios.get(`${BASE_URL}/admin/inhouse/tables`, {
            headers: { Authorization: `Bearer ${token}` },
         });
         setTables(res.data.data);
         setSummary(res.data.summary);
      } catch (err) {
         console.error("Error fetching tables", err);
      } finally {
         setLoading(false);
      }
   };

   const getStatusColor = (status) => {
      switch (status) {
         case "available":
            return "bg-green-100 border-green-500 text-green-700";
         case "occupied":
            return "bg-red-100 border-red-500 text-red-700";
         case "reserved":
            return "bg-blue-100 border-blue-500 text-blue-700";
         default:
            return "bg-gray-100 border-gray-400";
      }
   };

   const forceClearTable = async (tableNumber) => {
      if (
         !window.confirm(
            `Force reset Table ${tableNumber}? This will clear any active order link.`,
         )
      ) {
         return;
      }

      try {
         const token = localStorage.getItem("adminToken");
         await axios.post(
            `${BASE_URL}/admin/inhouse/tables/${tableNumber}/force-reset`,
            {},
            { headers: { Authorization: `Bearer ${token}` } },
         );
         toast.success(`Table ${tableNumber} force reset!`);
         fetchTables();
      } catch (err) {
         toast.error("Force reset failed");
      }
   };

   return (
      <div className="p-2 md:p-6">
         <div className="flex justify-between items-end mb-8">
            <div>
               <h1 className="text-3xl font-bold text-gray-800">Floor Plan</h1>
               <div className="flex gap-4 mt-2">
                  <span className="text-sm bg-green-100 px-2 py-1 rounded">
                     Free: {summary.available}
                  </span>
                  <span className="text-sm bg-red-100 px-2 py-1 rounded">
                     Occupied: {summary.occupied}
                  </span>
               </div>
            </div>
            <button
               onClick={fetchTables}
               className="p-2 border rounded hover:bg-white transition-colors"
            >
               🔄 Refresh
            </button>
         </div>

         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {tables.map((table) => (
               <div
                  key={table._id}
                  onClick={() =>
                     table.status === "available"
                        ? navigate("/admin/pos", {
                             state: { tableNumber: table.tableNumber },
                          })
                        : null
                  }
                  className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer hover:shadow-lg ${getStatusColor(table.status)}`}
               >
                  <div className="text-2xl font-bold mb-1 flex justify-between">
                     <span>T-{table.tableNumber}</span>
                     {table.status === "occupied" && (
                        <button
                           onClick={(e) => {
                              e.stopPropagation();
                              forceClearTable(table.tableNumber);
                           }}
                           className="text-[8px] bg-white/50 px-1 rounded hover:bg-red-500 hover:text-white"
                        >
                           RESET
                        </button>
                     )}
                  </div>
                  <div className="flex items-center text-xs gap-1">
                     <Users size={12} /> {table.capacity} Seats
                  </div>

                  {table.status === "occupied" && (
                     <div className="mt-4 pt-4 border-t border-red-200">
                        <div className="flex items-center gap-1 text-sm font-semibold">
                           <ReceiptIndianRupee size={14} /> ₹
                           {table.currentOrderId?.totalAmount || 0}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] mt-1 opacity-70">
                           <Clock size={10} />{" "}
                           {new Date(
                              table.currentOrderId?.createdAt,
                           ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                           })}
                        </div>
                     </div>
                  )}

                  <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-current"></div>
               </div>
            ))}
         </div>
      </div>
   );
}
