import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardSidebar from './Components/DashboardSidebar/DashboardSidebar';
import DashboardNavbar from './Components/DashboardNavbar/DashboardNavbar';
import './Dashboard.css';

// User Components
import DashboardHome from './Components/DashboardHome/DashboardHome';
import WithdrawHistory from './Components/WithdrawHistory/WithdrawHistory';
import MyTree from './Components/MyTree/MyTree';
import RewardList from './Components/RewardList/RewardList';
import CreateAccounts from './Components/CreateAccounts/CreateAccounts';
import BuyPinCode from './Components/BuyPInCode/BuyPinCode';
import ViewPinCode from './Components/ViewPinCode/ViewPinCode';
import ChangePassword from './Components/ChangePassword/ChangePassword';
import Profile from './Components/Profile/Profile';
import DepositFunds from './Components/DepositFunds/DepositFunds';
import WatchAndEarn from './Components/Watch&Earn/WatchAndEarn';

// Admin Components
import AdminRoute from '../../components/AdminRoute';
import AdminDashboard from './Components/Admin/AdminDashboard';
import AdminPendingWithdrawals from './Components/Admin/AdminPendingWithdrawals';
import AdminTodayWithdrawals from './Components/Admin/AdminTodayWithdrawals';
import AdminTotalWithdrawals from './Components/Admin/AdminTotalWithdrawals';
import AdminAvailablePins from './Components/Admin/AdminAvailablePins';
import AdminPendingPins from './Components/Admin/AdminPendingPins';
import AdminRewards from './Components/Admin/AdminRewards';
import AdminUsers from './Components/Admin/AdminUsers';
import AdminPendingDeposits from './Components/Admin/AdminPendingDeposits';
import AdminTotalDeposits from './Components/Admin/AdminTotalDeposits';

function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`vxp-dash-shell ${isSidebarOpen ? 'vxp-dash-shell--active' : ''}`}>
      
      <aside className="vxp-dash-shell__sidebar-portal">
        <DashboardSidebar closeMobileMenu={() => setIsSidebarOpen(false)} />
      </aside>

      <div className="vxp-dash-shell__backdrop-gate" onClick={toggleSidebar}></div>

      <div className="vxp-dash-shell__view-structure">
        
        <header className="vxp-dash-shell__nav-fixed-top">
          <DashboardNavbar onMenuClick={toggleSidebar} isOpen={isSidebarOpen} />
        </header>
        
        <main className="vxp-dash-shell__scroll-canvas">
          <Routes>
            {/* ── User Routes ── */}
            <Route index element={<DashboardHome />} />
            <Route path="withdraw" element={<WithdrawHistory />} />
            <Route path="tree" element={<MyTree />} />
            <Route path="rewards" element={<RewardList />} />
            <Route path="create-account" element={<CreateAccounts />} />
            <Route path="buy-pin" element={<BuyPinCode />} />
            <Route path="view-pin" element={<ViewPinCode />} />
            <Route path="change-password" element={<ChangePassword />} />
            <Route path="profile" element={<Profile />} />
            <Route path="deposit" element={<DepositFunds />} />
            <Route path="watch-and-earn" element={<WatchAndEarn />} />

            {/* ── Admin Routes (protected) ── */}
            <Route path="admin/overview" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="admin/withdrawals-pending" element={<AdminRoute><AdminPendingWithdrawals /></AdminRoute>} />
            <Route path="admin/withdrawals-today" element={<AdminRoute><AdminTodayWithdrawals /></AdminRoute>} />
            <Route path="admin/withdrawals-total" element={<AdminRoute><AdminTotalWithdrawals /></AdminRoute>} />
            <Route path="admin/pins-available" element={<AdminRoute><AdminAvailablePins /></AdminRoute>} />
            <Route path="admin/pins-pending" element={<AdminRoute><AdminPendingPins /></AdminRoute>} />
            <Route path="admin/rewards" element={<AdminRoute><AdminRewards /></AdminRoute>} />
            <Route path="admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
            <Route path="admin/deposits-pending" element={<AdminRoute><AdminPendingDeposits /></AdminRoute>} />
            <Route path="admin/deposits-total" element={<AdminRoute><AdminTotalDeposits /></AdminRoute>} />

            <Route path="*" element={<div>Page Not Found</div>} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;