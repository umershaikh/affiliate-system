import React, { useState } from "react";

import "./DashboardSidebar.css";

import {
  LayoutDashboard,
  History, // Changed: More intuitive for history
  GitGraph, // Changed: Perfect for "My Tree" (referrals/hierarchy)
  Medal, // Changed: Better for "Rewards"
  UserPlus, // Changed: Better for "Create Accounts"
  KeyRound, // Changed: Better for "Pin Codes"
  Ticket, // Kept: Good for viewing codes
  Lock, // Changed: Better for "Change Password"
} from "lucide-react";

const DashboardSidebar = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard" },

    { icon: History, label: "Withdraw History" },

    { icon: GitGraph, label: "My Tree" }, // Represents a tree/network structure

    { icon: Medal, label: "Reward List", badge: true, dropdown: true },

    { icon: UserPlus, label: "Create Accounts", badge: true, dropdown: true },

    { icon: KeyRound, label: "Buy Pin Code", badge: true, dropdown: true },

    { icon: Ticket, label: "View Pin Code", badge: true, dropdown: true },

    { icon: Lock, label: "Change Password", dropdown: true },
  ];

  return (
    <aside className="rps-sidebar-root">
      <div className="rps-logo-wrapper">
<h2>Alpha</h2>
      </div>

      <nav className="rps-nav-list">
        {menuItems.map((item, index) => {
          const isActive = activeTab === item.label;

          const IconComponent = item.icon; // Extracted for cleaner rendering

          return (
            <div
              key={index}
              className={`rps-menu-item ${isActive ? "rps-item-active" : ""}`}
              onClick={() => setActiveTab(item.label)}
            >
              <div className="rps-item-content">
                <IconComponent size={19} strokeWidth={isActive ? 2.5 : 2} />

                <span className="rps-item-label">{item.label}</span>
              </div>
            </div>
          );
        })}
      </nav>

      <div className="rps-sidebar-footer">
        <span className="rps-v-text">REVPTC</span>

        <span className="rps-v-num">V3.1</span>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
