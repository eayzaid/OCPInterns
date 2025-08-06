import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter
} from "@/components/ui/sidebar";
import { Link } from "react-router";
import { Users, FileCheck , LayoutDashboard, MapPin } from "lucide-react";
import { UserProfile } from "./UserProfile";

export default function SideBar({ isAdmin }) {
  return (
    <Sidebar>
        <SidebarHeader className="p-4 bg-emerald-600 w-full">
            <div className="text-3xl font-bigtitle text-center text-white">
                OCP INTERNS
            </div>
        </SidebarHeader>
      <SidebarContent >
        <SidebarGroup>
          <SidebarMenuButton asChild>
            <Link to={isAdmin ? "/admin/dashboard" : "/recruiter/dashboard"}>
              <LayoutDashboard />
              <span>DashBoard</span>
            </Link>
          </SidebarMenuButton>
          <SidebarGroupLabel>Applications</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to={isAdmin ? "/admin/applications" : "/recruiter/applications"}>
                    <FileCheck />
                    <span>Application Management</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
          {isAdmin && (
            <>
              <SidebarGroupLabel >User Management</SidebarGroupLabel>
              <SidebarGroupContent >
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/admin/recruiters">
                        <Users />
                        <span>Recruiters</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/admin/mentors">
                        <Users />
                        <span>Mentors</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
              <SidebarGroupLabel >Location Management</SidebarGroupLabel>
              <SidebarGroupContent >
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/admin/locations">
                        <MapPin />
                        <span>Locations</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </>
          )}
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter >
        <UserProfile />
      </SidebarFooter>
    </Sidebar>
  );
}
