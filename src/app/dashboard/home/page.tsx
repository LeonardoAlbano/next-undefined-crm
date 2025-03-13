"use client";

import { useEffect, useState } from "react";

import TableProjectActive from "@/components/dashboard/home-card/table-project-active";
import TotalClientsCard from "@/components/dashboard/home-card/total-clients-card";
import TotalProjectCard from "@/components/dashboard/home-card/total-project-card";
import TotalValueCard from "@/components/dashboard/home-card/total-value-card";
import { type Client, getClients } from "@/http/clients";
import { getProjects, type Project } from "@/http/projects";

// Definindo o tipo para os dados do gráfico de pizza
export interface PieChartData {
  status: string;
  amount: number;
  color: string;
}

// Definindo o tipo para o objeto de status
interface StatusCount {
  [key: string]: number;
}

export default function DashboardHome() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  // Calcular o valor total de todos os projetos
  const totalValue = projects.reduce((sum, project) => {
    return sum + (project.value || 0);
  }, 0);

  // Agrupar projetos por status
  const projectsByStatus: StatusCount = projects.reduce(
    (acc: StatusCount, project) => {
      const status = project.status || "Não definido";
      if (!acc[status]) {
        acc[status] = 0;
      }
      acc[status]++;
      return acc;
    },
    {}
  );

  // Formatar dados para o gráfico de pizza
  const pieChartData: PieChartData[] = [
    {
      status: "Completos",
      amount: projectsByStatus["finalizado"] || 0,
      color: "#00E599",
    },
    {
      status: "Pendentes",
      amount:
        (projectsByStatus["em execução"] || 0) +
        (projectsByStatus["follow-up"] || 0),
      color: "#FFD572",
    },
    {
      status: "Não começou",
      amount:
        (projectsByStatus["novo"] || 0) +
        (projectsByStatus["em negociação"] || 0) +
        (projectsByStatus["imagem recebida"] || 0),
      color: "#BD63FF",
    },
  ];

  // Filtrar projetos ativos para a tabela - mostrando todos os projetos ativos independente do cliente
  const activeProjects = projects
    .filter(
      (project) =>
        project.status === "em execução" ||
        project.status === "novo" ||
        project.status === "em negociação" ||
        project.status === "follow-up" ||
        project.status === "imagem recebida"
    )
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <TotalProjectCard
          isLoading={isLoading}
          totalProjects={projects.length}
          chartData={pieChartData}
        />
        <TotalClientsCard isLoading={isLoading} totalClients={clients.length} />
        <TotalValueCard isLoading={isLoading} totalValue={totalValue} />
      </div>

      <div className="rounded-md border">
        <TableProjectActive
          isLoading={isLoading}
          projects={activeProjects}
          clients={clients}
        />
      </div>
    </div>
  );
}
