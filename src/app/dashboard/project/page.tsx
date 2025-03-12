/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { HTTPError } from "ky";
import {
  Calendar,
  LinkIcon,
  List,
  Loader2,
  Pencil,
  Search,
  Trash,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Badge } from "@/components/ui/badge";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type Client, getClients } from "@/http/clients";
import {
  createProject,
  deleteProject,
  getProjects,
  type Project,
  updateProject,
} from "@/http/projects";

type ProjectStatus =
  | "finalizado"
  | "follow-up"
  | "em execução"
  | "novo"
  | "imagem recebida"
  | "em negociação";

const projectSchema = z
  .object({
    name: z.string().min(1, "Nome do projeto é obrigatório"),
    clientId: z.string().min(1, "Cliente é obrigatório"),
    link: z.string().optional(),
    status: z.enum([
      "finalizado",
      "follow-up",
      "em execução",
      "novo",
      "imagem recebida",
      "em negociação",
    ]),
    value: z
      .string()
      .optional()
      .refine((val) => !val || !isNaN(Number(val.replace(",", "."))), {
        message: "Valor deve ser um número válido",
      }),
    startDate: z.string().min(1, "Data de início é obrigatória"),
    endDate: z.string().min(1, "Data de término é obrigatória"),
  })
  .refine(
    (data) => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return end >= start;
    },
    {
      message: "A data de término deve ser igual ou posterior à data de início",
      path: ["endDate"],
    }
  );

const formatCurrency = (value?: number) => {
  if (value === undefined || value === null) return "R$ 0,00";

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "";

  try {
    return format(parseISO(dateStr), "dd/MM/yyyy", { locale: ptBR });
  } catch (e) {
    return dateStr;
  }
};

const StatusBadge = ({ status }: { status?: string }) => {
  if (!status) return null;

  switch (status) {
    case "finalizado":
      return (
        <Badge className="bg-green-500 hover:bg-green-600">Finalizado</Badge>
      );
    case "follow-up":
      return (
        <Badge className="bg-yellow-500 text-black hover:bg-yellow-600">
          Follow-up
        </Badge>
      );
    case "em execução":
      return (
        <Badge className="bg-blue-500 hover:bg-blue-600">Em execução</Badge>
      );
    case "novo":
      return <Badge className="bg-purple-500 hover:bg-purple-600">Novo</Badge>;
    case "imagem recebida":
      return (
        <Badge className="bg-indigo-500 hover:bg-indigo-600">
          Imagem recebida
        </Badge>
      );
    case "em negociação":
      return (
        <Badge className="bg-orange-500 hover:bg-orange-600">
          Em negociação
        </Badge>
      );
    default:
      return <Badge>{status}</Badge>;
  }
};

