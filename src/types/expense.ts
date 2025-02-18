export interface Expense {
  id: string
  employeeName: string
  title: string
  transactionDate: string
  description: string
  status: "Pending" | "Accepted" | "Declined"
  attachmentUrl: string
  attachmentPublicId: string
  useForeignCurrency: boolean
  country: string
  expenses: {
    fuel?: {
      liters: number
      totalCost: number
    }
    accommodation?: {
      nights: number
      totalCost: number
    }
    transportation?: {
      origin: string
      destination: string
      totalCost: number
    }
    perDiem?: {
      amount: number
    }
    medicalExpenses?: {
      amount: number
      description: string
    }
    otherExpenses?: {
      amount: number
      description: string
    }
  }
  createdAt: string
  updatedAt: string
}