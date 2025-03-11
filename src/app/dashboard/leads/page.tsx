/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { HTTPError } from "ky";
import { List, Mail, Pencil, Phone, Search, Trash, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import {
  type Client,
  createClient,
  deleteClient,
  getClients,
  updateClient,
} from "@/http/clients";

const leadSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  surname: z.string().min(1, "Sobrenome é obrigatório"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
});

export default function DashboardLeads() {
  const [leads, setLeads] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [formOpen, setFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentLead, setCurrentLead] = useState<Client | null>(null);

  const [searchTerm, setSearchTerm] = useState("");

  const form = useForm<z.infer<typeof leadSchema>>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: "",
      surname: "",
      email: "",
      phone: "",
    },
  });

  useEffect(() => {
    async function loadLeads() {
      try {
        setIsLoading(true);
        const data = await getClients();
        setLeads(data);
      } catch (error) {
        console.error("Failed to load leads:", error);
        toast.error("Falha ao carregar leads", {
          description:
            "Não foi possível carregar seus leads. Tente novamente mais tarde.",
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadLeads();
  }, []);

  const filteredLeads = leads.filter(
    (lead) =>
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.email &&
        lead.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (lead.phone && lead.phone.includes(searchTerm))
  );

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7)
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const resetForm = () => {
    form.reset({
      name: "",
      surname: "",
      email: "",
      phone: "",
    });
    setCurrentLead(null);
    setIsEditing(false);
  };

  const openAddForm = () => {
    resetForm();
    setFormOpen(true);
  };

  const openEditForm = (lead: Client) => {
    setCurrentLead(lead);
    form.reset({
      name: lead.name,
      surname: lead.surname,
      email: lead.email || "",
      phone: lead.phone || "",
    });
    setIsEditing(true);
    setFormOpen(true);
  };

  const onSubmit = async (data: z.infer<typeof leadSchema>) => {
    try {
      if (isEditing && currentLead) {
        const updatedLead = await updateClient(currentLead.id, {
          name: data.name,
          surname: data.surname,
          email: data.email,
          phone: data.phone,
        });

        setLeads(leads.map((l) => (l.id === currentLead.id ? updatedLead : l)));
        toast.success("Lead atualizado", {
          description: `O lead "${data.name}" foi atualizado com sucesso.`,
        });
      } else {
        const newLead = await createClient({
          name: data.name,
          surname: data.surname,
          email: data.email,
          phone: data.phone,
        });

        setLeads([...leads, newLead]);
        toast.success("Lead adicionado", {
          description: `O lead "${data.name}" foi adicionado com sucesso.`,
        });
      }
      setFormOpen(false);
      resetForm();
    } catch (err) {
      if (err instanceof HTTPError) {
        const errorData = await err.response.json();
        toast.error(
          isEditing ? "Falha ao atualizar lead" : "Falha ao adicionar lead",
          {
            description:
              errorData.message || "Ocorreu um erro. Tente novamente.",
          }
        );
      } else {
        toast.error(
          isEditing ? "Falha ao atualizar lead" : "Falha ao adicionar lead",
          {
            description:
              "Ocorreu um erro inesperado. Tente novamente mais tarde.",
          }
        );
      }
    }
  };

  const handleDeleteLead = async (id: number) => {
    try {
      await deleteClient(id);
      setLeads(leads.filter((lead) => lead.id !== id));
      toast.success("Lead excluído", {
        description: "O lead foi excluído com sucesso.",
      });
    } catch (err) {
      toast.error("Falha ao excluir lead", {
        description: "Ocorreu um erro ao excluir o lead. Tente novamente.",
      });
    }
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
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Carregando leads...
                </TableCell>
              </TableRow>
            ) : filteredLeads.length === 0 ? (
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
                    {lead.name} {lead.surname}
                  </TableCell>
                  <TableCell>{lead.phone || "-"}</TableCell>
                  <TableCell>{lead.email || "-"}</TableCell>
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
                            onClick={() => handleDeleteLead(lead.id)}
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

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Nome</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="border-zinc-700 bg-purple-950 text-white placeholder:text-zinc-500 focus-visible:ring-purple-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="surname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Sobrenome</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="border-zinc-700 bg-purple-950 text-white placeholder:text-zinc-500 focus-visible:ring-purple-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Email</FormLabel>
                      <FormControl>
                        <div className="flex items-center rounded-md border border-zinc-700 bg-purple-950">
                          <div className="flex h-10 w-10 items-center justify-center border-r border-zinc-700">
                            <Mail className="h-5 w-5 text-zinc-400" />
                          </div>
                          <Input
                            {...field}
                            type="email"
                            className="flex-1 border-0 bg-transparent text-white placeholder:text-zinc-500 focus-visible:ring-0"
                            placeholder="email@exemplo.com"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Telefone</FormLabel>
                      <FormControl>
                        <div className="flex items-center rounded-md border border-zinc-700 bg-purple-950">
                          <div className="flex h-10 w-10 items-center justify-center border-r border-zinc-700">
                            <Phone className="h-5 w-5 text-zinc-400" />
                          </div>
                          <Input
                            {...field}
                            className="flex-1 border-0 bg-transparent text-white placeholder:text-zinc-500 focus-visible:ring-0"
                            placeholder="(00) 00000-0000"
                            maxLength={15}
                            onChange={(e) => {
                              const formattedPhone = formatPhone(
                                e.target.value
                              );
                              field.onChange(formattedPhone);
                            }}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter className="flex justify-end gap-4 px-0 pt-4">
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
                    type="submit"
                    className="bg-violet-600 text-white hover:bg-violet-700"
                  >
                    {isEditing ? "Atualizar" : "Salvar"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
