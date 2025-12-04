import React from 'react'
import {
  TruckIcon,
  MapPinIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  CurrencyDollarIcon,
  StarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  PlusIcon,
  EyeIcon,
  ChartBarIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { ResponsiveContainer, AreaChart, Area, Tooltip, XAxis, YAxis } from 'recharts'

// ProfessionalVendorDashboard.jsx
// Single-file improved dashboard: polished cards, mini charts, responsive layout.

const sampleTrends = [
  { name: 'Day 1', pickups: 5, deliveries: 8, revenue: 800 },
  { name: 'Day 2', pickups: 9, deliveries: 12, revenue: 1200 },
  { name: 'Day 3', pickups: 7, deliveries: 10, revenue: 980 },
  { name: 'Day 4', pickups: 12, deliveries: 15, revenue: 1400 },
  { name: 'Day 5', pickups: 10, deliveries: 11, revenue: 1300 },
  { name: 'Day 6', pickups: 14, deliveries: 18, revenue: 1700 },
  { name: 'Day 7', pickups: 16, deliveries: 20, revenue: 2000 },
]

const kpis = [
  { id: 'pickups', title: "Today's Pickups", value: 12, delta: '+2', trend: 'up', icon: TruckIcon },
  { id: 'deliveries', title: "Today's Deliveries", value: 18, delta: '+4', trend: 'up', icon: MapPinIcon },
  { id: 'active', title: 'Active Orders', value: 45, delta: null, trend: 'stable', icon: DocumentTextIcon },
  { id: 'revenue', title: 'Monthly Revenue', value: '$12,540', delta: '+8.2%', trend: 'up', icon: CurrencyDollarIcon },
]

const colors = {
  bg: 'bg-white',
  muted: 'text-gray-500',
  heading: 'text-gray-800',
  cardBorder: 'border-gray-100',
  accent: 'text-blue-600',
  success: 'text-green-500',
  danger: 'text-red-500',
}

const KPI = ({ item }) => {
  const TrendIcon = item.trend === 'up' ? ArrowUpIcon : item.trend === 'down' ? ArrowDownIcon : null
  return (
    <div className={`p-4 rounded-lg shadow-sm border ${colors.cardBorder} ${colors.bg}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md bg-gray-50">
            <item.icon className="w-6 h-6 text-gray-600" />
          </div>
          <div>
            <p className={`text-sm font-medium ${colors.muted}`}>{item.title}</p>
            <h3 className={`text-xl font-semibold ${colors.heading}`}>{item.value}</h3>
          </div>
        </div>
        {item.delta ? (
          <div className="flex items-center gap-2">
            {TrendIcon && <TrendIcon className={`w-4 h-4 ${item.trend === 'up' ? colors.success : colors.danger}`} />}
            <span className={`text-sm font-medium ${item.trend === 'up' ? 'text-green-600' : item.trend === 'down' ? 'text-red-600' : colors.muted}`}>{item.delta}</span>
          </div>
        ) : null}
      </div>
    </div>
  )
}

const ReviewBar = ({ percent }) => (
  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
    <div style={{ width: `${percent}%` }} className="h-full bg-yellow-400" />
  </div>
)

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1400px] mx-auto">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Vendor Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Overview of your laundry operations & performance</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-600">Last updated: Just now</div>
            <button className="px-3 py-2 rounded-md border border-gray-200 bg-white text-sm font-medium hover:bg-gray-50">Export</button>
            <button className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 flex items-center gap-2">
              <PlusIcon className="w-4 h-4" /> New Order
            </button>
          </div>
        </header>

        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {kpis.map(k => <KPI key={k.id} item={k} />)}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main chart + recent */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-4 rounded-lg shadow-sm border border-gray-100 bg-white">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-800">Weekly Trends</h3>
                <div className="text-sm text-gray-500">Pickups / Deliveries / Revenue</div>
              </div>

              <div style={{ height: 220 }}>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={sampleTrends} margin={{ top: 0, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPickups" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#60A5FA'" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#60A5FA'" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="pickups" stroke="#3B82F6" fillOpacity={0.2} fill="#93C5FD" />
                    <Area type="monotone" dataKey="deliveries" stroke="#10B981" fillOpacity={0.15} fill="#34D399" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-md bg-gray-50 border border-gray-100">
                  <p className="text-xs text-gray-500">This week pickups</p>
                  <h4 className="text-lg font-semibold text-gray-800">76</h4>
                </div>
                <div className="p-3 rounded-md bg-gray-50 border border-gray-100">
                  <p className="text-xs text-gray-500">This week deliveries</p>
                  <h4 className="text-lg font-semibold text-gray-800">92</h4>
                </div>
                <div className="p-3 rounded-md bg-gray-50 border border-gray-100">
                  <p className="text-xs text-gray-500">Revenue</p>
                  <h4 className="text-lg font-semibold text-gray-800">$7,120</h4>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg shadow-sm border border-gray-100 bg-white">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
                <div className="text-sm text-gray-500">Today</div>
              </div>

              <ul className="space-y-3">
                <li className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-blue-50">
                      <DocumentTextIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">New order received #ORD-7842</p>
                      <p className="text-xs text-gray-500">2 min ago</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">Unassigned</div>
                </li>

                <li className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-green-50">
                      <CheckCircleIcon className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Delivery completed #ORD-7251</p>
                      <p className="text-xs text-gray-500">15 min ago</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">Delivered</div>
                </li>

                <li className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-yellow-50">
                      <TruckIcon className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Pickup scheduled for 3:00 PM</p>
                      <p className="text-xs text-gray-500">1 hour ago</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">Scheduled</div>
                </li>
              </ul>
            </div>
          </div>

          {/* Right column: Reviews + Quick Actions */}
          <aside className="space-y-6">
            <div className="p-4 rounded-lg shadow-sm border border-gray-100 bg-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Customer Reviews</h3>
                <div className="text-sm text-gray-500">Overall</div>
              </div>

              <div className="flex items-center gap-4 mb-3">
                <div className="rounded-full p-3 bg-yellow-50">
                  <StarIcon className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-gray-800">4.7</h4>
                  <p className="text-xs text-gray-500">out of 5</p>
                </div>
              </div>

              <div className="space-y-2">
                {[5,4,3,2,1].map(s => (
                  <div key={s} className="flex items-center gap-3">
                    <div className="w-10 text-sm text-gray-700">{s}★</div>
                    <div className="flex-1">
                      <ReviewBar percent={s===5?72: s===4?21: s===3?6: s===2?1:0} />
                    </div>
                    <div className="w-12 text-sm text-right text-gray-600">{s===5?156: s===4?45: s===3?12: s===2?2:1}</div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-500">Total reviews: 216</div>
                <div className="text-xs text-green-600 font-semibold">+12% this month</div>
              </div>
            </div>

            <div className="p-4 rounded-lg shadow-sm border border-gray-100 bg-white">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="p-3 rounded-md bg-blue-600 text-white flex items-center gap-2 justify-center">
                  <PlusIcon className="w-4 h-4" /> Schedule Pickup
                </button>
                <button className="p-3 rounded-md bg-gray-50 border border-gray-200 flex items-center gap-2 justify-center text-gray-700">
                  <EyeIcon className="w-4 h-4" /> Track Delivery
                </button>
                <button className="p-3 rounded-md bg-gray-50 border border-gray-200 flex items-center gap-2 justify-center text-gray-700">
                  <ChartBarIcon className="w-4 h-4" /> Reports
                </button>
                <button className="p-3 rounded-md bg-gray-50 border border-gray-200 flex items-center gap-2 justify-center text-gray-700">
                  <CurrencyDollarIcon className="w-4 h-4" /> Earnings
                </button>
              </div>
            </div>

            <div className="p-4 rounded-lg shadow-sm border border-gray-100 bg-white">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Live Activity</h3>
              <div className="text-sm text-gray-600">No active live tasks</div>
            </div>
          </aside>
        </div>

      </div>
    </div>
  )
}

export default DashboardLayout
