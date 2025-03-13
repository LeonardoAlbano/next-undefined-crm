"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

import type { PieChartData } from "@/app/dashboard/home/page";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface TotalProjectCardProps {
  isLoading?: boolean;
  totalProjects?: number;
  chartData?: PieChartData[];
}

export default function TotalProjectCard({
  isLoading = false,
  totalProjects = 0,
  chartData = [],
}: TotalProjectCardProps) {
  // Usar os dados passados por props ou dados vazios se não fornecidos
  // Não usaremos mais dados fictícios
  const data: PieChartData[] = chartData;

  return (
    <Card className="overflow-hidden rounded-xl border border-[#BD63FF]/30 bg-[#1A0B2E] text-white">
      <CardContent className="p-4">
        <h3 className="mb-2 text-lg font-medium">Todos os projetos</h3>
        {isLoading ? (
          <div className="flex items-center gap-6">
            <Skeleton className="h-24 w-24 rounded-full bg-purple-800/30" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-20 bg-purple-800/30" />
              <Skeleton className="h-4 w-20 bg-purple-800/30" />
              <Skeleton className="h-4 w-20 bg-purple-800/30" />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-6">
            <div className="relative flex h-24 w-24 items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="amount"
                    cx="50%"
                    cy="50%"
                    outerRadius={40}
                    innerRadius={30}
                    startAngle={90}
                    endAngle={-270}
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        strokeWidth={0}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-bold">{totalProjects}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {data.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">{item.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
