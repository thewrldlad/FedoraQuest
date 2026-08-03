import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

export default function AdminLayout() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="flex h-screen bg-fedora-bg">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader searchTerm={searchTerm} onSearch={setSearchTerm} />

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet context={{ searchTerm }} />
        </main>
      </div>
    </div>
  );
}
