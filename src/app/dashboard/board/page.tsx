"use client";

import { useState } from "react";

import { KanbanColumn } from "@/components/kanban/kaban-column";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useKanban } from "@/hooks/useKanban";
import type { Column } from "@/types/kanban";

const initialColumns: Column[] = [
  {
    id: "1",
    title: "Fechamento",
    totalAmount: 0,
    color: "bg-purple-600",
    cards: [],
  },
  {
    id: "2",
    title: "Em execução",
    totalAmount: 0,
    color: "bg-orange-500",
    cards: [],
  },
];

export default function BoardPage() {
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [selectedColor, setSelectedColor] = useState("bg-purple-600");
  const [dragInfo, setDragInfo] = useState<{
    cardId: string;
    sourceColumnId: string;
  } | null>(null);

  const { columns, addCard, editCard, deleteCard, moveCard, updateColumns } =
    useKanban(initialColumns);

  const colors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-green-500",
    "bg-teal-500",
    "bg-blue-500",
    "bg-indigo-500",
    "bg-purple-600",
    "bg-pink-500",
    "bg-rose-500",
  ];

  const handleAddColumn = () => {
    if (newColumnTitle.trim()) {
      const newColumn: Column = {
        id: Date.now().toString(),
        title: newColumnTitle,
        totalAmount: 0,
        color: selectedColor,
        cards: [],
      };
      updateColumns([...columns, newColumn]);
      setNewColumnTitle("");
    }
  };

  const handleDragStart = (cardId: string, columnId: string) => {
    setDragInfo({ cardId, sourceColumnId: columnId });
  };

  const handleDragOver = (columnId: string) => {
    if (dragInfo && dragInfo.sourceColumnId !== columnId) {
      // Apenas visual feedback aqui
    }
  };

  const handleDrop = (targetColumnId: string) => {
    if (dragInfo && dragInfo.sourceColumnId !== targetColumnId) {
      moveCard(dragInfo.sourceColumnId, targetColumnId, dragInfo.cardId);
      setDragInfo(null);
    }
  };

  return (
    <div className="flex min-h-screen items-start justify-center bg-blackpurple py-8">
      <div className="flex gap-4">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            onAddCard={(card) => addCard(column.id, card)}
            onEditCard={(cardId, card) => editCard(column.id, cardId, card)}
            onDeleteCard={(cardId) => deleteCard(column.id, cardId)}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          />
        ))}

        <div className="w-[280px] flex-shrink-0 rounded-xl bg-white/5 p-4 backdrop-blur-sm">
          <Input
            value={newColumnTitle}
            onChange={(e) => setNewColumnTitle(e.target.value)}
            placeholder="Nome da coluna"
            className="border-white/20 bg-white/10 text-white placeholder:text-white/50"
          />

          <div className="mt-4">
            <label className="mb-2 block text-sm text-white/70">
              Cor da coluna
            </label>
            <div className="grid grid-cols-5 gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  className={`h-6 w-6 rounded-full ${color} ${selectedColor === color ? "ring-2 ring-white" : ""}`}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>

          <div className="mt-4">
            <Button
              onClick={handleAddColumn}
              disabled={!newColumnTitle.trim()}
              className="w-full border-0 bg-white/10 text-white hover:bg-white/20"
            >
              Criar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
