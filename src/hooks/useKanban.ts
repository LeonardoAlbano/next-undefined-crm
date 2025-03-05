import { useState } from "react";

import type { Card, Column } from "@/@types/kanban";

export function useKanban(initialColumns: Column[]) {
  const [columns, setColumns] = useState<Column[]>(initialColumns);

  const updateColumns = (newColumns: Column[]) => {
    setColumns(newColumns);
  };

  const addCard = (columnId: string, card: Omit<Card, "id">) => {
    const newCard: Card = {
      id: Date.now().toString(),
      ...card,
    };

    const updatedColumns = columns.map((column) => {
      if (column.id === columnId) {
        const updatedCards = [...column.cards, newCard];
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

  const editCard = (columnId: string, cardId: string, updatedCard: Partial<Card>) => {
    const updatedColumns = columns.map((column) => {
      if (column.id === columnId) {
        const updatedCards = column.cards.map((card) => {
          if (card.id === cardId) {
            return { ...card, ...updatedCard };
          }
          return card;
        });
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

  const moveCard = (fromColumnId: string, toColumnId: string, cardId: string) => {
    const updatedColumns = columns.map((column) => {
      // Remove card from source column
      if (column.id === fromColumnId) {
        const updatedCards = column.cards.filter((card) => card.id !== cardId);
        return {
          ...column,
          cards: updatedCards,
          totalAmount: updatedCards.reduce((sum, card) => sum + card.amount, 0),
        };
      }
      // Add card to target column
      if (column.id === toColumnId) {
        const cardToMove = columns.find((col) => col.id === fromColumnId)?.cards.find((card) => card.id === cardId);

        if (cardToMove) {
          const updatedCards = [...column.cards, cardToMove];
          return {
            ...column,
            cards: updatedCards,
            totalAmount: updatedCards.reduce((sum, card) => sum + card.amount, 0),
          };
        }
      }
      return column;
    });

    setColumns(updatedColumns);
  };

  return {
    columns,
    addCard,
    editCard,
    deleteCard,
    moveCard,
    updateColumns,
  };
}

