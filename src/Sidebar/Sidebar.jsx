import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingBagIcon,
  HomeIcon,
  BellIcon,
  TruckIcon,
  MapPinIcon,
  ArrowsRightLeftIcon,
  MagnifyingGlassIcon,
  CubeIcon,
  UserCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

const menuConfig = [
  {
    id: "home",
    label: "Home ",
    icon: HomeIcon,
    items: ["Overview", "Quick Actions", "Recent Activity", "Notifications"],
    path: "/dashboard",
  },
  {
    id: "new-order",
    label: "New Order Notifications",
    icon: ShoppingBagIcon,
    items: ["New customer order", "Pending approvals", "Order updates"],
    path: "/orders",
  },
  {
    id: "pickup-requested",
    label: "Pickup Requested",
    icon: TruckIcon,
    items: ["Pickup requested", "Schedule pickup", "Pickup history"],
    path: "/pickups",
  },
  {
    id: "delivery-requested",
    label: "Delivery Requested",
    icon: MapPinIcon,
    items: ["Delivery requested", "Delivery tracking", "Delivery issues"],
    path: "/deliveries",
  },
  {
    id: "customer-dropoff",
    label: "Customer Pickup/Drop-off",
    icon: ArrowsRightLeftIcon,
    items: ["Pickup / drop-off by customer", "Customer locations", "Time slots"],
    path: "/customer-dropoff",
  },
  {
    id: "search",
    label: "Search & Analytics",
    icon: MagnifyingGlassIcon,
    items: ["Quick Search", "Advanced filters", "Analytics dashboard"],
    path: "/search",
  },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const [activeMenuId, setActiveMenuId] = useState("home");
  const [selectedItem, setSelectedItem] = useState("Overview");
  const [isOpen, setIsOpen] = useState(true);

  const activeMenu = menuConfig.find((m) => m.id === activeMenuId);

  const handleMenuClick = (menu) => {
    setActiveMenuId(menu.id);
    setSelectedItem(menu.items?.[0] || "");
    navigate(menu.path);
  };

  return (
    <div className="flex">
      {/* LEFT ICON BAR */}
      <div className="w-16 bg-gray-100 border-r border-gray-300 flex flex-col items-center py-6">

        {/* Logo */}
        <div
          className="mb-8 cursor-pointer"
          onClick={() => handleMenuClick(menuConfig[0])}
          title="Home"
        >
          <div className="w-10 h-10 rounded-lg bg-gray-600 flex items-center justify-center shadow">
            <CubeIcon className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* MENU ICONS */}
        <div className="flex flex-col gap-3 flex-1 w-full items-center">
          {menuConfig.map((menu) => {
            const Icon = menu.icon;
            const isActive = menu.id === activeMenuId;

            return (
              <button
                key={menu.id}
                onClick={() => handleMenuClick(menu)}
                className={`relative w-12 h-12 rounded-xl flex items-center justify-center 
                hover:bg-gray-200 transition-all duration-200`}
                title={menu.label}
              >
                <Icon
                  className={`w-6 h-6 ${
                    isActive ? "text-gray-800" : "text-gray-400 group-hover:text-gray-600"
                  }`}
                />

                {/* ACTIVE INDICATOR */}
                {isActive && (
                  <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-6 bg-gray-700 rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* BOTTOM ICONS */}
        <div className="flex flex-col items-center gap-3">
          <button className="w-12 h-12 flex items-center justify-center hover:bg-gray-200 rounded-xl">
            <BellIcon className="w-5 h-5 text-gray-400" />
          </button>

          <button className="w-12 h-12 flex items-center justify-center hover:bg-gray-200 rounded-xl">
            <UserCircleIcon className="w-6 h-6 text-gray-400" />
          </button>

          {/* Toggle open/close */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-12 h-12 flex items-center justify-center hover:bg-gray-200 rounded-xl border border-gray-300"
          >
            {isOpen ? (
              <ChevronLeftIcon className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronRightIcon className="w-5 h-5 text-gray-500" />
            )}
          </button>
        </div>
      </div>

      {/* RIGHT EXPANDED SIDEBAR */}
      {isOpen && activeMenu && (
        <div className="w-80 bg-gray-100 border-r border-gray-200 flex flex-col">

          {/* HEADER */}
          <div className="px-6 py-5 border-b border-gray-300">
            <p className="text-xl font-bold text-gray-700">Keelean Vendor</p>
          </div>

          {/* MENU LABEL */}
          <div className="px-6 mt-4 mb-2 flex items-center gap-3">
            <activeMenu.icon className="w-6 h-6 text-gray-700" />
            <p className="text-lg font-semibold text-gray-800">{activeMenu.label}</p>
          </div>

          {/* SUB-MENU */}
          <nav className="flex-1 px-4 py-4 space-y-1">
            {activeMenu.items.map((item) => (
              <button
                key={item}
                className={`w-full text-left px-4 py-3 rounded-lg text-base transition-all
                ${
                  selectedItem === item
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "text-gray-700 hover:bg-white"
                }`}
                onClick={() => setSelectedItem(item)}
              >
                {item}
              </button>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