export default function DashboardProject() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  const [searchTerm, setSearchTerm] = useState("");

  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      clientId: "",
      link: "",
      status: "novo",
      value: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
    },
  });

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const [projectsData, clientsData] = await Promise.all([
          getProjects(),
          getClients(),
        ]);
        setProjects(projectsData);
        setClients(clientsData);
      } catch (error) {
        console.error("Failed to load data:", error);
        toast.error("Falha ao carregar dados", {
          description:
            "Não foi possível carregar os dados. Tente novamente mais tarde.",
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.clientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    form.reset({
      name: "",
      clientId: "",
      link: "",
      status: "novo",
      value: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
    });
    setCurrentProject(null);
    setIsEditing(false);
  };

  const openAddForm = () => {
    resetForm();
    setFormOpen(true);
  };

  const openEditForm = (project: Project) => {
    setCurrentProject(project);
    form.reset({
      name: project.name,
      clientId: project.clientId.toString(),
      link: project.link || "",
      status: (project.status as ProjectStatus) || "novo",
      value: project.value?.toString() || "",
      startDate: project.startDate
        ? new Date(project.startDate).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      endDate: project.endDate
        ? new Date(project.endDate).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
    });
    setIsEditing(true);
    setFormOpen(true);
  };

  const onSubmit = async (data: z.infer<typeof projectSchema>) => {
    try {
      setIsSubmitting(true);

      const projectData = {
        clientId: Number.parseInt(data.clientId),
        name: data.name,
        link: data.link,
        status: data.status,
        value: data.value
          ? Number.parseFloat(data.value.replace(",", "."))
          : undefined,
        startDate: data.startDate,
        endDate: data.endDate,
      };

      if (isEditing && currentProject) {
        const updatedProject = await updateProject(
          currentProject.id,
          projectData
        );
        setProjects(
          projects.map((p) => (p.id === currentProject.id ? updatedProject : p))
        );
        toast.success("Projeto atualizado", {
          description: `O projeto "${data.name}" foi atualizado com sucesso.`,
        });
      } else {
        const newProject = await createProject(projectData);
        setProjects([...projects, newProject]);
        toast.success("Projeto adicionado", {
          description: `O projeto "${data.name}" foi adicionado com sucesso.`,
        });
      }
      setFormOpen(false);
      resetForm();
    } catch (err) {
      if (err instanceof HTTPError) {
        const errorData = await err.response.json();
        toast.error(
          isEditing
            ? "Falha ao atualizar projeto"
            : "Falha ao adicionar projeto",
          {
            description:
              errorData.message || "Ocorreu um erro. Tente novamente.",
          }
        );
      } else {
        toast.error(
          isEditing
            ? "Falha ao atualizar projeto"
            : "Falha ao adicionar projeto",
          {
            description:
              "Ocorreu um erro inesperado. Tente novamente mais tarde.",
          }
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProject = async (id: number) => {
    try {
      await deleteProject(id);
      setProjects(projects.filter((project) => project.id !== id));
      toast.success("Projeto excluído", {
        description: "O projeto foi excluído com sucesso.",
      });
    } catch (err) {
      toast.error("Falha ao excluir projeto", {
        description: "Ocorreu um erro ao excluir o projeto. Tente novamente.",
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-start gap-6 px-4 py-6 md:px-8">
      <div className="flex w-full flex-col items-center gap-4 sm:flex-row">
        <div className="flex w-full items-center gap-2 rounded-lg border border-zinc-300 px-3 py-2 shadow-sm">
          <Search className="h-5 w-5 text-zinc-500" />
          <Input
            className="flex-1 border-0 bg-transparent p-0 text-zinc-100 placeholder-zinc-400 focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="Buscar projetos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Button
          variant="outline"
          className="w-full whitespace-nowrap border-none bg-gradient-to-r from-[#DEBEFFB5] via-[#DEBEFFB5] to-[#7E04FC] text-white sm:w-auto"
          onClick={openAddForm}
        >
          + Adicionar projeto
        </Button>
      </div>

      <div className="w-full overflow-x-auto rounded-md border bg-blackpurple shadow-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]"></TableHead>
              <TableHead className="text-white">Nome do Projeto</TableHead>
              <TableHead className="text-white">Status</TableHead>
              <TableHead className="text-white">Valor</TableHead>
              <TableHead className="hidden text-white md:table-cell">
                Início previsto
              </TableHead>
              <TableHead className="hidden text-white md:table-cell">
                Término previsto
              </TableHead>
              <TableHead className="w-[80px] text-right text-white">
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <div className="flex justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredProjects.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-24 text-center font-bold text-white"
                >
                  Nenhum projeto encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filteredProjects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
                    <Checkbox className="border-white" />
                  </TableCell>
                  <TableCell className="font-medium text-zinc-100">
                    {project.name}
                    <div className="text-xs text-zinc-400">
                      {project.clientName}
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={project.status} />
                  </TableCell>
                  <TableCell className="text-white">
                    {formatCurrency(project.value)}
                  </TableCell>
                  <TableCell className="hidden text-white md:table-cell">
                    {formatDate(project.startDate)}
                  </TableCell>
                  <TableCell className="hidden text-white md:table-cell">
                    {formatDate(project.endDate)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white"
                        >
                          <List className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuGroup>
                          <DropdownMenuItem
                            onClick={() => openEditForm(project)}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar informação
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-500 focus:text-red-500"
                            onClick={() => handleDeleteProject(project.id)}
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Excluir projeto
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
                <PaginationLink href="#">2</PaginationLink>
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
              {isEditing ? "Editar projeto" : "Adicionar projeto"}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                {isEditing ? "Editar projeto" : "Adicionar projeto"}
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
                      <FormLabel className="text-white">
                        Nome do projeto
                      </FormLabel>
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
                  name="clientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Cliente</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="border-zinc-700 bg-purple-950 text-white">
                            <SelectValue placeholder="Selecione um cliente" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="border-zinc-700 bg-purple-950 text-white">
                          {clients.map((client) => (
                            <SelectItem
                              key={client.id}
                              value={client.id.toString()}
                            >
                              {client.name} {client.surname}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">
                        Link do projeto
                      </FormLabel>
                      <FormControl>
                        <div className="flex items-center rounded-md border border-zinc-700 bg-purple-950">
                          <div className="flex h-10 w-10 items-center justify-center border-r border-zinc-700">
                            <LinkIcon className="h-5 w-5 text-zinc-400" />
                          </div>
                          <Input
                            {...field}
                            className="flex-1 border-0 bg-transparent text-white placeholder:text-zinc-500 focus-visible:ring-0"
                            placeholder="https://..."
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">
                          Início previsto
                        </FormLabel>
                        <FormControl>
                          <div className="flex items-center rounded-md border border-zinc-700 bg-purple-950">
                            <Input
                              {...field}
                              type="date"
                              className="flex-1 border-0 bg-transparent text-white placeholder:text-zinc-500 focus-visible:ring-0"
                            />
                            <div className="flex h-10 w-10 items-center justify-center border-l border-zinc-700">
                              <Calendar className="h-5 w-5 text-zinc-400" />
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">
                          Término previsto
                        </FormLabel>
                        <FormControl>
                          <div className="flex items-center rounded-md border border-zinc-700 bg-purple-950">
                            <Input
                              {...field}
                              type="date"
                              className="flex-1 border-0 bg-transparent text-white placeholder:text-zinc-500 focus-visible:ring-0"
                            />
                            <div className="flex h-10 w-10 items-center justify-center border-l border-zinc-700">
                              <Calendar className="h-5 w-5 text-zinc-400" />
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="border-zinc-700 bg-purple-950 text-white">
                              <SelectValue placeholder="Selecione o status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="border-zinc-700 bg-purple-950 text-white">
                            <SelectItem value="novo">Novo</SelectItem>
                            <SelectItem value="em execução">
                              Em execução
                            </SelectItem>
                            <SelectItem value="follow-up">Follow-up</SelectItem>
                            <SelectItem value="finalizado">
                              Finalizado
                            </SelectItem>
                            <SelectItem value="em negociação">
                              Em negociação
                            </SelectItem>
                            <SelectItem value="imagem recebida">
                              Imagem recebida
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">
                          Valor do projeto (R$)
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="border-zinc-700 bg-purple-950 text-white placeholder:text-zinc-500 focus-visible:ring-purple-500"
                            placeholder="0,00"
                            onChange={(e) => {
                              const value = e.target.value.replace(
                                /[^0-9,.]/g,
                                ""
                              );
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

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
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : isEditing ? (
                      "Atualizar"
                    ) : (
                      "Salvar"
                    )}
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
