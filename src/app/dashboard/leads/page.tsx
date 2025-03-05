"use client";

import { List, Mail, Pencil, Phone, Search, Trash, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
interface Lead {
  id: string;
  fullName: string;
  nickname: string;
  email: string;
  phone: string;
}

export default function DashboardLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentLead, setCurrentLead] = useState<Lead | null>(null);
  const [fullName, setFullName] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const filteredLeads = leads.filter(
    (lead) =>
      lead.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm)
  );
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7)
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const resetForm = () => {
    setFullName("");
    setNickname("");
    setEmail("");
    setPhone("");
    setCurrentLead(null);
    setIsEditing(false);
  };

  const openAddForm = () => {
    resetForm();
    setFormOpen(true);
  };

  const openEditForm = (lead: Lead) => {
    setCurrentLead(lead);
    setFullName(lead.fullName);
    setNickname(lead.nickname);
    setEmail(lead.email);
    setPhone(lead.phone);
    setIsEditing(true);
    setFormOpen(true);
  };

  // Salvar lead (adicionar ou editar)
  const saveLead = () => {
    // Validação básica
    if (!fullName || !email || !phone) {
      toast({
        title: "Erro ao salvar",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Erro ao salvar",
        description: "Por favor, insira um email válido.",
        variant: "destructive",
      });
      return;
    }

    const leadData: Lead = {
      id: isEditing && currentLead ? currentLead.id : `lead-${Date.now()}`,
      fullName,
      nickname,
      email,
      phone: formatPhone(phone),
    };

    if (isEditing && currentLead) {
      setLeads(leads.map((l) => (l.id === currentLead.id ? leadData : l)));
      toast({
        title: "Lead atualizado",
        description: `O lead "${fullName}" foi atualizado com sucesso.`,
      });
    } else {
      setLeads([...leads, leadData]);
      toast({
        title: "Lead adicionado",
        description: `O lead "${fullName}" foi adicionado com sucesso.`,
      });
    }

    // Fechar formulário e resetar
    setFormOpen(false);
    resetForm();
  };

  // Excluir lead
  const deleteLead = (id: string) => {
    setLeads(leads.filter((lead) => lead.id !== id));
    toast({
      title: "Lead excluído",
      description: "O lead foi excluído com sucesso.",
    });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-purple-950 px-4 py-6 md:px-8">
      <div className="flex w-full flex-col items-center gap-4 sm:flex-row">
        <div className="flex w-full items-center gap-2 rounded-lg border border-zinc-300 px-3 py-2 shadow-sm">
          <Search className="h-5 w-5 text-zinc-500" />
          <Input
            className="flex-1 border-0 bg-transparent p-0 text-zinc-100 placeholder-zinc-400 focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="Buscar leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Button
          variant="outline"
          className="w-full whitespace-nowrap sm:w-auto"
          onClick={openAddForm}
        >
          + Adicionar lead
        </Button>
      </div>

      <div className="w-full overflow-x-auto rounded-md border bg-zinc-900/50">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]"></TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="w-[80px] text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Nenhum lead encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filteredLeads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>
                    <Checkbox />
                  </TableCell>
                  <TableCell className="font-medium text-zinc-100">
                    {lead.fullName}
                    {lead.nickname && (
                      <div className="text-xs text-zinc-400">
                        {lead.nickname}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{lead.phone}</TableCell>
                  <TableCell>{lead.email}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <List className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuGroup>
                          <DropdownMenuItem onClick={() => openEditForm(lead)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar informação
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-500 focus:text-red-500"
                            onClick={() => deleteLead(lead.id)}
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Excluir lead
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
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
                <PaginationLink href="#">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  2
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>

      {/* Formulário de Lead */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="border-none bg-purple-950 p-0 text-white sm:max-w-[620px]">
          <DialogHeader className="sr-only">
            <DialogTitle>
              {isEditing ? "Editar lead" : "Adicionar novo lead"}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                {isEditing ? "Editar lead" : "Adicionar novo lead"}
              </h2>
              <button
                onClick={() => setFormOpen(false)}
                className="rounded-full p-1 text-white hover:bg-purple-900"
                type="button"
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Fechar</span>
              </button>
            </div>

            <div className="mb-6">
              <Label htmlFor="fullName" className="mb-2 block text-white">
                Nome completo
              </Label>
              <Input
                id="fullName"
                className="border-zinc-700 bg-purple-950 text-white placeholder:text-zinc-500 focus-visible:ring-purple-500"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <Label htmlFor="nickname" className="mb-2 block text-white">
                Apelido
              </Label>
              <Input
                id="nickname"
                className="border-zinc-700 bg-purple-950 text-white placeholder:text-zinc-500 focus-visible:ring-purple-500"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <Label htmlFor="email" className="mb-2 block text-white">
                Email
              </Label>
              <div className="flex items-center rounded-md border border-zinc-700 bg-purple-950">
                <div className="flex h-10 w-10 items-center justify-center border-r border-zinc-700">
                  <Mail className="h-5 w-5 text-zinc-400" />
                </div>
                <Input
                  id="email"
                  type="email"
                  className="flex-1 border-0 bg-transparent text-white placeholder:text-zinc-500 focus-visible:ring-0"
                  placeholder="email@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-10">
              <Label htmlFor="phone" className="mb-2 block text-white">
                Telefone
              </Label>
              <div className="flex items-center rounded-md border border-zinc-700 bg-purple-950">
                <div className="flex h-10 w-10 items-center justify-center border-r border-zinc-700">
                  <Phone className="h-5 w-5 text-zinc-400" />
                </div>
                <Input
                  id="phone"
                  className="flex-1 border-0 bg-transparent text-white placeholder:text-zinc-500 focus-visible:ring-0"
                  placeholder="(00) 00000-0000"
                  value={phone}
                  onChange={(e) => {
                    const formattedPhone = formatPhone(e.target.value);
                    setPhone(formattedPhone);
                  }}
                  maxLength={15}
                />
              </div>
            </div>

            <DialogFooter className="flex justify-end gap-4 px-0">
              <Button
                type="button"
                variant="ghost"
                className="text-white hover:bg-purple-900 hover:text-white"
                onClick={() => {
                  setFormOpen(false);
                  resetForm();
                }}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                className="bg-violet-600 text-white hover:bg-violet-700"
                onClick={saveLead}
              >
                {isEditing ? "Atualizar" : "Salvar"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
