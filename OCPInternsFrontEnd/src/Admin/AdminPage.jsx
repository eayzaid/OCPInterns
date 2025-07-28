import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import SideBar from "../Components/CustomUi/SideBar/SideBar";
import { Routes, Route } from "react-router";
import ApplicationManager from "../SharedPages/ApplicationManager/ApplicationManager";
import MentorManager from "./MentorManagement/MentorManager";
import RecruiterManager from "./RecruiterManagement/RecruiterManager";
import LocationManager from "./LocationManagement/LocationManager";
import DashBoard from "../SharedPages/Dashboard/DashBoard";

export default function AdminPage() {
  
  return (
    <SidebarProvider className="flex">
      <SideBar isAdmin={true} />
      <main className="flex-1 flex flex-col">
        <div className="bg-emerald-600 p-1 w-full sticky top-0 z-50 ">
          <SidebarTrigger className="text-white" />
        </div>
        <Routes>
          <Route path="/applications" element={<ApplicationManager />} />
          <Route path="/mentors" element={<MentorManager />} />
          <Route path="/recruiters" element={<RecruiterManager />} />
          <Route path="/locations" element={<LocationManager />} />
          <Route path="/dashboard" element={<DashBoard />} />
        </Routes>
      </main>
    </SidebarProvider>
  );
}
