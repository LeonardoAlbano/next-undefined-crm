"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

import { Card, CardContent } from "@/components/ui/card";

const data = [
  { status: "Completos", amount: 30, color: "#00E599" },
  { status: "Pendentes", amount: 30, color: "#FFD572" },
  { status: "Não começou", amount: 42, color: "#BD63FF" },
];

export default function TotalProjectCard() {
  const totalProjects = data.reduce((sum, item) => sum + item.amount, 0);

  return (
    <Card className="overflow-hidden rounded-xl border border-[#BD63FF]/30 bg-[#1A0B2E] text-white">
      <CardContent className="p-4">
        <h3 className="mb-2 text-lg font-medium">Todos os projetos</h3>
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
      </CardContent>
    </Card>
  );
}
