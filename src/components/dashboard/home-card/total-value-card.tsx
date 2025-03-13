"use client";

import { useEffect, useState } from "react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ValueData {
  value: number;
}

interface TotalValueCardProps {
  isLoading?: boolean;
  totalValue?: number;
}

export default function TotalValueCard({
  isLoading = false,
  totalValue = 0,
}: TotalValueCardProps) {
  const [valueHistory, setValueHistory] = useState<ValueData[]>([
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
  ]);

  useEffect(() => {
    // Aqui você poderia buscar o histórico de valores se tiver essa API
    // Por enquanto, vamos simular com o valor atual no final
    if (!isLoading && totalValue > 0) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      setValueHistory((prev) => {
        // Criar um histórico simulado com base no valor total
        const baseValue = totalValue / 1000;
        return [
          { value: baseValue * 0.8 },
          { value: baseValue * 0.6 },
          { value: baseValue * 0.9 },
          { value: baseValue * 0.7 },
          { value: baseValue * 0.85 },
          { value: baseValue },
        ];
      });
    } else if (!isLoading) {
      // Se não houver valor, zerar o histórico
      setValueHistory([
        { value: 0 },
        { value: 0 },
        { value: 0 },
        { value: 0 },
        { value: 0 },
        { value: 0 },
      ]);
    }
  }, [isLoading, totalValue]);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <Card className="overflow-hidden rounded-xl border border-[#BD63FF]/30 bg-[#1A0B2E] text-white">
      <CardContent className="p-4">
        <h3 className="text-sm font-normal text-white/80">Valor total</h3>
        <div className="mt-2 flex items-center gap-1">
          {isLoading ? (
            <Skeleton className="h-8 w-32 bg-purple-800/30" />
          ) : (
            <p className="text-3xl font-semibold">
              {formatCurrency(totalValue)}
            </p>
          )}
        </div>
        <div className="mt-2 h-[32px]">
          {isLoading ? (
            <Skeleton className="h-full w-full bg-purple-800/30" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={valueHistory}>
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
          )}
        </div>
      </CardContent>
    </Card>
  );
}
