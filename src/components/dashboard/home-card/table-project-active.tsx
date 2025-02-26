"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const projects = [
  {
    name: "Batman",
    lead: "Liam Risher",
    progress: 65,
    status: "Em execução",
    dueDate: "06/08/2024",
  },
  {
    name: "Bender Project",
    lead: "Oliver Noah",
    progress: 30,
    status: "Pendente",
    dueDate: "06/08/2024",
  },
  {
    name: "BigFish",
    lead: "Donald Benjamin",
    progress: 35,
    status: "Pendente",
    dueDate: "06/08/2024",
  },
  {
    name: "Canary",
    lead: "Elijah James",
    progress: 55,
    status: "Em execução",
    dueDate: "06/08/2024",
  },
  {
    name: "Casanova",
    lead: "William Risher",
    progress: 52,
    status: "Em execução",
    dueDate: "06/08/2024",
  },
];

export default function TableProjectActive() {
  return (
    <div className="rounded-xl bg-[#1A0B2E] p-4 text-white">
      <h2 className="mb-4 text-lg font-medium">Projetos Ativos</h2>
      <Table>
        <TableHeader>
          <TableRow className="border-b border-white/10 hover:bg-transparent">
            <TableHead className="text-white/70">Nome Do Projeto</TableHead>
            <TableHead className="text-white/70">Lead</TableHead>
            <TableHead className="text-white/70">Progresso</TableHead>
            <TableHead className="text-white/70">Status</TableHead>
            <TableHead className="text-white/70">Data De Entrega</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project, index) => (
            <TableRow
              key={index}
              className="border-b border-white/10 hover:bg-white/5"
            >
              <TableCell className="font-medium">{project.name}</TableCell>
              <TableCell>{project.lead}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Progress
                    value={project.progress}
                    className="h-2 w-[100px]"
                    indicatorClassName={
                      project.status === "Em execução"
                        ? "bg-[#2F80ED]"
                        : "bg-[#F2994A]"
                    }
                  />
                  <span className="text-sm">{project.progress}%</span>
                </div>
              </TableCell>
              <TableCell>
                <span
                  className={`rounded-full px-3 py-1 text-xs ${
                    project.status === "Em execução"
                      ? "bg-[#2F80ED]/10 text-[#2F80ED]"
                      : "bg-[#F2994A]/10 text-[#F2994A]"
                  }`}
                >
                  {project.status}
                </span>
              </TableCell>
              <TableCell>{project.dueDate}</TableCell>
            </TableRow>
          ))}
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
