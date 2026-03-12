from django.contrib import admin
from .models import (
    UserProfile, Deposit, Withdrawal, Reward,
    PinCode, PinRequest, Account, ContactMessage
)


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'role', 'parent', 'position')
    list_filter = ('role', 'position')


@admin.register(Deposit)
class DepositAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'amount', 'status', 'payment_method', 'created_at')
    list_filter = ('status', 'payment_method')


@admin.register(Withdrawal)
class WithdrawalAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'email', 'amount', 'status', 'updated_at')
    list_filter = ('status',)


@admin.register(Reward)
class RewardAdmin(admin.ModelAdmin):
    list_display = ('rank', 'team', 'reward', 'status')


@admin.register(PinCode)
class PinCodeAdmin(admin.ModelAdmin):
    list_display = ('id', 'code', 'status', 'assigned_to', 'created_at')
    list_filter = ('status',)


@admin.register(PinRequest)
class PinRequestAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'account_number', 'trx_id', 'amount', 'status', 'created_at')
    list_filter = ('status',)


@admin.register(Account)
class AccountAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'email', 'created_by', 'under_user', 'position', 'created_at')


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'email', 'subject', 'created_at')
