import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

// Future transaction mutation actions
interface RefundTransactionParams {
  transactionId: string
  reason?: string
}

interface UpdateTransactionStatusParams {
  transactionId: string
  status: string
}

// Refund transaction mutation (for admin/future use)
async function refundTransaction(params: RefundTransactionParams) {
  const response = await fetch(`/api/transactions/${params.transactionId}/refund`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ reason: params.reason }),
  })

  if (!response.ok) {
    throw new Error('Failed to process refund')
  }

  return response.json()
}

// Update transaction status (for admin use)
async function updateTransactionStatus(params: UpdateTransactionStatusParams) {
  const response = await fetch(`/api/transactions/${params.transactionId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status: params.status }),
  })

  if (!response.ok) {
    throw new Error('Failed to update transaction status')
  }

  return response.json()
}

export function useTransactionMutations(userId?: number) {
  const queryClient = useQueryClient()

  const refundMutation = useMutation({
    mutationFn: refundTransaction,
    onSuccess: (data, variables) => {
      // Invalidate and refetch transactions
      queryClient.invalidateQueries({
        queryKey: ['transactions', userId],
      })
      
      toast.success('Transaction refunded successfully')
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to process refund')
    },
  })

  const updateStatusMutation = useMutation({
    mutationFn: updateTransactionStatus,
    onSuccess: (data, variables) => {
      // Optimistically update the cache
      queryClient.setQueryData(['transactions', userId], (oldData: any) => {
        if (!oldData) return oldData
        
        return {
          ...oldData,
          data: {
            ...oldData.data,
            transactions: oldData.data.transactions.map((transaction: any) =>
              transaction.transactionId === variables.transactionId
                ? { ...transaction, status: variables.status }
                : transaction
            ),
          },
        }
      })
      
      toast.success('Transaction status updated successfully')
    },
    onError: (error) => {
      // Invalidate on error to refetch correct data
      queryClient.invalidateQueries({
        queryKey: ['transactions', userId],
      })
      
      toast.error(error.message || 'Failed to update transaction status')
    },
  })

  return {
    refundTransaction: refundMutation.mutate,
    updateTransactionStatus: updateStatusMutation.mutate,
    isRefunding: refundMutation.isPending,
    isUpdatingStatus: updateStatusMutation.isPending,
  }
} 