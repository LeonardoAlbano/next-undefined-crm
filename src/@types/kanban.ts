export interface Card {
    id: string
    title: string
    amount: number
  }
  
  export interface Column {
    id: string
    title: string
    totalAmount: number
    color: string
    cards: Card[]
  }

  
  
  