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
        <NavItem title="Home" icon={Home} />
        <NavItem title="Board" icon={LayoutDashboard} />
        <NavItem title="Fluxograma" icon={Layers} />
        <NavItem title="Leads" icon={SquareUserRound} />
        <NavItem title="Projetos" icon={PackageOpen} />
        <NavItem title="Gerenciar usuários" icon={UserCog} />
      </nav>
      <div className="mt-auto flex flex-col gap-6">
        <nav>
          <NavItem title="Sair" icon={LogOut} />
        </nav>
      </div>
    </aside>
  );
}
