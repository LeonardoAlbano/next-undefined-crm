"use client";

import { MoreHorizontal, Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

interface Card {
  id: string;
  title: string;
  amount: number;
}

interface Column {
  id: string;
  title: string;
  totalAmount: number;
  color: string;
  cards: Card[];
}

export default function BoardPage() {
  const [columns, setColumns] = useState<Column[]>([
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
  ]);

  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [selectedColor, setSelectedColor] = useState("bg-purple-600");

  // Estados para o modal de novo card
  const [newCardTitle, setNewCardTitle] = useState("");
  const [newCardAmount, setNewCardAmount] = useState("");
  const [, setSelectedColumnId] = useState<string | null>(null);

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

  const addColumn = () => {
    if (newColumnTitle.trim()) {
      const newColumn: Column = {
        id: Date.now().toString(),
        title: newColumnTitle,
        totalAmount: 0,
        color: selectedColor,
        cards: [],
      };
      setColumns([...columns, newColumn]);
      setNewColumnTitle("");
      setIsAddingColumn(false);
    }
  };

  const addCard = (columnId: string, isOpen: boolean) => {
    if (!isOpen) {
      // Resetar os estados quando o modal fecha
      setNewCardTitle("");
      setNewCardAmount("");
      setSelectedColumnId(null);
      return;
    }

    if (newCardTitle && newCardAmount) {
      const amount = Number.parseFloat(newCardAmount.replace(/\D/g, "")) / 100;

      const updatedColumns = columns.map((column) => {
        if (column.id === columnId) {
          const newCard = {
            id: Date.now().toString(),
            title: newCardTitle,
            amount: amount,
          };
          const updatedCards = [...column.cards, newCard];
          return {
            ...column,
            cards: updatedCards,
            totalAmount: updatedCards.reduce(
              (sum, card) => sum + card.amount,
              0
            ),
          };
        }
        return column;
      });

      setColumns(updatedColumns);
      setNewCardTitle("");
      setNewCardAmount("");
      setSelectedColumnId(null);
    }
  };

  const deleteCard = (columnId: string, cardId: string) => {
    const updatedColumns = columns.map((column) => {
      if (column.id === columnId) {
        const updatedCards = column.cards.filter((card) => card.id !== cardId);
        return {
          ...column,
          cards: updatedCards,
          totalAmount: updatedCards.reduce((sum, card) => sum + card.amount, 0),
        };
      }
      return column;
    });
    setColumns(updatedColumns);
  };

  // Função para formatar o input de valor monetário
  const formatCurrency = (value: string) => {
    const onlyNumbers = value.replace(/\D/g, "");
    const amount = (Number.parseInt(onlyNumbers) / 100).toLocaleString(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL",
      }
    );
    return amount;
  };

  return (
    <div className="flex min-h-screen items-start justify-center bg-blackpurple py-8">
      <div className="flex gap-4">
        {columns.map((column) => (
          <div
            key={column.id}
            className="w-[280px] flex-shrink-0 overflow-hidden rounded-xl bg-[#2D1854]/50"
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

            <div className="max-h-[calc(100vh-200px)] space-y-2 overflow-y-auto p-2">
              {column.cards.map((card) => (
                <div key={card.id} className="rounded-lg bg-[#1E0A3C] p-3">
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
                        <DropdownMenuItem className="text-gray-300 focus:bg-purple-900 focus:text-white">
                          Editar card
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-400 focus:bg-purple-900 focus:text-red-400"
                          onClick={() => deleteCard(column.id, card.id)}
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
                </div>
              ))}

              <Dialog
                onOpenChange={(isOpen) => {
                  if (!isOpen) {
                    setNewCardTitle("");
                    setNewCardAmount("");
                  }
                  setSelectedColumnId(isOpen ? column.id : null);
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-400 hover:bg-transparent hover:text-white"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar card
                  </Button>
                </DialogTrigger>
                <DialogContent className="border-purple-900 bg-[#1E0A3C]">
                  <DialogHeader>
                    <DialogTitle className="text-white">
                      Adicionar novo card
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">
                        Nome do projeto
                      </label>
                      <Input
                        value={newCardTitle}
                        onChange={(e) => setNewCardTitle(e.target.value)}
                        placeholder="Digite o nome do projeto"
                        className="border-purple-900 bg-[#2D1854]/50 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">Valor</label>
                      <Input
                        value={newCardAmount}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          setNewCardAmount(formatCurrency(value));
                        }}
                        placeholder="R$ 0,00"
                        className="border-purple-900 bg-[#2D1854]/50 text-white"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setNewCardTitle("");
                          setNewCardAmount("");
                          setSelectedColumnId(null);
                        }}
                        className="text-gray-400 hover:bg-purple-900/20 hover:text-white"
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={() => addCard(column.id, true)}
                        disabled={!newCardTitle || !newCardAmount}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        Adicionar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
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
                  onClick={addColumn}
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
