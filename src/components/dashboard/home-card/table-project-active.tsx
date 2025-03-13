/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { format, parseISO } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Client } from "@/http/clients";
import type { Project } from "@/http/projects";

// Definindo o tipo para os projetos padrão
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface DefaultProject {
  name: string;
  clientName: string;
  status: string;
  endDate: string;
  startDate?: string;
  clientId?: number;
}

interface TableProjectActiveProps {
  isLoading?: boolean;
  projects?: Project[];
  clients?: Client[];
}

// Função auxiliar para calcular o progresso com base nas datas
const calculateProgress = (
  startDate: string | undefined,
  endDate: string | undefined
): number => {
  if (!startDate || !endDate) return 0;

  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();

    // Se o projeto ainda não começou
    if (today < start) return 0;

    // Se o projeto já terminou
    if (today > end) return 100;

    // Calcular progresso
    const totalDuration = end.getTime() - start.getTime();
    const elapsedDuration = today.getTime() - start.getTime();

    return Math.round((elapsedDuration / totalDuration) * 100);
  } catch (error) {
    console.error("Erro ao calcular progresso:", error);
    return 0;
  }
};

// Função para formatar a data
const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return "-";

  try {
    return format(parseISO(dateString), "dd/MM/yyyy");
  } catch (error) {
    console.error("Erro ao formatar data:", error);
    return dateString;
  }
};

// Função para obter o nome do cliente
const getClientName = (clientId?: number, clients: Client[] = []): string => {
  if (!clientId) return "-";
  const client = clients.find((c) => c.id === clientId);
  return client ? `${client.name} ${client.surname}` : "-";
};

export default function TableProjectActive({
  isLoading = false,
  projects = [],
  clients = [],
}: TableProjectActiveProps) {
  // Não usaremos mais os dados fictícios, apenas os projetos reais
  const projectsData = projects;

  return (
    <div className="rounded-xl bg-[#1A0B2E] p-4 text-white">
      <h2 className="mb-4 text-lg font-medium">Projetos Ativos</h2>
      <Table>
        <TableHeader>
          <TableRow className="border-b border-white/10 hover:bg-transparent">
            <TableHead className="text-white/70">Nome Do Projeto</TableHead>
            <TableHead className="text-white/70">Cliente</TableHead>
            <TableHead className="text-white/70">Progresso</TableHead>
            <TableHead className="text-white/70">Status</TableHead>
            <TableHead className="text-white/70">Data De Entrega</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array(5)
              .fill(0)
              .map((_, index) => (
                <TableRow key={index} className="border-b border-white/10">
                  <TableCell>
                    <Skeleton className="h-5 w-32 bg-purple-800/30" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-24 bg-purple-800/30" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-28 bg-purple-800/30" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-20 bg-purple-800/30" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-24 bg-purple-800/30" />
                  </TableCell>
                </TableRow>
              ))
          ) : projectsData.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="h-24 text-center font-bold text-white"
              >
                Nenhum projeto ativo encontrado.
              </TableCell>
            </TableRow>
          ) : (
            projectsData.map((project, index) => {
              // Calcular progresso baseado nas datas
              const progress = calculateProgress(
                project.startDate,
                project.endDate
              );

              // Formatar status para exibição
              const displayStatus =
                project.status === "em execução"
                  ? "Em execução"
                  : project.status === "em negociação"
                    ? "Em negociação"
                    : project.status === "follow-up"
                      ? "Follow-up"
                      : project.status === "imagem recebida"
                        ? "Imagem recebida"
                        : project.status === "novo"
                          ? "Novo"
                          : project.status || "Pendente";

              // Obter nome do cliente com verificação de tipo segura
              let clientName = "-";
              if ("clientName" in project && project.clientName) {
                clientName = project.clientName;
              } else if (project && typeof project === "object") {
                // Verificação segura para acessar clientId
                const projectAny = project as any;
                if (
                  projectAny.clientId &&
                  typeof projectAny.clientId === "number"
                ) {
                  clientName = getClientName(projectAny.clientId, clients);
                }
              }

              return (
                <TableRow
                  key={index}
                  className="border-b border-white/10 hover:bg-white/5"
                >
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell>{clientName}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="relative h-2 w-[100px] overflow-hidden rounded-full bg-white/10">
                        <div
                          className={`absolute left-0 top-0 h-full rounded-full ${
                            displayStatus === "Em execução"
                              ? "bg-[#2F80ED]"
                              : "bg-[#F2994A]"
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-sm">{progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`rounded-full px-3 py-1 text-xs ${
                        displayStatus === "Em execução"
                          ? "bg-[#2F80ED]/10 text-[#2F80ED]"
                          : displayStatus === "Follow-up"
                            ? "bg-[#F2994A]/10 text-[#F2994A]"
                            : displayStatus === "Novo"
                              ? "bg-[#BD63FF]/10 text-[#BD63FF]"
                              : displayStatus === "Imagem recebida"
                                ? "bg-[#00E599]/10 text-[#00E599]"
                                : displayStatus === "Em negociação"
                                  ? "bg-[#F2994A]/10 text-[#F2994A]"
                                  : "bg-white/10 text-white"
                      }`}
                    >
                      {displayStatus}
                    </span>
                  </TableCell>
                  <TableCell>{formatDate(project.endDate)}</TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
      <div className="mt-4 flex items-center justify-end gap-2">
        <button className="rounded-lg p-2 hover:bg-white/5">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button className="rounded-lg p-2 hover:bg-white/5">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
