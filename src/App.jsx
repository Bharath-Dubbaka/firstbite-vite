// src/App.jsx
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

//for ✅ Global authentication state management / ✅ Handles redirect results at app level / ✅ Sets up global auth listeners
// import AuthHandler from "./components/AuthHandler";

// Import your page components (we will create/move these next)
import Home from "./pages/Home";
import About from "./pages/About";
import HowItWorks from "./pages/HowItWorks";
import BookUs from "./pages/BookUs";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import Orders from "./pages/Order";
import OrderDetails from "./pages/OrderDetails";

// Admin pages
import AdminLayout from "./pages/admin/AdminLayout";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/DashboardPage";
import AdminMenu from "./pages/admin/MenuManagementPage";
import AdminOrders from "./pages/admin/OrderManagementPage";
import TableManagementPage from "./pages/admin/TableManagementPage";
import InhousePOSPage from "./pages/admin/InhousePOSPage";
import KitchenDisplayPage from "./pages/admin/KitchenDisplayPage";
import TaxConfigPage from "./pages/admin/TaxConfigPage";

// This layout includes the Header and Footer for all public-facing pages
const MainLayout = () => (
   <>
      <Header />
      <main>
         <Outlet /> {/* Child routes will render here */}
      </main>
      <Footer />
   </>
);

function App() {
   return (
      <BrowserRouter>
         <Routes>
            {/* Public Routes */}
            <Route path="/" element={<MainLayout />}>
               <Route index element={<Home />} />
               <Route path="about" element={<About />} />
               <Route path="howitworks" element={<HowItWorks />} />
               <Route path="bookus" element={<BookUs />} />
               <Route path="contact" element={<Contact />} />
               <Route path="login" element={<Login />} />
               <Route path="cart" element={<Cart />} />
               <Route path="orders" element={<Orders />} />
               <Route path="orders/:id" element={<OrderDetails />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
               {/* <Route path="dashboard" element={<AdminDashboard />} /> */}
               <Route path="dashboard" element={<AdminDashboard />} />
               <Route path="menu" element={<AdminMenu />} />
               <Route path="orders" element={<AdminOrders />} />
               <Route path="tables" element={<TableManagementPage />} />
               <Route path="pos" element={<InhousePOSPage />} />
               <Route path="kitchen" element={<KitchenDisplayPage />} />
               <Route path="tax-config" element={<TaxConfigPage />} />
            </Route>
         </Routes>
      </BrowserRouter>
   );
}

export default App;
