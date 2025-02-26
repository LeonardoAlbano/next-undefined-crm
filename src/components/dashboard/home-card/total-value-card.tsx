"use client";

import { Area, AreaChart, ResponsiveContainer } from "recharts";

import { Card, CardContent } from "@/components/ui/card";

const data = [
  { value: 400 },
  { value: 300 },
  { value: 500 },
  { value: 350 },
  { value: 450 },
  { value: 500 },
];

export default function TotalValueCard() {
  return (
    <Card className="overflow-hidden rounded-xl border border-[#BD63FF]/30 bg-[#1A0B2E] text-white">
      <CardContent className="p-4">
        <h3 className="text-sm font-normal text-white/80">Valor total</h3>
        <div className="mt-2 flex items-center gap-1">
          <p className="text-3xl font-semibold">R$500.000</p>
        </div>
        <div className="mt-2 h-[32px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <Area
                type="monotone"
                dataKey="value"
                stroke="#BD63FF"
                fill="#BD63FF"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
