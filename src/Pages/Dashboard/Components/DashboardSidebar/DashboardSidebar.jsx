import React, { useState } from 'react';
import './DashboardSidebar.css';
import { 
  LayoutDashboard, Send, Link, Users, 
  Wallet, ArrowDownCircle, Ticket, BarChart3, 
  ThumbsUp, Settings, Layers, Bug, ChevronDown
} from 'lucide-react';

const DashboardSidebar = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard" },
    { icon: Send, label: "Plan" },
    { icon: Link, label: "PTC Ads" },
    { icon: Users, label: "Manage Users", badge: true, dropdown: true },
    { icon: Wallet, label: "Deposits", badge: true, dropdown: true },
    { icon: ArrowDownCircle, label: "Withdrawals", badge: true, dropdown: true },
    { icon: Ticket, label: "Support Ticket", badge: true, dropdown: true },
    { icon: BarChart3, label: "Report", dropdown: true },
    { icon: ThumbsUp, label: "Subscribers" },
    { icon: Settings, label: "System Setting" },
    { icon: Layers, label: "Extra", dropdown: true },
    { icon: Bug, label: "Report & Request" },
  ];

  return (
    <aside className="rps-sidebar-root">
      <div className="rps-logo-wrapper">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ff7a45" strokeWidth="2.5">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
        <span className="rps-brand-name">Rev<span className="rps-brand-accent">PTC</span></span>
      </div>

      <nav className="rps-nav-list">
        {menuItems.map((item, index) => {
          const isActive = activeTab === item.label;
          
          return (
            <div 
              key={index} 
              className={`rps-menu-item ${isActive ? 'rps-item-active' : ''}`}
              onClick={() => setActiveTab(item.label)}
            >
              <div className="rps-item-content">
                <item.icon size={19} strokeWidth={isActive ? 2.5 : 2} />
                <span className="rps-item-label">{item.label}</span>
              </div>
              <div className="rps-item-actions">
                {item.badge && <div className="rps-alert-badge">!</div>}
                {item.dropdown && <ChevronDown size={14} className="rps-chevron-icon" />}
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