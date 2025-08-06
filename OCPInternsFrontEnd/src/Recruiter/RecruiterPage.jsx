import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import SideBar from "../Components/CustomUi/SideBar/SideBar";
import { Routes, Route } from "react-router";
import ApplicationManager from "../SharedPages/ApplicationManager/ApplicationManager";
import DashBoard from "../SharedPages/Dashboard/DashBoard";

export default function AdminPage() {
  
  return (
    <SidebarProvider className="flex">
      <SideBar isAdmin={false} />
      <main className="flex-1 flex flex-col">
        <div className="bg-emerald-600 p-1 w-full sticky top-0 z-50 ">
          <SidebarTrigger className="text-white" />
        </div>
        <Routes>
          <Route path="/applications" element={<ApplicationManager />} />
          <Route path="/dashboard" element={<DashBoard />} />
        </Routes>
      </main>
    </SidebarProvider>
  );
}
