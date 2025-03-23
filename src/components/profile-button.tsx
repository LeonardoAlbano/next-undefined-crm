"use client";

import { ChevronDown, LogOut } from "lucide-react";

import { signOut } from "@/app/auth/actions";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

function getInitials(name: string): string {
  const initials = name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");

  return initials;
}

type User = {
  id: string;
  name: string | null;
  email: string;
  avatarUrl: string | null;
};

export function ProfileButton({ user }: { user: User }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-3 outline-none">
        <div className="flex flex-col items-end">
          <span className="text-sm font-medium text-white">
            {user.name || "User"}
          </span>
          <span className="text-xs text-muted-foreground">{user.email}</span>
        </div>
        <Avatar>
          {user.avatarUrl && <AvatarImage src={user.avatarUrl} />}
          {user.name && (
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          )}
        </Avatar>
        <ChevronDown className="size-4 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <form action={signOut}>
            <button className="flex w-full items-center">
              <LogOut className="mr-2 size-4" />
              Sign Out
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
