"use client"
import * as React from "react"

import { NavMain } from "@/components/ui/nav-main"
import { NavProjects } from "@/components/ui/nav-projects"
import { NavUser } from "@/components/ui/nav-user"
import { TeamSwitcher } from "@/components/ui/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useSelector } from "react-redux";
import { AuthState } from "@/lib/client/stores/slices/authSlice"
import { data } from "@/data/sidebarData"


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const userAuth = useSelector((state: { auth: AuthState }) => state.auth.user);
  const dataUser = {
    name: userAuth?.username || 'user',
    email: userAuth?.email || 'email@mail.com',
    avatar: "https://github.com/shadcn.png",
  }
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={dataUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
