// app/admin/page.jsx
'use client'
export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  FiShoppingBag,
  FiBook,
  FiMessageSquare,
  FiStar,
  FiPhone,
  FiTrendingUp,
  FiUsers,
  FiArrowRight,
  FiClock,
} from 'react-icons/fi'
import { cn, formatRelativeTime, statusColors } from '@/lib/utils'
import Badge from '@/components/ui/Badge'

const statusBadgeVariant = {
  pending: 'warning',
  contacted: 'info',
  in_progress: 'primary',
  completed: 'success',
  cancelled: 'danger',
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [recentOrders, setRecentOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/stats')
      const data = await response.json()
      setStats(data.stats)
      setRecentOrders(data.recentOrders || [])
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total Orders',
      value: stats?.orders?.total || 0,
      change: `${stats?.orders?.month || 0} this month`,
      icon: FiShoppingBag,
      color: 'bg-blue-500',
      href: '/admin/orders',
    },
    {
      title: 'Pending Orders',
      value: stats?.orders?.pending || 0,
      change: 'Awaiting action',
      icon: FiClock,
      color: 'bg-yellow-500',
      href: '/admin/orders?status=pending',
    },
    {
      title: 'Project Topics',
      value: stats?.content?.topics || 0,
      change: 'In database',
      icon: FiBook,
      color: 'bg-green-500',
      href: '/admin/topics',
    },
    {
      title: 'Blog Posts',
      value: stats?.content?.blogPosts || 0,
      change: 'Published',
      icon: FiTrendingUp,
      color: 'bg-purple-500',
      href: '/admin/blog',
    },
  ]

  const pendingItems = [
    {
      title: 'Pending Comments',
      count: stats?.pending?.comments || 0,
      icon: FiMessageSquare,
      href: '/admin/comments?status=pending',
      color: 'text-blue-600 bg-blue-50',
    },
    {
      title: 'Pending Reviews',
      count: stats?.pending?.testimonials || 0,
      icon: FiStar,
      href: '/admin/testimonials?status=pending',
      color: 'text-yellow-600 bg-yellow-50',
    },
    {
      title: 'Callback Requests',
      count: stats?.pending?.callbacks || 0,
      icon: FiPhone,
      href: '/admin/callbacks?status=pending',
      color: 'text-green-600 bg-green-50',
    },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-dark-900">Dashboard</h1>
        <p className="text-dark-500 mt-1">Welcome back! Here is what is happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <Link
            key={stat.title}
            href={stat.href}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-dark-500">{stat.title}</p>
                <p className="text-3xl font-bold text-dark-900 mt-1">{stat.value}</p>
                <p className="text-xs text-dark-400 mt-1">{stat.change}</p>
              </div>
              <div className={cn('p-3 rounded-lg', stat.color)}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-dark-900">Recent Orders</h2>
            <Link
              href="/admin/orders"
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              View all
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FiShoppingBag className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-dark-900 truncate">
                      {order.customerName}
                    </p>
                    <p className="text-sm text-dark-500 truncate">
                      {order.projectType} - {order.orderNumber}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <Badge variant={statusBadgeVariant[order.status] || 'default'} size="sm">
                      {order.status}
                    </Badge>
                    <p className="text-xs text-dark-400 mt-1">
                      {formatRelativeTime(order.createdAt)}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-8 text-center text-dark-500">
                No orders yet
              </div>
            )}
          </div>
        </div>

        {/* Pending Items */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-dark-900">Needs Attention</h2>
          </div>
          <div className="p-4 space-y-3">
            {pendingItems.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={cn('p-2 rounded-lg', item.color)}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="font-medium text-dark-700">{item.title}</span>
                </div>
                <span className={cn(
                  'px-3 py-1 rounded-full text-sm font-semibold',
                  item.count > 0 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-dark-500'
                )}>
                  {item.count}
                </span>
              </Link>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="p-4 border-t border-gray-100">
            <h3 className="text-sm font-medium text-dark-700 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Link
                href="/admin/topics/new"
                className="block w-full py-2.5 px-4 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium text-center hover:bg-primary-100 transition-colors"
              >
                Add New Topic
              </Link>
              <Link
                href="/admin/blog/new"
                className="block w-full py-2.5 px-4 bg-secondary-50 text-secondary-700 rounded-lg text-sm font-medium text-center hover:bg-secondary-100 transition-colors"
              >
                Write Blog Post
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}