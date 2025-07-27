"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  DollarSign, 
  ArrowLeft, 
  Search, 
  CreditCard, 
  Calendar,
  User,
  Filter,
  TrendingUp,
  BarChart3,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Copy,
  Check,
  X
} from "lucide-react"
import Link from "next/link"

interface UserInfo {
  userId: number
  username: string
  email: string
  role: string
}

interface Transaction {
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

interface TransactionDetails {
  id: number
  transactionId: string
  orderId: string
  merchantOrderId: string
  userId: number
  userEmail: string
  amount: number
  amountCents: number
  currency: string
  status: string
  paymentMethod: string
  cardType: string
  cardLastFour: string
  createdAt: string
  notes: string | null
}

interface TransactionDetailsResponse {
  success: boolean
  data: TransactionDetails
}

interface TransactionSummary {
  totalTransactions: number
  totalAmountCents: number
  successRate: number
  todayTransactions: number
  todayAmountCents: number
}

interface TransactionData {
  transactions: Transaction[]
  summary: TransactionSummary
  pagination: {
    currentPage: number
    totalPages: number
    totalRecords: number
    perPage: number
  }
}

interface ApiResponse {
  success: boolean
  data: TransactionData
}

export default function AdminTransactionsPage() {
  const [user, setUser] = useState<UserInfo | null>(null)
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("ALL")
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const router = useRouter()

  // Fetch transactions using React Query
  const { data: transactionResponse, isLoading, error } = useQuery<ApiResponse>({
    queryKey: ['admin-transactions'],
    queryFn: async () => {
      const response = await fetch('/api/admin/transactions')
      if (!response.ok) {
        throw new Error('Failed to fetch transactions')
      }
      const data = await response.json()
      
      // Handle both direct data and wrapped data structures
      if (data.success && data.data) {
        return data
      } else if (data.transactions) {
        // Direct data structure
        return { success: true, data: data }
      } else {
        throw new Error('Invalid response format')
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  })

  // Fetch transaction details
  const { data: transactionDetails, isLoading: isDetailsLoading, error: detailsError } = useQuery<TransactionDetailsResponse>({
    queryKey: ['transaction-details', selectedTransactionId],
    queryFn: async () => {
      if (!selectedTransactionId) throw new Error('No transaction ID provided')
      
      console.log('Fetching transaction details for ID:', selectedTransactionId)
      const response = await fetch(`/api/transactions/${selectedTransactionId}`)
      console.log('API response status:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('API error response:', errorText)
        
        // Try to parse error response for more details
        try {
          const errorData = JSON.parse(errorText)
          if (errorData.error) {
            throw new Error(errorData.error + (errorData.details ? `: ${errorData.details}` : ''))
          }
        } catch {
          // If we can't parse the error, use the raw text
        }
        
        throw new Error(`API request failed with status ${response.status}: ${errorText}`)
      }
      
      const data = await response.json()
      console.log('API response data:', data)
      
      // Validate that the returned transaction ID matches the requested one
      if (data.success && data.data && data.data.transactionId !== selectedTransactionId) {
        console.warn('Transaction ID mismatch:', {
          requested: selectedTransactionId,
          returned: data.data.transactionId
        })
        
        // Still return the data but log the mismatch
        // The user will see the actual transaction data that was returned
      }
      
      return data
    },
    enabled: !!selectedTransactionId && isDetailsOpen,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })

  const transactionData = transactionResponse?.data

  useEffect(() => {
    // Check if user is admin
    const getUserFromCookie = () => {
      const cookies = document.cookie.split(';')
      const userCookie = cookies.find(cookie => cookie.trim().startsWith('user='))
      
      if (userCookie) {
        try {
          const userValue = userCookie.split('=')[1]
          const userData = JSON.parse(decodeURIComponent(userValue))
          
          if (userData.role !== 'ADMIN') {
            router.push('/dashboard')
            return
          }
          
          setUser(userData)
        } catch (error) {
          console.error('Error parsing user cookie:', error)
          router.push('/login')
        }
      } else {
        router.push('/login')
      }
    }

    getUserFromCookie()
  }, [router])

  useEffect(() => {
    // Filter transactions based on search term and status filter
    if (!transactionData) return

    let filtered = transactionData.transactions

    if (searchTerm) {
      filtered = filtered.filter(transaction => 
        transaction.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.merchantOrderId.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== "ALL") {
      filtered = filtered.filter(transaction => transaction.status === statusFilter)
    }

    setFilteredTransactions(filtered)
  }, [transactionData, searchTerm, statusFilter])

  const formatAmount = (amountCents: number, currency: string) => {
    const amount = amountCents / 100
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency === 'EEP' ? 'EGP' : currency, // Handle EEP as EGP
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'refunded':
        return <XCircle className="h-4 w-4 text-orange-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800">Success</Badge>
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case 'refunded':
        return <Badge className="bg-orange-100 text-orange-800">Refunded</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(fieldName)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleViewDetails = (transactionId: string) => {
    console.log('handleViewDetails called with transactionId:', transactionId)
    console.log('Current transactions:', filteredTransactions.map(t => ({ id: t.id, transactionId: t.transactionId })))
    
    // Verify the transaction exists in the current list
    const transaction = filteredTransactions.find(t => t.transactionId === transactionId)
    if (!transaction) {
      console.warn('Transaction not found in current list:', transactionId)
    } else {
      console.log('Found transaction:', transaction)
    }
    
    setSelectedTransactionId(transactionId)
    setIsDetailsOpen(true)
  }

  const handleCloseDetails = () => {
    setIsDetailsOpen(false)
    setSelectedTransactionId(null)
  }

  const renderDetailField = (label: string, value: string | number | null, fieldKey: string, copyable = false) => (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}:</span>
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-900 dark:text-white">
          {value || 'N/A'}
        </span>
        {copyable && value && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(value.toString(), fieldKey)}
            className="h-6 w-6 p-0"
          >
            {copiedField === fieldKey ? (
              <Check className="h-3 w-3 text-green-500" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
        )}
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading transactions...</p>
        </div>
      </div>
    )
  }

  if (!user || user.role !== 'ADMIN') {
    return null
  }

  return (
    <div className="min-h-screen py-10">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/admin">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Admin
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                <DollarSign className="h-8 w-8 mr-3 text-green-600" />
                Transaction Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Monitor payments and financial transactions
              </p>
            </div>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Total Transactions: {filteredTransactions.length}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error instanceof Error ? error.message : 'Failed to load transactions'}</p>
          </div>
        )}

        {/* Summary Cards */}
        {transactionData?.summary && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <Card className="bg-white dark:bg-gray-800 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Transactions
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {transactionData.summary.totalTransactions}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatAmount(transactionData.summary.totalAmountCents, 'EGP')}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Success Rate
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {transactionData.summary.successRate.toFixed(1)}%
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Today&apos;s Transactions
                </CardTitle>
                <Calendar className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {transactionData.summary.todayTransactions}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Today&apos;s Revenue
                </CardTitle>
                <CreditCard className="h-4 w-4 text-indigo-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatAmount(transactionData.summary.todayAmountCents, 'EGP')}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by email, transaction ID, order ID, or merchant order ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="sm:w-48">
                <label htmlFor="status-filter" className="sr-only">Filter by status</label>
                <select
                  id="status-filter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option className="text-gray-500" value="ALL">All Status</option>
                  <option className="text-gray-500" value="success">Success</option>
                  <option className="text-gray-500" value="failed">Failed</option>
                  <option className="text-gray-500" value="pending">Pending</option>
                  <option className="text-gray-500" value="refunded">Refunded</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Transaction</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">User</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Amount</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Payment Method</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <div className="font-medium text-gray-900 dark:text-white">
                            #{transaction.transactionId}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Order: {transaction.orderId}
                          </div>
                          <div className="text-xs text-gray-400 dark:text-gray-500">
                            Merchant: {transaction.merchantOrderId}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-900 dark:text-white">
                            {transaction.userEmail}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {formatAmount(transaction.amountCents, transaction.currency)}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {transaction.cardType}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            •••• {transaction.cardLastFour}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(transaction.status)}
                          {getStatusBadge(transaction.status)}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {formatDate(transaction.createdAt)}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(transaction.transactionId)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {filteredTransactions.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No transactions found
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {searchTerm || statusFilter !== "ALL" 
                    ? "Try adjusting your search or filters" 
                    : "No transactions have been processed yet"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Transaction Details Modal */}
      {isDetailsOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Transaction Details
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCloseDetails}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="p-6">
              {isDetailsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-sm text-gray-600">Loading details...</span>
                </div>
              ) : detailsError ? (
                <div className="text-center py-8">
                  <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Failed to load transaction details
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    {detailsError instanceof Error ? detailsError.message : 'There was an issue retrieving the transaction information.'}
                  </p>
                  <div className="text-xs text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800 rounded p-3">
                    <div>Transaction ID: {selectedTransactionId}</div>
                    {detailsError && (
                      <div className="mt-2 text-red-500 text-left">
                        <strong>Error Details:</strong><br />
                        {detailsError instanceof Error ? detailsError.message : JSON.stringify(detailsError)}
                      </div>
                    )}
                  </div>
                </div>
              ) : transactionDetails?.success && transactionDetails?.data ? (
                <div className="space-y-6">
                  {/* Transaction Info */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Transaction Information
                    </h3>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
                      {renderDetailField('Transaction ID', transactionDetails.data.transactionId, 'transactionId', true)}
                      {renderDetailField('Order ID', transactionDetails.data.orderId, 'orderId', true)}
                      {renderDetailField('Merchant Order ID', transactionDetails.data.merchantOrderId, 'merchantOrderId', true)}
                      {renderDetailField('Status', transactionDetails.data.status, 'status')}
                      {renderDetailField('Created At', formatDate(transactionDetails.data.createdAt), 'createdAt')}
                    </div>
                  </div>

                  {/* User Info */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      User Information
                    </h3>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
                      {renderDetailField('User ID', transactionDetails.data.userId, 'userId')}
                      {renderDetailField('Email', transactionDetails.data.userEmail, 'userEmail', true)}
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Payment Information
                    </h3>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
                      {renderDetailField('Amount', formatAmount(transactionDetails.data.amountCents, transactionDetails.data.currency), 'amount')}
                      {renderDetailField('Amount (Cents)', transactionDetails.data.amountCents, 'amountCents')}
                      {renderDetailField('Currency', transactionDetails.data.currency, 'currency')}
                      {renderDetailField('Payment Method', transactionDetails.data.paymentMethod, 'paymentMethod')}
                      {renderDetailField('Card Type', transactionDetails.data.cardType, 'cardType')}
                      {renderDetailField('Card Last Four', `•••• ${transactionDetails.data.cardLastFour}`, 'cardLastFour')}
                    </div>
                  </div>

                  {/* Notes */}
                  {transactionDetails.data.notes && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        Notes
                      </h3>
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {transactionDetails.data.notes}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No transaction data available
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    The transaction details could not be loaded.
                  </p>
                  <div className="text-xs text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800 rounded p-3">
                    Transaction ID: {selectedTransactionId}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 