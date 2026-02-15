import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './DashboardSidebar.css';
import { 
  LayoutDashboard, History, GitGraph, Medal, UserPlus, KeyRound, Ticket, Lock,
  AlertTriangle, ClipboardCheck, DollarSign, Users, Gift,
  UserCircle 
} from 'lucide-react';

const DashboardSidebar = ({ 
  userInfo = { name: 'Guest', role: 'User' }
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const base = "/dashboard";

  // 1. Define Menu Items
  const userItems = [
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

  const adminItems = [
    { icon: AlertTriangle, label: "Pending withdrawals", path: `${base}/admin/withdrawals-pending` },
    { icon: ClipboardCheck, label: "Today clear withdraw", path: `${base}/admin/withdrawals-today` },
    { icon: DollarSign, label: "Total withdrawals", path: `${base}/admin/withdrawals-total` },
    { icon: Ticket, label: "Available E-pins", path: `${base}/admin/pins-available` },
    { icon: KeyRound, label: "Pending E-pin request", path: `${base}/admin/pins-pending` },
    { icon: Gift, label: "Upcoming rewards", path: `${base}/admin/rewards` },
    { icon: Users, label: "Total users", path: `${base}/admin/users` },
  ];

  // 2. Determine which menu to show based on URL
  const isAdminPath = location.pathname.startsWith(`${base}/admin`);
  const menuItems = isAdminPath ? adminItems : userItems;

  return (
    // 3. Dynamic styling based on path
    <aside className={`rps-sidebar-root ${isAdminPath ? 'admin-mode' : ''}`}>
      <div className="rps-logo-wrapper">
        <h2 className="rps-brand-name">
          ALPHA<span className="rps-brand-accent">.</span>
        </h2>
      </div>

      <nav className="rps-nav-list">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          const IconComponent = item.icon;
          
          return (
            <div 
              key={index} 
              className={`rps-menu-item ${isActive ? 'rps-item-active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <div className="rps-item-content">
                <IconComponent size={19} />
                <span className="rps-item-label">{item.label}</span>
              </div>
            </div>
          );
        })}
      </nav>

      {/* FOOTER WITH PROFILE */}
      <div className="rps-sidebar-footer">
        <div className="rps-user-profile">
            <UserCircle size={32} strokeWidth={1.5} className="rps-user-icon" />
            <div className="rps-user-info">
                <span className="rps-user-name">{userInfo.name}</span>
                {/* Dynamically update role text in footer based on path */}
                <span className="rps-user-role">{isAdminPath ? 'Administrator' : userInfo.role}</span>
            </div>
        </div>
        <div className="rps-version-info">
            <span className="rps-v-text">REVPTC</span>
            <span className="rps-v-num">V3.1</span>
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;