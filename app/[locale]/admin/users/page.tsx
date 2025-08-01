"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  ArrowLeft, 
  Search, 
  Mail, 
  Phone, 
  CreditCard, 
  User,
  Filter,
  Edit,
  Trash2,
  X
} from "lucide-react"
import Link from "next/link"

interface UserInfo {
  userId: number
  username: string
  email: string
  role: string
}

interface AdminUser {
  id: number
  email: string
  username: string
  firstName: string
  lastName: string
  phoneNumber: string
  role: string
  isEmailVerified: boolean
  currentCredits: number
  totalCreditsUsed: number
  totalCreditsPurchased: number
  accountAge: number
}

interface CreditOperationData {
  amount: number
  operation: 'add' | 'deduct'
}

export default function AdminUsersPage() {
  const [user, setUser] = useState<UserInfo | null>(null)
  const [users, setUsers] = useState<AdminUser[]>([])
  const [filteredUsers, setFilteredUsers] = useState<AdminUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("ALL")
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
  const [creditFormData, setCreditFormData] = useState<CreditOperationData>({
    amount: 0,
    operation: 'add'
  })
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

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
    fetchUsers()
  }, [router])

  useEffect(() => {
    // Filter users based on search term and role filter
    let filtered = users

    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (roleFilter !== "ALL") {
      filtered = filtered.filter(user => user.role === roleFilter)
    }

    setFilteredUsers(filtered)
  }, [users, searchTerm, roleFilter])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }
      const data = await response.json()
      setUsers(data)
      setFilteredUsers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditUser = (user: AdminUser) => {
    setEditingUser(user)
    setCreditFormData({
      amount: 0,
      operation: 'add'
    })
  }

  const handleCreditOperation = async () => {
    if (!editingUser || creditFormData.amount <= 0) return

    setIsUpdating(true)
    try {
      const endpoint = creditFormData.operation === 'add' 
        ? 'https://translatex-production-fb26.up.railway.app/api/credits/add'
        : 'https://translatex-production-fb26.up.railway.app/api/credits/deduct'

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: editingUser.id,
          amount: creditFormData.amount
        })
      })

      if (!response.ok) {
        throw new Error(`Failed to ${creditFormData.operation} credits`)
      }

      // Refresh users list
      await fetchUsers()
      setEditingUser(null)
      setCreditFormData({ amount: 0, operation: 'add' })
      setError("")
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${creditFormData.operation} credits`)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeleteUser = async (userId: number) => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete user')
      }

      // Refresh users list
      await fetchUsers()
      setDeleteUserId(null)
      setError("")
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user')
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading users...</p>
        </div>
      </div>
    )
  }

  if (!user || user.role !== 'ADMIN') {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 mt-10  ">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/admin">
              <Button variant="outline" size="sm" className=" backdrop-blur-sm   transition-all duration-200">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Admin
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center">
                <Users className="h-8 w-8 mr-3 text-blue-600" />
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                User Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage and monitor user accounts
              </p>
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-100 shadow-sm">
            <span className="text-sm font-medium text-gray-700">
              Total Users: {filteredUsers.length}
            </span>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-xl shadow-sm">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Filters */}
        <Card className="mb-8  backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center ">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mr-3">
                <Filter className="h-4 w-4 text-white" />
              </div>
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 " />
                  <Input
                    placeholder="Search users by name, email, or username..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10    transition-all duration-200 focus:outline-none   "
                  />
                </div>
              </div>
              <div className="sm:w-48">
                <label htmlFor="role-filter" className="sr-only">Filter by role</label>
                <select
                  id="role-filter"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-white/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200"
                >
                  <option className="text-gray-500" value="ALL">All Roles</option>
                  <option className="text-gray-500" value="USER">Users</option>
                  <option className="text-gray-500" value="ADMIN">Admins</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredUsers.map((adminUser) => (
            <Card key={adminUser.id} className="group bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 border-0 shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-1">
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                        {adminUser.firstName} {adminUser.lastName}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                        @{adminUser.username}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge 
                      variant={adminUser.role === 'ADMIN' ? 'default' : 'secondary'}
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        adminUser.role === 'ADMIN' 
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                          : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                      }`}
                    >
                      {adminUser.role}
                    </Badge>
                   
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <Mail className="h-4 w-4 text-blue-500" />
                  <span className="truncate text-sm font-medium">{adminUser.email}</span>
                </div>
                
                {adminUser.phoneNumber && (
                  <div className="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <Phone className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">{adminUser.phoneNumber}</span>
                  </div>
                )}
                
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-lg border border-emerald-200 dark:border-emerald-700">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5 text-emerald-600" />
                    <span className="font-semibold text-emerald-700 dark:text-emerald-300">
                      {adminUser.currentCredits} credits
                    </span>
                  </div>
                </div>
                
             
             
                
                <div className="pt-4 flex space-x-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
                    onClick={() => handleEditUser(adminUser)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Credits
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-gradient-to-r from-red-500 to-rose-600 text-white border-0 hover:from-red-600 hover:to-rose-700 shadow-lg hover:shadow-xl transition-all duration-200 px-3"
                    onClick={() => setDeleteUserId(adminUser.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <div className="w-20 h-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Users className="h-10 w-10 text-gray-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              No users found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              {searchTerm || roleFilter !== "ALL" 
                ? "Try adjusting your search or filters" 
                : "No users have been registered yet"}
            </p>
          </div>
        )}

        {/* Edit User Modal */}
        {editingUser && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl border-0">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Manage Credits - {editingUser.firstName} {editingUser.lastName}
                </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    @{editingUser.username}
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2"
                  onClick={() => setEditingUser(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="mb-6 p-4 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl border border-emerald-200 dark:border-emerald-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Current Credits:
                  </span>
                  <span className="font-bold text-2xl text-emerald-600 dark:text-emerald-400">
                    {editingUser.currentCredits}
                  </span>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="operation-select" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Operation
                  </label>
                  <select
                    id="operation-select"
                    title="Select credit operation"
                    value={creditFormData.operation}
                    onChange={(e) => setCreditFormData({...creditFormData, operation: e.target.value as 'add' | 'deduct'})}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-medium transition-all duration-200"
                  >
                    <option value="add">Add Credits</option>
                    <option value="deduct">Deduct Credits</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Amount
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={creditFormData.amount}
                    onChange={(e) => setCreditFormData({...creditFormData, amount: parseInt(e.target.value) || 0})}
                    placeholder="Enter amount of credits"
                    className="px-4 py-3 text-lg font-medium"
                  />
                </div>
              </div>
              
              <div className="flex space-x-4 mt-8">
                <Button 
                  variant="outline" 
                  onClick={() => setEditingUser(null)}
                  className="flex-1 py-3 border-gray-300 hover:bg-gray-50 font-semibold"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreditOperation}
                  disabled={isUpdating || creditFormData.amount <= 0}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating ? 'Processing...' : `${creditFormData.operation === 'add' ? 'Add' : 'Deduct'} Credits`}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteUserId && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl border-0">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <X className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Confirm Delete
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Are you sure you want to delete this user? This action cannot be undone.
              </p>
              </div>
              
              <div className="flex space-x-4">
                <Button 
                  variant="outline" 
                  onClick={() => setDeleteUserId(null)}
                  className="flex-1 py-3 border-gray-300 hover:bg-gray-50 font-semibold"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => handleDeleteUser(deleteUserId)}
                  disabled={isDeleting}
                  className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                >
                  {isDeleting ? 'Deleting...' : 'Delete User'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 