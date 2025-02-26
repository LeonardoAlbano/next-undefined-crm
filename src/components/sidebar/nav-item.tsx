import { ChevronRight } from "lucide-react";
import { ElementType } from "react";

export interface NavItemProps {
  title: string;
  icon: ElementType;
}

export function NavItem({ title, icon: Icon }: NavItemProps) {
  return (
    <a
      href=""
      className="group flex items-center gap-5 rounded px-3 py-4 hover:bg-purple-700"
    >
      <Icon className="h-6 w-6 text-white group-hover:text-violet-500" />
      <span className="font-medium text-white group-hover:text-violet-500">
        {title}
      </span>
      <ChevronRight className="ml-auto h-5 w-5 text-white group-hover:text-violet-900" />
    </a>
  );
}
