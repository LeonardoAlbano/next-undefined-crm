"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MoreHorizontal, Plus } from "lucide-react";
import { useState } from "react";

import type { Card, Column } from "@/@types/kanban";
import { CardForm } from "@/components/kanban/card-form";
import { KanbanCard } from "@/components/kanban/kaban-card";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface KanbanColumnProps {
  column: Column;
  onAddCard: (card: Omit<Card, "id">) => void;
  onEditCard: (cardId: string, card: Omit<Card, "id">) => void;
  onDeleteCard: (cardId: string) => void;
  onDragStart: (cardId: string, columnId: string) => void;
  onDragOver: (columnId: string) => void;
  onDrop: (columnId: string) => void;
}

export function KanbanColumn({
  column,
  onAddCard,
  onEditCard,
  onDeleteCard,
  onDragStart,
  onDragOver,
  onDrop,
}: KanbanColumnProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div
      className="w-[280px] flex-shrink-0 overflow-hidden rounded-xl bg-[#2D1854]/50"
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver(column.id);
      }}
      onDrop={(e) => {
        e.preventDefault();
        onDrop(column.id);
      }}
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${column.color}`}></div>
          <h3 className="font-medium text-white">{column.title}</h3>
          <span className="text-xs text-gray-400">
            {column.totalAmount.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-400 hover:bg-transparent"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="border-purple-900 bg-[#1E0A3C]"
          >
            <DropdownMenuItem className="text-gray-300 focus:bg-purple-900 focus:text-white">
              Editar coluna
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-400 focus:bg-purple-900 focus:text-red-400">
              Excluir coluna
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-2 p-2">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-400 hover:bg-transparent hover:text-white"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Adicionar card
        </Button>

        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <CardForm
            title="Adicionar novo card"
            onSubmit={(card) => {
              onAddCard(card);
              setIsAddModalOpen(false);
            }}
            onCancel={() => setIsAddModalOpen(false)}
          />
        </Dialog>

        <motion.div layout className="space-y-2">
          <AnimatePresence>
            {column.cards.map((card) => (
              <div
                key={card.id}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData("cardId", card.id);
                  onDragStart(card.id, column.id);
                }}
              >
                <KanbanCard
                  card={card}
                  onEdit={(updatedCard) => onEditCard(card.id, updatedCard)}
                  onDelete={() => onDeleteCard(card.id)}
                />
              </div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
