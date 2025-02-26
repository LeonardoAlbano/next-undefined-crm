"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ElementType } from "react";

export interface NavItemProps {
  title: string;
  icon: ElementType;
  href: string;
}

export function NavItem({ title, icon: Icon, href }: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`group flex items-center gap-5 rounded px-3 py-4 transition-colors ${isActive ? "bg-purple-700 text-violet-500" : "hover:bg-purple-700"} `}
    >
      <Icon
        className={`h-6 w-6 ${isActive ? "text-violet-500" : "text-white group-hover:text-violet-500"}`}
      />
      <span
        className={`${isActive ? "text-violet-500" : "text-white group-hover:text-violet-500"} font-medium`}
      >
        {title}
      </span>
    </Link>
  );
}
