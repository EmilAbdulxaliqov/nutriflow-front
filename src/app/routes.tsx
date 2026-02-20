import { createBrowserRouter } from "react-router";
import Landing from "./pages/public/Landing";
import Pricing from "./pages/public/Pricing";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import VerifyOTP from "./pages/auth/VerifyOTP";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import UserLayout from "./layouts/UserLayout";
import UserDashboard from "./pages/user/Dashboard";
import UserMenu from "./pages/user/Menu";
import UserDeliveries from "./pages/user/Deliveries";
import UserProfile from "./pages/user/Profile";
import HealthDataSubmission from "./pages/user/HealthDataSubmission";
import DietitianLayout from "./layouts/DietitianLayout";
import DietitianDashboard from "./pages/dietitian/Dashboard";
import DietitianPatients from "./pages/dietitian/Patients";
import PatientProfile from "./pages/dietitian/PatientProfile";
import MenuEditor from "./pages/dietitian/MenuEditor";
import DietitianProfile from "./pages/dietitian/Profile";
import CatererLayout from "./layouts/CatererLayout";
import CatererToday from "./pages/caterer/Today";
import CatererStats from "./pages/caterer/Stats";
import CatererProfile from "./pages/caterer/Profile";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminDietitians from "./pages/admin/Dietitians";
import AdminCaterers from "./pages/admin/Caterers";
import AdminMenus from "./pages/admin/Menus";
import AdminPayments from "./pages/admin/Payments";
import AdminLogs from "./pages/admin/Logs";
import AdminTools from "./pages/admin/Tools";
import NotFound from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Landing,
  },
  {
    path: "/pricing",
    Component: Pricing,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/register",
    Component: Register,
  },
  {
    path: "/verify-otp",
    Component: VerifyOTP,
  },
  {
    path: "/forgot-password",
    Component: ForgotPassword,
  },
  {
    path: "/reset-password",
    Component: ResetPassword,
  },
  {
    path: "/user",
    Component: UserLayout,
    children: [
      { index: true, Component: UserDashboard },
      { path: "health-data", Component: HealthDataSubmission },
      { path: "menu", Component: UserMenu },
      { path: "deliveries", Component: UserDeliveries },
      { path: "profile", Component: UserProfile },
    ],
  },
  {
    path: "/dietitian",
    Component: DietitianLayout,
    children: [
      { index: true, Component: DietitianDashboard },
      { path: "patients", Component: DietitianPatients },
      { path: "patients/:id", Component: PatientProfile },
      { path: "menu-editor", Component: MenuEditor },
      { path: "menu-editor/:userId", Component: MenuEditor },
      { path: "profile", Component: DietitianProfile },
    ],
  },
  {
    path: "/caterer",
    Component: CatererLayout,
    children: [
      { index: true, Component: CatererToday },
      { path: "stats", Component: CatererStats },
      { path: "profile", Component: CatererProfile },
    ],
  },
  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      { index: true, Component: AdminDashboard },
      { path: "users", Component: AdminUsers },
      { path: "dietitians", Component: AdminDietitians },
      { path: "caterers", Component: AdminCaterers },
      { path: "menus", Component: AdminMenus },
      { path: "payments", Component: AdminPayments },
      { path: "logs", Component: AdminLogs },
      { path: "tools", Component: AdminTools },
    ],
  },
  {
    path: "*",
    Component: NotFound,
  },
]);
