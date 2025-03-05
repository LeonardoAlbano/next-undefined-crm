/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { List, Search } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";

// Tipos
interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

export default function DashboardUsers() {
  const [users] = useState<User[]>([
    {
      id: "1",
      name: "Jane Cooper",
      email: "jane@microsoft.com",
      isAdmin: false,
    },
    {
      id: "2",
      name: "Floyd Miles",
      email: "floyd@yahoo.com",
      isAdmin: true,
    },
    {
      id: "3",
      name: "Ronald Richards",
      email: "ronald@adobe.com",
      isAdmin: true,
    },
    {
      id: "4",
      name: "Marvin McKinney",
      email: "marvin@tesla.com",
      isAdmin: false,
    },
    {
      id: "5",
      name: "Jerome Bell",
      email: "jerome@google.com",
      isAdmin: false,
    },
    {
      id: "6",
      name: "Kathryn Murphy",
      email: "kathryn@microsoft.com",
      isAdmin: false,
    },
    {
      id: "7",
      name: "Jacob Jones",
      email: "jacob@yahoo.com",
      isAdmin: false,
    },
    {
      id: "8",
      name: "Kristin Watson",
      email: "kristin@facebook.com",
      isAdmin: false,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const makeAdmin = (userId: string) => {
    toast({
      title: "Permissão atualizada",
      description: "O usuário foi tornado administrador com sucesso.",
    });
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((user) => user.id));
    }
  };

  const toggleSelectUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-purple-950 px-4 py-6 md:px-8">
      <div className="w-full">
        <div className="mb-6 flex w-full items-center gap-2 rounded-lg border border-zinc-300 px-3 py-2 shadow-sm">
          <Search className="h-5 w-5 text-zinc-500" />
          <Input
            className="flex-1 border-0 bg-transparent p-0 text-zinc-100 placeholder-zinc-400 focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="Pesquisar usuários..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="w-full overflow-x-auto rounded-md border bg-zinc-900/50">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">
                  <Checkbox
                    checked={
                      selectedUsers.length === filteredUsers.length &&
                      filteredUsers.length > 0
                    }
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead>Nome do usuário</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="w-[80px] text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    Nenhum usuário encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={() => toggleSelectUser(user.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium text-zinc-100">
                      {user.name}
                      {user.isAdmin && (
                        <span className="ml-2 text-xs text-purple-400">
                          (Admin)
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <List className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {!user.isAdmin && (
                            <DropdownMenuItem
                              onClick={() => makeAdmin(user.id)}
                            >
                              Tornar usuário ADM
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <div className="border-t border-zinc-800 p-2">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">4</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">40</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </div>
  );
}
