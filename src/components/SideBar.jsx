import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function SideBar() {
  const [userRole, setUserRole] = useState("user");
  const [userName, setUserName] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      // 👇 get profile (name + role)
      const { data: profile, error } = await supabase
        .from("users")
        .select("role, name")
        .eq("email", user.email)
        .single();

      if (error) {
        console.error(error);
        return;
      }

      setUserRole(profile?.role || "user");
      setUserName(profile?.name || user.email);
    }

    loadUser();
  }, []);

  // ✅ LOGOUT FUNCTION
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden bg-purple-600 p-4 flex justify-between items-center">
        <h1 className="text-white font-bold text-lg">JAMATEL</h1>

        <button onClick={() => setIsOpen(!isOpen)} className="text-white text-2xl">
          ☰
        </button>
      </div>

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-purple-600 z-50 transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>

        <div className="p-4 text-white font-bold text-xl border-b border-purple-500">
          JAMATEL
        </div>

        {/* 👇 USER INFO */}
        <div className="p-4 text-white border-b border-purple-400">
          <p className="text-sm opacity-80">Logged in as</p>
          <p className="font-bold">{userName}</p>
        </div>

        <Link to="/dashboard" onClick={() => setIsOpen(false)}
          className="flex items-center gap-3 m-2 p-3 text-white rounded-lg
hover:bg-purple-800
transition-all duration-150
active:scale-95
active:opacity-80
active:translate-y-[1px]
cursor-pointer">
          Dashboard
        </Link>

        <Link to="/leads-management" onClick={() => setIsOpen(false)}
          className="flex items-center gap-3 m-2 p-3 text-white rounded-lg
hover:bg-purple-800
transition-all duration-150
active:scale-95
active:opacity-80
active:translate-y-[1px]
cursor-pointer">
          Debtors
        </Link>

        <Link to="/search-leads" onClick={() => setIsOpen(false)}
          className="flex items-center gap-3 m-2 p-3 text-white rounded-lg
hover:bg-purple-800
transition-all duration-150
active:scale-95
active:opacity-80
active:translate-y-[1px]
cursor-pointer">
          Clients
        </Link>

        {userRole === "admin" && (
          <>
            <Link to="/send-reports" onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 m-2 p-3 text-white rounded-lg
hover:bg-purple-800
transition-all duration-150
active:scale-95
active:opacity-80
active:translate-y-[1px]
cursor-pointer">
              Users
            </Link>

            <Link to="/reports" onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 m-2 p-3 text-white rounded-lg
hover:bg-purple-800
transition-all duration-150
active:scale-95
active:opacity-80
active:translate-y-[1px]
cursor-pointer">
              Reports
            </Link>
          </>
        )}

        {/* 👇 LOGOUT BUTTON */}
        <button
          onClick={handleLogout}
          className="w-full text-left m-2 p-3 text-red-200 hover:bg-red-600 rounded-lg transition-all duration-150 active:scale-95 active:opacity-80 active:translate-y-[1px] cursor-pointer"
        >
          Logout
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}