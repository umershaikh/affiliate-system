import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardSidebar from './Components/DashboardSidebar/DashboardSidebar';
import DashboardNavbar from './Components/DashboardNavbar/DashboardNavbar';
import './Dashboard.css';

// Component Imports
import DashboardHome from './Components/DashboardHome/DashboardHome';
import WithdrawHistory from './Components/WithdrawHistory/WithdrawHistory';
import MyTree from './Components/MyTree/MyTree';
import RewardList from './Components/RewardList/RewardList';
import CreateAccounts from './Components/CreateAccounts/CreateAccounts';
import BuyPinCode from './Components/BuyPInCode/BuyPinCode';
import ViewPinCode from './Components/ViewPinCode/ViewPinCode';
import ChangePassword from './Components/ChangePassword/ChangePassword';

function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`vxp-dash-shell ${isSidebarOpen ? 'vxp-dash-shell--active' : ''}`}>
      
      {/* 1. PERSISTENT SIDEBAR: Always visible on desktop */}
      <aside className="vxp-dash-shell__sidebar-portal">
        <DashboardSidebar closeMobileMenu={() => setIsSidebarOpen(false)} />
      </aside>

      {/* Mobile Overlay */}
      <div className="vxp-dash-shell__backdrop-gate" onClick={toggleSidebar}></div>

      <div className="vxp-dash-shell__view-structure">
        
        {/* 2. PERSISTENT NAVBAR: Always visible at the top */}
        <header className="vxp-dash-shell__nav-fixed-top">
          <DashboardNavbar onMenuClick={toggleSidebar} isOpen={isSidebarOpen} />
        </header>
        
        {/* 3. DYNAMIC CONTENT AREA: Only this part changes */}
        <main className="vxp-dash-shell__scroll-canvas">
          <Routes>
            {/* path="/" here acts as /dashboard/ */}
            <Route index element={<DashboardHome />} />
            <Route path="withdraw" element={<WithdrawHistory />} />
            <Route path="tree" element={<MyTree />} />
            <Route path="rewards" element={<RewardList />} />
            <Route path="create-account" element={<CreateAccounts />} />
            <Route path="buy-pin" element={<BuyPinCode />} />
            <Route path="view-pin" element={<ViewPinCode />} />
            <Route path="change-password" element={<ChangePassword />} />
            
            {/* Catch-all for dashboard sub-routes */}
            <Route path="*" element={<div>Page Not Found</div>} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;