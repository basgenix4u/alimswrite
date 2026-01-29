// app/admin/orders/page.jsx
'use client'

export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  FiSearch,
  FiFilter,
  FiEye,
  FiPhone,
  FiMail,
  FiPlus,
  FiX,
} from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Select from '@/components/ui/Select'
import { formatRelativeTime, statusColors, priorityColors } from '@/lib/utils'
import toast from 'react-hot-toast'

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'normal', label: 'Normal' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
]

const projectTypes = [
  { value: 'Full Project (Chapter 1-5)', label: 'Full Project (Chapter 1-5)' },
  { value: 'Single Chapter', label: 'Single Chapter' },
  { value: 'Thesis', label: 'Thesis' },
  { value: 'Dissertation', label: 'Dissertation' },
  { value: 'Assignment', label: 'Assignment' },
  { value: 'Data Analysis', label: 'Data Analysis' },
  { value: 'Proposal', label: 'Proposal' },
  { value: 'Other', label: 'Other' },
]

const sourceOptions = [
  { value: 'website', label: 'Website' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'referral', label: 'Referral' },
  { value: 'social_media', label: 'Social Media' },
  { value: 'phone', label: 'Phone Call' },
  { value: 'other', label: 'Other' },
]

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [departments, setDepartments] = useState([])
  const [submitting, setSubmitting] = useState(false)
  
  const [newOrder, setNewOrder] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerWhatsapp: '',
    projectType: '',
    projectTitle: '',
    departmentId: '',
    level: '',
    description: '',
    deadline: '',
    source: 'whatsapp',
    priority: 'normal',
    quotedPrice: '',
    adminNotes: '',
  })

  useEffect(() => {
    fetchOrders()
    fetchDepartments()
  }, [statusFilter])

  const fetchOrders = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('page', '1')
      params.set('limit', '50')
      if (statusFilter !== 'all') params.set('status', statusFilter)
      
      const res = await fetch(`/api/orders?${params.toString()}`)
      const data = await res.json()
      setOrders(data.orders || [])
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchDepartments = async () => {
    try {
      const res = await fetch('/api/departments')
      const data = await res.json()
      setDepartments(data.departments || [])
    } catch (error) {
      console.error('Failed to fetch departments:', error)
    }
  }

  const handleAddOrder = async (e) => {
    e.preventDefault()
    
    if (!newOrder.customerName || !newOrder.customerPhone || !newOrder.projectType) {
      toast.error('Please fill in required fields')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newOrder,
          customerWhatsapp: newOrder.customerWhatsapp || newOrder.customerPhone,
        }),
      })

      const data = await res.json()

      if (data.success) {
        toast.success('Order added successfully')
        setShowAddForm(false)
        setNewOrder({
          customerName: '',
          customerEmail: '',
          customerPhone: '',
          customerWhatsapp: '',
          projectType: '',
          projectTitle: '',
          departmentId: '',
          level: '',
          description: '',
          deadline: '',
          source: 'whatsapp',
          priority: 'normal',
          quotedPrice: '',
          adminNotes: '',
        })
        fetchOrders()
      } else {
        toast.error(data.error || 'Failed to add order')
      }
    } catch (error) {
      toast.error('Failed to add order')
    } finally {
      setSubmitting(false)
    }
  }

  const formatWhatsAppLink = (phone) => {
    if (!phone) return '#'
    let cleaned = phone.replace(/\D/g, '')
    if (cleaned.startsWith('0')) cleaned = '234' + cleaned.substring(1)
    if (!cleaned.startsWith('234')) cleaned = '234' + cleaned
    return `https://wa.me/${cleaned}`
  }

  const filteredOrders = orders.filter(order => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      order.customerName?.toLowerCase().includes(query) ||
      order.customerEmail?.toLowerCase().includes(query) ||
      order.customerPhone?.includes(query) ||
      order.orderNumber?.toLowerCase().includes(query) ||
      order.projectTitle?.toLowerCase().includes(query)
    )
  })

  const departmentOptions = departments.map(d => ({
    value: d.id,
    label: d.name,
  }))

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-dark-900">Orders</h1>
          <p className="text-dark-500 mt-1">Manage customer orders and requests</p>
        </div>
        <Button variant="primary" onClick={() => setShowAddForm(!showAddForm)}>
          <FiPlus className="w-4 h-4 mr-2" />
          Add Order Manually
        </Button>
      </div>

      {/* Add Order Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-dark-900">Add New Order</h2>
            <button onClick={() => setShowAddForm(false)} className="text-dark-400 hover:text-dark-600">
              <FiX className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleAddOrder}>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <Input
                label="Customer Name *"
                value={newOrder.customerName}
                onChange={(e) => setNewOrder({ ...newOrder, customerName: e.target.value })}
                required
              />
              <Input
                label="Phone Number *"
                value={newOrder.customerPhone}
                onChange={(e) => setNewOrder({ ...newOrder, customerPhone: e.target.value })}
                placeholder="08012345678"
                required
              />
              <Input
                label="WhatsApp Number"
                value={newOrder.customerWhatsapp}
                onChange={(e) => setNewOrder({ ...newOrder, customerWhatsapp: e.target.value })}
                placeholder="Same as phone if empty"
              />
              <Input
                label="Email"
                type="email"
                value={newOrder.customerEmail}
                onChange={(e) => setNewOrder({ ...newOrder, customerEmail: e.target.value })}
              />
              <Select
                label="Project Type *"
                options={projectTypes}
                value={newOrder.projectType}
                onChange={(e) => setNewOrder({ ...newOrder, projectType: e.target.value })}
                required
              />
              <Select
                label="Department"
                options={departmentOptions}
                value={newOrder.departmentId}
                onChange={(e) => setNewOrder({ ...newOrder, departmentId: e.target.value })}
                placeholder="Select department"
              />
              <Input
                label="Project Title"
                value={newOrder.projectTitle}
                onChange={(e) => setNewOrder({ ...newOrder, projectTitle: e.target.value })}
              />
              <Input
                label="Level"
                value={newOrder.level}
                onChange={(e) => setNewOrder({ ...newOrder, level: e.target.value })}
                placeholder="e.g., BSc, MSc, PhD"
              />
              <Input
                label="Deadline"
                type="date"
                value={newOrder.deadline}
                onChange={(e) => setNewOrder({ ...newOrder, deadline: e.target.value })}
              />
              <Select
                label="Source *"
                options={sourceOptions}
                value={newOrder.source}
                onChange={(e) => setNewOrder({ ...newOrder, source: e.target.value })}
              />
              <Select
                label="Priority"
                options={priorityOptions}
                value={newOrder.priority}
                onChange={(e) => setNewOrder({ ...newOrder, priority: e.target.value })}
              />
              <Input
                label="Quoted Price"
                value={newOrder.quotedPrice}
                onChange={(e) => setNewOrder({ ...newOrder, quotedPrice: e.target.value })}
                placeholder="e.g., ₦25,000"
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <Textarea
                label="Project Description"
                value={newOrder.description}
                onChange={(e) => setNewOrder({ ...newOrder, description: e.target.value })}
                rows={3}
                placeholder="Details about the project..."
              />
              <Textarea
                label="Admin Notes"
                value={newOrder.adminNotes}
                onChange={(e) => setNewOrder({ ...newOrder, adminNotes: e.target.value })}
                rows={3}
                placeholder="Internal notes..."
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={submitting}>
                Add Order
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex gap-2">
            {statusOptions.map((status) => (
              <button
                key={status.value}
                onClick={() => setStatusFilter(status.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === status.value
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-gray-100 text-dark-600 hover:bg-gray-200'
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-dark-500">
            <FiFilter className="w-12 h-12 text-dark-300 mb-3" />
            <p>No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-dark-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-dark-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-dark-500 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-dark-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-dark-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-dark-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-dark-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-dark-900">{order.orderNumber}</div>
                      <Badge variant={priorityColors[order.priority]?.replace('bg-', '').replace(' text-', '-') || 'default'} size="sm">
                        {order.priority}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-dark-900">{order.customerName}</div>
                      <div className="text-sm text-dark-500">{order.customerPhone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-dark-900">{order.projectType}</div>
                      {order.projectTitle && (
                        <div className="text-sm text-dark-500 truncate max-w-[200px]">
                          {order.projectTitle}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={
                        order.status === 'completed' ? 'success' :
                        order.status === 'in_progress' ? 'primary' :
                        order.status === 'cancelled' ? 'danger' :
                        'warning'
                      }>
                        {order.status?.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-dark-500 capitalize">
                        {order.source?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-dark-500">
                        {formatRelativeTime(order.createdAt)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={formatWhatsAppLink(order.customerWhatsapp || order.customerPhone)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="WhatsApp"
                        >
                          <FaWhatsapp className="w-4 h-4" />
                        </a>
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <FiEye className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}