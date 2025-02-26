"use client";
import {
  Home,
  Layers,
  LayoutDashboard,
  LogOut,
  PackageOpen,
  SquareUserRound,
  UserCog,
} from "lucide-react";

import { LogoUndefined } from "./logo-undefined";
import { NavItem } from "./nav-item";

export default function Sidebar() {
  return (
    <aside className="flex flex-col justify-between gap-6 border-r border-zinc-200 bg-blackpurple px-5 py-8">
      <LogoUndefined />
      <nav className="space-y-0.5 pt-16">
        <NavItem title="Home" icon={Home} href="/dashboard/home" />
        <NavItem title="Board" icon={LayoutDashboard} href="/dashboard/board" />
        <NavItem title="Fluxograma" icon={Layers} href="/dashboard/fluxogram" />
        <NavItem title="Leads" icon={SquareUserRound} href="/dashboard/leads" />
        <NavItem
          title="Projetos"
          icon={PackageOpen}
          href="/dashboard/project"
        />
        <NavItem
          title="Gerenciar usuários"
          icon={UserCog}
          href="/dashboard/users"
        />
      </nav>
      <div className="mt-auto flex flex-col gap-6">
        <nav>
          <NavItem title="Sair" icon={LogOut} href="/logout" />
        </nav>
      </div>
    </aside>
  );
}
