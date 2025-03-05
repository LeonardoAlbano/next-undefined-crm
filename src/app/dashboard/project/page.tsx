/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

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
import { toast } from "@/components/ui/use-toast";

// Tipos
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
  startDate: string; // Mudamos para string para evitar problemas de hidratação
  endDate: string; // Mudamos para string para evitar problemas de hidratação
}

// Função para formatar valor em BRL
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

// Função para formatar data
const formatDate = (dateStr: string) => {
  try {
    return format(parseISO(dateStr), "dd/MM/yyyy", { locale: ptBR });
  } catch (e) {
    return dateStr;
  }
};

// Componente para renderizar o badge de status com a cor correta
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
  // Estado para armazenar os projetos - usando strings para datas para evitar problemas de hidratação
  const [projects, setProjects] = useState<Project[]>([]);

  // Estado para o formulário
  const [formOpen, setFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  // Estados do formulário
  const [projectName, setProjectName] = useState("");
  const [clientName, setClientName] = useState("");
  const [projectLink, setProjectLink] = useState("");
  const [projectStatus, setProjectStatus] = useState<ProjectStatus>("novo");
  const [projectValue, setProjectValue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Estado para pesquisa
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrar projetos com base na pesquisa
  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Resetar o formulário
  const resetForm = () => {
    setProjectName("");
    setClientName("");
    setProjectLink("");
    setProjectStatus("novo");
    setProjectValue("");
    setStartDate("");
    setEndDate("");
    setCurrentProject(null);
    setIsEditing(false);
  };

  // Abrir formulário para adicionar novo projeto
  const openAddForm = () => {
    resetForm();
    setFormOpen(true);
  };

  // Abrir formulário para editar projeto
  const openEditForm = (project: Project) => {
    setCurrentProject(project);
    setProjectName(project.name);
    setClientName(project.client);
    setProjectLink(project.link || "");
    setProjectStatus(project.status);
    setProjectValue(project.value.toString());
    setStartDate(project.startDate);
    setEndDate(project.endDate);
    setIsEditing(true);
    setFormOpen(true);
  };

  // Salvar projeto (adicionar ou editar)
  const saveProject = () => {
    // Validação básica
    if (
      !projectName ||
      !clientName ||
      !projectValue ||
      !startDate ||
      !endDate
    ) {
      toast({
        title: "Erro ao salvar",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const projectData: Project = {
      id:
        isEditing && currentProject ? currentProject.id : `proj-${Date.now()}`,
      name: projectName,
      client: clientName,
      link: projectLink,
      status: projectStatus,
      value: Number.parseFloat(projectValue.replace(",", ".")),
      startDate: startDate,
      endDate: endDate,
    };

    if (isEditing && currentProject) {
      // Atualizar projeto existente
      setProjects(
        projects.map((p) => (p.id === currentProject.id ? projectData : p))
      );
      toast({
        title: "Projeto atualizado",
        description: `O projeto "${projectName}" foi atualizado com sucesso.`,
      });
    } else {
      // Adicionar novo projeto
      setProjects([...projects, projectData]);
      toast({
        title: "Projeto adicionado",
        description: `O projeto "${projectName}" foi adicionado com sucesso.`,
      });
    }

    // Fechar formulário e resetar
    setFormOpen(false);
    resetForm();
  };

  // Excluir projeto
  const deleteProject = (id: string) => {
    setProjects(projects.filter((project) => project.id !== id));
    toast({
      title: "Projeto excluído",
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

      {/* Formulário de Projeto */}
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

            <div className="mb-6">
              <Label htmlFor="name" className="mb-2 block text-white">
                Nome do projeto
              </Label>
              <Input
                id="name"
                className="border-zinc-700 bg-purple-950 text-white placeholder:text-zinc-500 focus-visible:ring-purple-500"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <Label htmlFor="client" className="mb-2 block text-white">
                Cliente
              </Label>
              <div className="flex items-center rounded-md border border-zinc-700 bg-purple-950">
                <div className="flex h-10 w-10 items-center justify-center border-r border-zinc-700">
                  <User className="h-5 w-5 text-zinc-400" />
                </div>
                <Input
                  id="client"
                  className="flex-1 border-0 bg-transparent text-white placeholder:text-zinc-500 focus-visible:ring-0"
                  placeholder="Nome do cliente"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-6">
              <Label htmlFor="link" className="mb-2 block text-white">
                Link do projeto
              </Label>
              <div className="flex items-center rounded-md border border-zinc-700 bg-purple-950">
                <div className="flex h-10 w-10 items-center justify-center border-r border-zinc-700">
                  <LinkIcon className="h-5 w-5 text-zinc-400" />
                </div>
                <Input
                  id="link"
                  className="flex-1 border-0 bg-transparent text-white placeholder:text-zinc-500 focus-visible:ring-0"
                  placeholder="https://..."
                  value={projectLink}
                  onChange={(e) => setProjectLink(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate" className="mb-2 block text-white">
                  Início previsto
                </Label>
                <div className="flex items-center rounded-md border border-zinc-700 bg-purple-950">
                  <Input
                    id="startDate"
                    type="date"
                    className="flex-1 border-0 bg-transparent text-white placeholder:text-zinc-500 focus-visible:ring-0"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                  <div className="flex h-10 w-10 items-center justify-center border-l border-zinc-700">
                    <Calendar className="h-5 w-5 text-zinc-400" />
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="endDate" className="mb-2 block text-white">
                  Término previsto
                </Label>
                <div className="flex items-center rounded-md border border-zinc-700 bg-purple-950">
                  <Input
                    id="endDate"
                    type="date"
                    className="flex-1 border-0 bg-transparent text-white placeholder:text-zinc-500 focus-visible:ring-0"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                  <div className="flex h-10 w-10 items-center justify-center border-l border-zinc-700">
                    <Calendar className="h-5 w-5 text-zinc-400" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-10 grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status" className="mb-2 block text-white">
                  Status
                </Label>
                <Select
                  value={projectStatus}
                  onValueChange={(value) =>
                    setProjectStatus(value as ProjectStatus)
                  }
                >
                  <SelectTrigger
                    id="status"
                    className="border-zinc-700 bg-purple-950 text-white"
                  >
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent className="border-zinc-700 bg-purple-950 text-white">
                    <SelectItem value="novo">Novo</SelectItem>
                    <SelectItem value="em execução">Em execução</SelectItem>
                    <SelectItem value="follow-up">Follow-up</SelectItem>
                    <SelectItem value="finalizado">Finalizado</SelectItem>
                    <SelectItem value="em negociação">Em negociação</SelectItem>
                    <SelectItem value="imagem recebida">
                      Imagem recebida
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="value" className="mb-2 block text-white">
                  Valor do projeto (R$)
                </Label>
                <Input
                  id="value"
                  className="border-zinc-700 bg-purple-950 text-white placeholder:text-zinc-500 focus-visible:ring-purple-500"
                  placeholder="0,00"
                  value={projectValue}
                  onChange={(e) => {
                    // Permitir apenas números e vírgula
                    const value = e.target.value.replace(/[^0-9,.]/g, "");
                    setProjectValue(value);
                  }}
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
                onClick={saveProject}
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
