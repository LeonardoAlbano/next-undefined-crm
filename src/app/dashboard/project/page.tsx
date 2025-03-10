/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Calendar,
  LinkIcon,
  List,
  Pencil,
  Search,
  Trash,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
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

type ProjectStatus =
  | "finalizado"
  | "follow-up"
  | "em execução"
  | "novo"
  | "imagem recebida"
  | "em negociação";

interface Project {
  id: string;
  name: string;
  client: string;
  link?: string;
  status: ProjectStatus;
  value: number;
  startDate: string;
  endDate: string;
}

const projectSchema = z
  .object({
    name: z.string().min(1, "Nome do projeto é obrigatório"),
    client: z.string().optional(),
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

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const formatDate = (dateStr: string) => {
  try {
    return format(parseISO(dateStr), "dd/MM/yyyy", { locale: ptBR });
  } catch (e) {
    return dateStr;
  }
};

const StatusBadge = ({ status }: { status: ProjectStatus }) => {
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

  const [formOpen, setFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  const [searchTerm, setSearchTerm] = useState("");

  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      client: "",
      link: "",
      status: "novo",
      value: "",
      startDate: "",
      endDate: "",
    },
  });

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    form.reset({
      name: "",
      client: "",
      link: "",
      status: "novo",
      value: "",
      startDate: "",
      endDate: "",
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
      client: project.client,
      link: project.link || "",
      status: project.status,
      value: project.value.toString(),
      startDate: project.startDate,
      endDate: project.endDate,
    });
    setIsEditing(true);
    setFormOpen(true);
  };

  const onSubmit = (data: z.infer<typeof projectSchema>) => {
    const projectData: Project = {
      id:
        isEditing && currentProject ? currentProject.id : `proj-${Date.now()}`,
      name: data.name,
      client: data.client || "",
      link: data.link,
      status: data.status,
      value: data.value ? Number.parseFloat(data.value.replace(",", ".")) : 0,
      startDate: data.startDate,
      endDate: data.endDate,
    };

    if (isEditing && currentProject) {
      setProjects(
        projects.map((p) => (p.id === currentProject.id ? projectData : p))
      );
      toast.success("Projeto atualizado", {
        description: `O projeto "${data.name}" foi atualizado com sucesso.`,
      });
    } else {
      setProjects([...projects, projectData]);
      toast.success("Projeto adicionado", {
        description: `O projeto "${data.name}" foi adicionado com sucesso.`,
      });
    }
    setFormOpen(false);
    resetForm();
  };

  const deleteProject = (id: string) => {
    setProjects(projects.filter((project) => project.id !== id));
    toast.success("Projeto excluído", {
      description: "O projeto foi excluído com sucesso.",
    });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-purple-950 px-4 py-6 md:px-8">
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
          className="w-full whitespace-nowrap sm:w-auto"
          onClick={openAddForm}
        >
          + Adicionar projeto
        </Button>
      </div>

      <div className="w-full overflow-x-auto rounded-md border bg-zinc-900/50">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]"></TableHead>
              <TableHead>Nome do Projeto</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead className="hidden md:table-cell">
                Início previsto
              </TableHead>
              <TableHead className="hidden md:table-cell">
                Término previsto
              </TableHead>
              <TableHead className="w-[80px] text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProjects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Nenhum projeto encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filteredProjects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
                    <Checkbox />
                  </TableCell>
                  <TableCell className="font-medium text-zinc-100">
                    {project.name}
                    <div className="text-xs text-zinc-400">
                      {project.client}
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={project.status} />
                  </TableCell>
                  <TableCell>{formatCurrency(project.value)}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {formatDate(project.startDate)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {formatDate(project.endDate)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
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
                            onClick={() => deleteProject(project.id)}
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
                  name="client"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Cliente</FormLabel>
                      <FormControl>
                        <div className="flex items-center rounded-md border border-zinc-700 bg-purple-950">
                          <div className="flex h-10 w-10 items-center justify-center border-r border-zinc-700">
                            <User className="h-5 w-5 text-zinc-400" />
                          </div>
                          <Input
                            {...field}
                            className="flex-1 border-0 bg-transparent text-white placeholder:text-zinc-500 focus-visible:ring-0"
                            placeholder="Nome do cliente"
                          />
                        </div>
                      </FormControl>
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
