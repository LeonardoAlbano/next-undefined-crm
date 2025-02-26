"use client";

import { Plus } from "lucide-react";
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
  const [isAddingColumn, setIsAddingColumn] = useState(false);
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
      setIsAddingColumn(false);
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

        {isAddingColumn ? (
          <div className="w-[280px] flex-shrink-0 rounded-xl bg-[#2D1854]/50 p-4">
            <div className="space-y-4">
              <Input
                value={newColumnTitle}
                onChange={(e) => setNewColumnTitle(e.target.value)}
                placeholder="Nome da coluna"
                className="border-purple-900 bg-[#1E0A3C] text-white"
              />

              <div>
                <label className="mb-2 block text-sm text-gray-400">
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

              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  onClick={() => setIsAddingColumn(false)}
                  className="text-gray-400 hover:bg-purple-900/20 hover:text-white"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleAddColumn}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Criar
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <Button
            variant="outline"
            className="h-12 flex-shrink-0 border border-dashed border-white/20 px-4 text-white hover:bg-purple-900/20 hover:text-white"
            onClick={() => setIsAddingColumn(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Adicionar nova coluna
          </Button>
        )}
      </div>
    </div>
  );
}
