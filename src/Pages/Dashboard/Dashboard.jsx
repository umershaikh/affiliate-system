import React, { useState } from 'react';
import DashboardSidebar from './Components/DashboardSidebar/DashboardSidebar';
import DashboardNavbar from './Components/DashboardNavbar/DashboardNavbar';
import './Dashboard.css';
import DashboardHome from './Components/DashboardHome/DashboardHome';

function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    /* Root Namespace: vxp (Visual X Project) */
    <div className={`vxp-dash-shell ${isSidebarOpen ? 'vxp-dash-shell--active' : ''}`}>
      
      <aside className="vxp-dash-shell__sidebar-portal">
        <DashboardSidebar />
      </aside>

      {/* Unique Overlay Identifier */}
      <div className="vxp-dash-shell__backdrop-gate" onClick={toggleSidebar}></div>

      <div className="vxp-dash-shell__view-structure">
        <header className="vxp-dash-shell__nav-fixed-top">
          <DashboardNavbar onMenuClick={toggleSidebar} isOpen={isSidebarOpen} />
        </header>
        
        <main className="vxp-dash-shell__scroll-canvas">
          <DashboardHome/>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;