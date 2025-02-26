"use client";

import { Card, CardContent } from "@/components/ui/card";

export default function TotalClientsCard() {
  return (
    <Card className="overflow-hidden rounded-xl border border-[#BD63FF]/30 bg-[#1A0B2E] text-white">
      <CardContent className="p-4">
        <h3 className="text-sm font-normal text-white/80">Total de clientes</h3>
        <p className="mt-2 text-3xl font-semibold">542</p>
      </CardContent>
    </Card>
  );
}
