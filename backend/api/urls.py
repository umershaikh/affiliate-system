from django.urls import path
from . import views

urlpatterns = [
    # ── Auth ──
    path('login', views.login_view, name='login'),
    path('logout', views.logout_view, name='logout'),
    path('me', views.me_view, name='me'),
    path('change-password', views.change_password_view, name='change-password'),

    # ── User endpoints ──
    path('dashboard/stats', views.dashboard_stats_view, name='dashboard-stats'),
    path('withdrawals', views.withdrawals_view, name='withdrawals'),
    path('rewards', views.rewards_view, name='rewards'),
    path('rewards/claim', views.reward_claim_view, name='reward-claim'),
    path('tree', views.tree_view, name='tree'),
    path('tree/members', views.tree_members_view, name='tree-members'),
    path('pin-codes', views.pin_codes_view, name='pin-codes'),
    path('pin-requests', views.pin_requests_list_view, name='pin-requests-list'),
    path('pin-requests/create', views.pin_requests_create_view, name='pin-requests-create'),
    path('accounts', views.accounts_create_view, name='accounts-create'),
    path('contact', views.contact_view, name='contact'),
    path('payment-info', views.payment_info_view, name='payment-info'),
    path('deposits', views.deposits_list_view, name='deposits-list'),
    path('deposits/create', views.deposit_create_view, name='deposits-create'),
    path('withdrawals/balance', views.withdrawal_balance_view, name='withdrawal-balance'),
    path('withdrawals/create', views.withdrawal_create_view, name='withdrawal-create'),

    # ── Admin endpoints ──
    path('admin/dashboard', views.admin_dashboard_view, name='admin-dashboard'),
    path('admin/withdrawals/pending', views.admin_withdrawals_pending, name='admin-withdrawals-pending'),
    path('admin/withdrawals/today', views.admin_withdrawals_today, name='admin-withdrawals-today'),
    path('admin/withdrawals/all', views.admin_withdrawals_all, name='admin-withdrawals-all'),
    path('admin/withdrawals/<int:pk>/action', views.admin_withdrawal_action, name='admin-withdrawal-action'),
    path('admin/withdrawals/<int:pk>/delete', views.admin_withdrawal_delete, name='admin-withdrawal-delete'),
    path('admin/deposits/pending', views.admin_deposits_pending, name='admin-deposits-pending'),
    path('admin/deposits/all', views.admin_deposits_all, name='admin-deposits-all'),
    path('admin/deposits/<int:pk>/action', views.admin_deposit_action, name='admin-deposit-action'),
    path('admin/deposits/<int:pk>/delete', views.admin_deposit_delete, name='admin-deposit-delete'),
    path('admin/pins/available', views.admin_pins_available, name='admin-pins-available'),
    path('admin/pins/pending', views.admin_pins_pending, name='admin-pins-pending'),
    path('admin/pins/<int:pk>/action', views.admin_pin_action, name='admin-pin-action'),
    path('admin/pins/create', views.admin_pin_create, name='admin-pin-create'),
    path('admin/pins/<int:pk>/delete', views.admin_pin_delete, name='admin-pin-delete'),
    path('admin/rewards', views.admin_rewards_view, name='admin-rewards'),
    path('admin/rewards/create', views.admin_reward_create, name='admin-reward-create'),
    path('admin/rewards/<int:pk>/update', views.admin_reward_update, name='admin-reward-update'),
    path('admin/rewards/<int:pk>/delete', views.admin_reward_delete, name='admin-reward-delete'),
    path('admin/users', views.admin_users_view, name='admin-users'),
    path('admin/users/<int:pk>/update', views.admin_user_update, name='admin-user-update'),
    path('admin/users/<int:pk>/delete', views.admin_user_delete, name='admin-user-delete'),
]
