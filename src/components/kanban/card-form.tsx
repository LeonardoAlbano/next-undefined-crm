"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { Card } from "@/@types/kanban";

interface CardFormProps {
  onSubmit: (data: Omit<Card, "id">) => void;
  onCancel: () => void;
  initialData?: Card;
  title: string;
}

export function CardForm({
  onSubmit,
  onCancel,
  initialData,
  title,
}: CardFormProps) {
  const [cardTitle, setCardTitle] = useState(initialData?.title ?? "");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (initialData) {
      setCardTitle(initialData.title);
      setAmount(formatCurrency(String(initialData.amount * 100)));
    }
  }, [initialData]);

  const formatCurrency = (value: string) => {
    const onlyNumbers = value.replace(/\D/g, "");
    return (Number.parseInt(onlyNumbers) / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const handleSubmit = () => {
    if (cardTitle && amount) {
      const numericAmount = Number.parseFloat(amount.replace(/\D/g, "")) / 100;
      onSubmit({
        title: cardTitle,
        amount: numericAmount,
      });
    }
  };

  return (
    <DialogContent
      className="border-purple-900 bg-[#1E0A3C]"
      onClick={(e) => e.stopPropagation()}
    >
      <DialogHeader>
        <DialogTitle className="text-white">{title}</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 pt-4">
        <div className="space-y-2">
          <label className="text-sm text-gray-400">Nome do projeto</label>
          <Input
            value={cardTitle}
            onChange={(e) => setCardTitle(e.target.value)}
            placeholder="Digite o nome do projeto"
            className="border-purple-900 bg-[#2D1854]/50 text-white"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-gray-400">Valor</label>
          <Input
            value={amount}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              setAmount(formatCurrency(value));
            }}
            placeholder="R$ 0,00"
            className="border-purple-900 bg-[#2D1854]/50 text-white"
          />
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            className="text-gray-400 hover:bg-purple-900/20 hover:text-white"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!cardTitle || !amount}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {initialData ? "Salva" : "Adicionar"}
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}
