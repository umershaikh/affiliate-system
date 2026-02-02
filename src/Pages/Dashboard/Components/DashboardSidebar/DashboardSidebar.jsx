import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './DashboardSidebar.css';
import { 
  LayoutDashboard, 
  History, 
  GitGraph, 
  Medal, 
  UserPlus, 
  KeyRound, 
  Ticket, 
  Lock 
} from 'lucide-react';

const DashboardSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Defined the base path for easier maintenance
  const base = "/dashboard";

  const menuItems = [
    { icon: LayoutDashboard, label: "Home", path: `${base}` },
    { icon: History, label: "Withdrawal History", path: `${base}/withdraw` },
    { icon: GitGraph, label: "My Tree", path: `${base}/tree` },
        { icon: GitGraph, label: "Add watch & Earn", path: `${base}/watch-and-earn` },
    { icon: Medal, label: "Alpha Bonuses", path: `${base}/rewards` },
    { icon: UserPlus, label: "Join a User", path: `${base}/create-account` },
    { icon: KeyRound, label: "Request E-pins", path: `${base}/buy-pin` },
    { icon: Ticket, label: "Available E-pins", path: `${base}/view-pin` },
    { icon: Lock, label: "Change Password", path: `${base}/change-password` },
  ];

  return (
    <aside className="rps-sidebar-root">
      <div className="rps-logo-wrapper">
      <h2>ALPHA</h2>
      </div>

      <nav className="rps-nav-list">
        {menuItems.map((item, index) => {
          // Check if current URL matches the item path
          const isActive = location.pathname === item.path;
          const IconComponent = item.icon;
          
          return (
            <div 
              key={index} 
              className={`rps-menu-item ${isActive ? 'rps-item-active' : ''}`}
              onClick={() => navigate(item.path)}
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