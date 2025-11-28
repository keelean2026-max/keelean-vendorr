import React from "react";
import Sidebar from "../Sidebar/Sidebar"; // Make sure this path is correct
import {
  TruckIcon,
  LocationMarkerIcon,
  ClipboardListIcon,
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
} from "@heroicons/react/outline";

const Dashboard = () => {
  // Color palette from the provided scheme
  const colors = {
    50: "#F8F9FA",
    100: "#EBEDEF",
    200: "#DDE1E4",
    300: "#CED3DB",
    400: "#BDC4CB",
    500: "#AAB4BC",
    600: "#95A1AC",
    700: "#808A93",
    800: "#646D7A",
    900: "#383F47"
  };

  // Mock data - in a real app, this would come from an API
  const dashboardData = {
    todaysPickups: 12,
    todaysDeliveries: 18,
    activeOrders: 45,
    completedOrders: 234,
    cancelledOrders: 8,
    monthlyRevenue: 12540,
    customerReview: 4.7,
    trends: {
      pickups: "up",
      deliveries: "up", 
      revenue: "up",
      reviews: "stable"
    }
  };

  const StatCard = ({ title, value, icon: Icon, trend, subtitle, color = "gray" }) => {
    const trendConfig = {
      up: { 
        icon: ArrowUpIcon, 
        color: "text-green-500",
        bgColor: "bg-green-50"
      },
      down: { 
        icon: ArrowDownIcon, 
        color: "text-red-500",
        bgColor: "bg-red-50"
      },
      stable: { 
        icon: null, 
        color: colors[500],
        bgColor: colors[100]
      }
    };

    const TrendIcon = trendConfig[trend].icon;

    return (
      <div 
        className="p-6 rounded-2xl transition-all duration-300 hover:transform hover:scale-[1.02] hover:shadow-lg group"
        style={{
          backgroundColor: colors[50],
          border: `1px solid ${colors[200]}`,
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}
      >
        <div className="flex items-start justify-between mb-4">
          <div 
            className="p-3 rounded-xl transition-all duration-300 group-hover:shadow-md"
            style={{
              backgroundColor: colors[100],
              border: `1px solid ${colors[200]}`
            }}
          >
            <Icon className="w-6 h-6" style={{ color: colors[700] }} />
          </div>
          
          {trend !== "stable" && TrendIcon && (
            <div 
              className={`px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-semibold ${trendConfig[trend].bgColor}`}
              style={{ color: trendConfig[trend].color }}
            >
              <TrendIcon className="w-3 h-3" />
              <span>{subtitle.split(' ')[0]}</span>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <h3 
            className="text-2xl font-bold tracking-tight"
            style={{ color: colors[900] }}
          >
            {value}
          </h3>
          <p 
            className="text-sm font-medium tracking-wide"
            style={{ color: colors[600] }}
          >
            {title}
          </p>
          {trend === "stable" && (
            <p 
              className="text-xs font-medium"
              style={{ color: colors[500] }}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>
    );
  };

  const ReviewSummary = () => {
    const reviews = [
      { stars: 5, count: 156, percentage: 72 },
      { stars: 4, count: 45, percentage: 21 },
      { stars: 3, count: 12, percentage: 6 },
      { stars: 2, count: 2, percentage: 1 },
      { stars: 1, count: 1, percentage: 0 }
    ];

    return (
      <div 
        className="rounded-2xl p-6 transition-all duration-300 hover:shadow-lg"
        style={{
          backgroundColor: colors[50],
          border: `1px solid ${colors[200]}`
        }}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 
              className="text-xl font-bold tracking-tight mb-1"
              style={{ color: colors[900] }}
            >
              Customer Reviews
            </h3>
            <p 
              className="text-sm font-medium"
              style={{ color: colors[500] }}
            >
              Overall satisfaction metrics
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1,2,3,4,5].map((star) => (
                  <StarIcon 
                    key={star}
                    className={`w-5 h-5 ${star <= Math.floor(dashboardData.customerReview) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <span 
                className="text-2xl font-bold"
                style={{ color: colors[900] }}
              >
                {dashboardData.customerReview}
              </span>
            </div>
            <p 
              className="text-xs font-medium mt-1"
              style={{ color: colors[500] }}
            >
              out of 5 stars
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.stars} className="flex items-center gap-4">
              <div className="flex items-center gap-2 w-16">
                <span 
                  className="text-sm font-medium w-4"
                  style={{ color: colors[700] }}
                >
                  {review.stars}
                </span>
                <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
              </div>
              <div 
                className="flex-1 rounded-full h-3 overflow-hidden"
                style={{ backgroundColor: colors[200] }}
              >
                <div 
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ 
                    backgroundColor: colors[600],
                    width: `${review.percentage}%`
                  }}
                ></div>
              </div>
              <span 
                className="text-sm font-medium w-12 text-right"
                style={{ color: colors[600] }}
              >
                {review.count}
              </span>
            </div>
          ))}
        </div>

        <div 
          className="mt-6 pt-6 flex justify-between items-center"
          style={{ borderTop: `1px solid ${colors[200]}` }}
        >
          <span 
            className="text-sm font-medium"
            style={{ color: colors[600] }}
          >
            Total reviews: 216
          </span>
          <span 
            className="text-sm font-semibold px-2 py-1 rounded-lg"
            style={{ 
              backgroundColor: colors[100],
              color: colors[700]
            }}
          >
            +12% this month
          </span>
        </div>
      </div>
    );
  };

  const QuickActions = () => {
    const actions = [
      { icon: PlusIcon, label: "Schedule Pickup", color: colors[600] },
      { icon: EyeIcon, label: "Track Delivery", color: colors[600] },
      { icon: ChartBarIcon, label: "View Reports", color: colors[600] },
      { icon: CurrencyDollarIcon, label: "Revenue Analytics", color: colors[600] }
    ];

    return (
      <div 
        className="rounded-2xl p-6 transition-all duration-300 hover:shadow-lg"
        style={{
          backgroundColor: colors[50],
          border: `1px solid ${colors[200]}`
        }}
      >
        <h3 
          className="text-xl font-bold tracking-tight mb-6"
          style={{ color: colors[900] }}
        >
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button 
                key={index}
                className="p-4 rounded-xl transition-all duration-300 hover:transform hover:scale-105 group"
                style={{
                  backgroundColor: colors[100],
                  border: `1px solid ${colors[200]}`
                }}
              >
                <div className="flex flex-col items-center gap-3">
                  <div 
                    className="p-2 rounded-lg transition-all duration-300 group-hover:shadow-md"
                    style={{
                      backgroundColor: colors[50],
                      border: `1px solid ${colors[200]}`
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color: colors[700] }} />
                  </div>
                  <span 
                    className="text-sm font-semibold text-center tracking-wide"
                    style={{ color: colors[800] }}
                  >
                    {action.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const RecentActivity = () => {
    const activities = [
      { action: "New order received", time: "2 min ago", type: "order", icon: ClipboardListIcon },
      { action: "Delivery completed #ORD-7842", time: "15 min ago", type: "delivery", icon: CheckCircleIcon },
      { action: "Pickup scheduled for 3:00 PM", time: "1 hour ago", type: "pickup", icon: TruckIcon },
      { action: "Customer review received", time: "2 hours ago", type: "review", icon: StarIcon },
      { action: "Monthly revenue target achieved", time: "4 hours ago", type: "revenue", icon: CurrencyDollarIcon }
    ];

    const typeColors = {
      order: colors[600],
      delivery: colors[700],
      pickup: colors[500],
      review: colors[800],
      revenue: colors[900]
    };

    return (
      <div 
        className="rounded-2xl p-6 transition-all duration-300 hover:shadow-lg"
        style={{
          backgroundColor: colors[50],
          border: `1px solid ${colors[200]}`
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 
            className="text-xl font-bold tracking-tight"
            style={{ color: colors[900] }}
          >
            Recent Activity
          </h3>
          <ClockIcon className="w-5 h-5" style={{ color: colors[500] }} />
        </div>

        <div className="space-y-4">
          {activities.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <div 
                key={index}
                className="flex items-center gap-4 p-3 rounded-xl transition-all duration-200 hover:shadow-sm group"
                style={{
                  backgroundColor: colors[100],
                  border: `1px solid ${colors[200]}`
                }}
              >
                <div 
                  className="p-2 rounded-lg transition-all duration-300 group-hover:shadow-md"
                  style={{
                    backgroundColor: colors[50],
                    border: `1px solid ${colors[200]}`
                  }}
                >
                  <Icon className="w-4 h-4" style={{ color: typeColors[activity.type] }} />
                </div>
                <div className="flex-1">
                  <p 
                    className="text-sm font-semibold tracking-wide"
                    style={{ color: colors[800] }}
                  >
                    {activity.action}
                  </p>
                </div>
                <span 
                  className="text-xs font-medium px-2 py-1 rounded-full"
                  style={{
                    backgroundColor: colors[200],
                    color: colors[600]
                  }}
                >
                  {activity.time}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar Component */}
      <Sidebar />
      
      {/* Main Dashboard Content */}
      <div 
        className="flex-1 p-8 transition-all duration-300 overflow-auto"
        style={{ backgroundColor: colors[50] }}
      >
        {/* Enhanced Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 
                className="text-3xl font-bold tracking-tight mb-2"
                style={{ color: colors[900] }}
              >
                Vendor Dashboard
              </h1>
              <p 
                className="text-lg font-medium tracking-wide"
                style={{ color: colors[600] }}
              >
                Comprehensive overview of your delivery operations
              </p>
            </div>
            <div 
              className="px-4 py-2 rounded-xl"
              style={{
                backgroundColor: colors[100],
                border: `1px solid ${colors[200]}`
              }}
            >
              <span 
                className="text-sm font-semibold"
                style={{ color: colors[700] }}
              >
                Last updated: Just now
              </span>
            </div>
          </div>

          {/* Performance Indicator */}
          <div 
            className="w-full h-1 rounded-full mb-2"
            style={{ backgroundColor: colors[200] }}
          >
            <div 
              className="h-full rounded-full transition-all duration-1000"
              style={{ 
                backgroundColor: colors[600],
                width: '85%'
              }}
            ></div>
          </div>
          <div className="flex justify-between text-xs">
            <span style={{ color: colors[500] }}>Monthly performance</span>
            <span style={{ color: colors[600] }}>85% complete</span>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
          <StatCard
            title="Today's Pickups"
            value={dashboardData.todaysPickups}
            icon={TruckIcon}
            trend={dashboardData.trends.pickups}
            subtitle="+2 from yesterday"
          />
          
          <StatCard
            title="Today's Deliveries"
            value={dashboardData.todaysDeliveries}
            icon={LocationMarkerIcon}
            trend={dashboardData.trends.deliveries}
            subtitle="+4 from yesterday"
          />
          
          <StatCard
            title="Active Orders"
            value={dashboardData.activeOrders}
            icon={ClipboardListIcon}
            trend="stable"
            subtitle="In progress"
          />
          
          <StatCard
            title="Completed Orders"
            value={dashboardData.completedOrders}
            icon={CheckCircleIcon}
            trend="up"
            subtitle="This month"
          />
          
          <StatCard
            title="Cancelled Orders"
            value={dashboardData.cancelledOrders}
            icon={XCircleIcon}
            trend="down"
            subtitle="-3% this week"
          />
          
          <StatCard
            title="Monthly Revenue"
            value={`$${dashboardData.monthlyRevenue.toLocaleString()}`}
            icon={CurrencyDollarIcon}
            trend={dashboardData.trends.revenue}
            subtitle="+8.2% growth"
          />
        </div>

        {/* Enhanced Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <ReviewSummary />
          <QuickActions />
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;