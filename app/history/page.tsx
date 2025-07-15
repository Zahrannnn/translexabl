"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  CreditCard, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  ArrowLeft,
  Loader2,
  RefreshCw,
  Receipt,
  User,
  Mail,

  Clock
} from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { useTransactions } from "@/hooks/useTransactions"
import { useAuth } from "@/hooks/useAuth"

export default function TransactionHistoryPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const router = useRouter()
  
  // Use custom hooks for auth and transactions
  const { user, isLoading: authLoading, requireAuth } = useAuth()
  const { 
    data: transactionResponse, 
    isLoading: transactionsLoading, 
    error, 
    refetch, 
    isFetching 
  } = useTransactions(user?.userId || null, currentPage, 10)

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !requireAuth()) {
      return
    }
  }, [authLoading, requireAuth])

  // Handle authorization errors
  useEffect(() => {
    if (error && error.message === 'UNAUTHORIZED') {
      router.push('/login')
    }
  }, [error, router])

  const handleRefresh = () => {
    refetch()
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  const formatAmount = (amountCents: number, currency: string) => {
    const amount = amountCents / 100
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency === 'EEP' ? 'EGP' : currency, // Handle typo in sample data
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
        return <CheckCircle className="h-4 w-4" />
      case 'pending':
        return <AlertCircle className="h-4 w-4" />
      case 'failed':
        return <XCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  // Extract data from React Query response
  const transactions = transactionResponse?.data.transactions || []
  const pagination = transactionResponse?.data.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    perPage: 10
  }

  // Show loading state while auth is loading or transactions are loading initially (but not when we have data and are refetching)
  if (authLoading || (transactionsLoading && !transactionResponse)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="mt-4 text-muted-foreground">
                {authLoading ? 'Checking authentication...' : 'Loading your transaction history...'}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Don't render if user is not available (will be redirected)
  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="hover-lift">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold gradient-text">Transaction History</h1>
              <p className="text-muted-foreground mt-1">
                View all your payment transactions and credit purchases
              </p>
            </div>
          </div>
          
          <Button 
            onClick={handleRefresh} 
            disabled={isFetching}
            variant="outline"
            className="hover-lift"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* User Info Card */}
        <Card className="modern-card mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5 text-primary" />
              <span>Account Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Email:</span>
                <span className="font-medium">{user.email}</span>
              </div>
             
            </div>
          </CardContent>
        </Card>

        {/* Error State */}
        {error && error.message !== 'UNAUTHORIZED' && (
          <Card className="modern-card mb-8 border-red-200">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                <span>{error.message}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Transactions Summary */}
        <Card className="modern-card mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Receipt className="h-5 w-5 text-primary" />
              <span>Transaction Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{pagination.totalRecords}</div>
                <div className="text-sm text-muted-foreground">Total Transactions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {transactions.filter(t => t.status === 'success').length}
                </div>
                <div className="text-sm text-muted-foreground">Successful</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">
                  {formatAmount(
                    transactions
                      .filter(t => t.status === 'success')
                      .reduce((sum, t) => sum + t.amountCents, 0),
                    'EGP'
                  )}
                </div>
                <div className="text-sm text-muted-foreground">Total Spent</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions List */}
        <Card className="modern-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5 text-primary" />
              <span>Recent Transactions</span>
              {isFetching && <Loader2 className="h-4 w-4 animate-spin text-primary ml-2" />}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <div className="text-center py-12">
                <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">No transactions found</h3>
                <p className="text-muted-foreground mb-4">You haven&apos;t made any transactions yet.</p>
                <Link href="/pricing">
                  <Button className="hover-lift">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Purchase Credits
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(transaction.status)}
                          <Badge className={getStatusColor(transaction.status)}>
                            {transaction.status.toUpperCase()}
                          </Badge>
                        </div>
                        <div>
                          <div className="font-semibold">
                            {formatAmount(transaction.amountCents, transaction.currency)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {transaction.paymentMethod === 'card' && transaction.cardType && (
                              <span className="flex items-center space-x-1">
                                <CreditCard className="h-3 w-3" />
                                <span>{transaction.cardType} •••• {transaction.cardLastFour}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{formatDate(transaction.createdAt)}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          ID: {transaction.transactionId}
                        </div>
                      </div>
                    </div>
                    
                    {/* Additional transaction details */}
                    <div className="mt-3 pt-3 border-t border-muted grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-muted-foreground">
                      <div>Order ID: {transaction.orderId}</div>
                      <div>Merchant Order: {transaction.merchantOrderId}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-8">
            <div className="text-sm text-muted-foreground">
              Showing {((pagination.currentPage - 1) * pagination.perPage) + 1} to{' '}
              {Math.min(pagination.currentPage * pagination.perPage, pagination.totalRecords)} of{' '}
              {pagination.totalRecords} transactions
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1 || isFetching}
                className="hover-lift"
              >
                Previous
              </Button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter(page => 
                    page === 1 || 
                    page === pagination.totalPages || 
                    Math.abs(page - pagination.currentPage) <= 1
                  )
                  .map((page, index, array) => (
                    <div key={page} className="flex items-center">
                      {index > 0 && array[index - 1] !== page - 1 && (
                        <span className="px-2 text-muted-foreground">...</span>
                      )}
                      <Button
                        variant={page === pagination.currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        disabled={isFetching}
                        className="hover-lift"
                      >
                        {page}
                      </Button>
                    </div>
                  ))}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages || isFetching}
                className="hover-lift"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}