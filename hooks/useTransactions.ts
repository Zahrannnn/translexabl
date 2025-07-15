import { useQuery } from '@tanstack/react-query'

export interface Transaction {
  id: number
  userId: number
  userEmail: string
  transactionId: string
  orderId: string
  merchantOrderId: string
  amountCents: number
  currency: string
  status: string
  paymentMethod: string
  cardType: string
  cardLastFour: string
  createdAt: string
}

export interface TransactionResponse {
  success: boolean
  data: {
    transactions: Transaction[]
    pagination: {
      currentPage: number
      totalPages: number
      totalRecords: number
      perPage: number
    }
  }
}

async function fetchTransactions(userId: number, page: number = 1, limit: number = 10): Promise<TransactionResponse> {
  const response = await fetch(`/api/users/${userId}/transactions?page=${page}&limit=${limit}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('UNAUTHORIZED')
    }
    throw new Error('Failed to fetch transactions')
  }

  const data: TransactionResponse = await response.json()
  
  if (!data.success) {
    throw new Error('Failed to load transactions')
  }

  return data
}

export function useTransactions(userId: number | null, page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: ['transactions', userId, page, limit],
    queryFn: () => {
      if (!userId) throw new Error('User ID is required')
      return fetchTransactions(userId, page, limit)
    },
    enabled: !!userId, // Only run query if userId exists
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false, // Don't refetch on window focus for better UX
    refetchInterval: 1000 * 60 * 5, // Background refetch every 5 minutes for real-time updates
    retry: (failureCount, error) => {
      // Don't retry on authorization errors
      if (error.message === 'UNAUTHORIZED') {
        return false
      }
      return failureCount < 2
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    placeholderData: (previousData) => {
      // Keep previous data while loading new page for smoother UX
      if (previousData && page > 1) {
        return previousData
      }
      return undefined
    },
    // Provide empty state as initial data to prevent layout shifts
    initialData: () => ({
      success: true,
      data: {
        transactions: [],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalRecords: 0,
          perPage: limit
        }
      }
    }),
  })
}

// Hook for getting transaction statistics (could be used for dashboard summary)
export function useTransactionStats(userId: number | null) {
  return useQuery({
    queryKey: ['transaction-stats', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required')
      
      // Fetch all transactions to calculate stats (in a real app, this would be a separate API endpoint)
      const response = await fetchTransactions(userId, 1, 1000) // Get large batch for stats
      const transactions = response.data.transactions
      
      const totalTransactions = transactions.length
      const successfulTransactions = transactions.filter(t => t.status === 'success')
      const totalSpent = successfulTransactions.reduce((sum, t) => sum + t.amountCents, 0)
      const averageTransaction = totalSpent / successfulTransactions.length || 0
      
      return {
        totalTransactions,
        successfulTransactions: successfulTransactions.length,
        totalSpent,
        averageTransaction,
        lastTransaction: transactions[0] || null
      }
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 15, // 15 minutes
  })
} 