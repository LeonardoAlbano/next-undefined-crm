"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function TotalClientsCard({
  isLoading = false,
  totalClients = 0,
}) {
  return (
    <Card className="overflow-hidden rounded-xl border border-[#BD63FF]/30 bg-[#1A0B2E] text-white">
      <CardContent className="p-4">
        <h3 className="text-sm font-normal text-white/80">Total de clientes</h3>
        {isLoading ? (
          <Skeleton className="mt-2 h-8 w-24 bg-purple-800/30" />
        ) : (
          <p className="mt-2 text-3xl font-semibold">{totalClients}</p>
        )}
      </CardContent>
    </Card>
  );
}
