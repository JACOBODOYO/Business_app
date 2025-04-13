import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header";
import SideBar from "./components/SideBar";
import DashBoard from "./components/DashBoard";
import LeadsManagement from "./components/LeadsManagement";
import SearchLeads from "./components/SearchLeads";
import SendReports from "./components/SendReports";
import DeleteLeads from "./components/DeleteLeads";
import AllOpen from "./components/AllOpen";
import DueToday from "./components/DueToday";
import Won from "./components/Won";
import Profile from "./components/Profile";
import Login from "./components/Login";

function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";

  return (
    <div className="flex h-screen">
      {!isLoginPage && <SideBar />}
      <div className={`flex-1 ${!isLoginPage ? "ml-[13.6667%] mt-16 pl-4 w-[85.333%]" : ""}`}>
        {!isLoginPage && <Header />}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<DashBoard />} />
          <Route path="/leads-management" element={<LeadsManagement />} />
          <Route path="/search-leads" element={<SearchLeads />} />
          <Route path="/send-reports" element={<SendReports />} />
          <Route path="/delete-leads" element={<DeleteLeads />} />
          <Route path="/all-open" element={<AllOpen />}></Route>
          <Route path="/due-today" element={<DueToday />}></Route>
          <Route path="/won" element={<Won />} />
          <Route path="/profile/:leadId" element={<Profile />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
