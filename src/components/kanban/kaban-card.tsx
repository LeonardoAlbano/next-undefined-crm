"use client";

import { motion } from "framer-motion";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";

import type { Card } from "@/@types/kanban";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { CardForm } from "./card-form";

interface KanbanCardProps {
  card: Card;
  onEdit: (updatedCard: Omit<Card, "id">) => void;
  onDelete: () => void;
}

export function KanbanCard({ card, onEdit, onDelete }: KanbanCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="cursor-move rounded-lg bg-[#1E0A3C] p-3"
    >
      <div className="mb-2 flex items-center justify-between">
        <h4 className="font-medium text-white">{card.title}</h4>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-gray-400 hover:bg-transparent"
            >
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="border-purple-900 bg-[#1E0A3C]"
          >
            <DropdownMenuItem
              className="text-gray-300 focus:bg-purple-900 focus:text-white"
              onSelect={() => setIsEditModalOpen(true)}
            >
              Editar card
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-400 focus:bg-purple-900 focus:text-red-400"
              onSelect={onDelete}
            >
              Excluir card
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex items-center text-sm text-gray-400">
        <span>
          {card.amount.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </span>
      </div>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <CardForm
          title="Editar card"
          initialData={card}
          onSubmit={(updatedCard) => {
            onEdit(updatedCard);
            setIsEditModalOpen(false);
          }}
          onCancel={() => setIsEditModalOpen(false)}
        />
      </Dialog>
    </motion.div>
  );
}
