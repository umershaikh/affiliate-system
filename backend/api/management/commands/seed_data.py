from decimal import Decimal
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import (
    UserProfile, Deposit, Withdrawal, Reward, PinCode, PinRequest, Account
)


class Command(BaseCommand):
    help = 'Seeds the database with initial data for the affiliate system'

    def handle(self, *args, **options):

        # ── Users + Tree ──
        if User.objects.count() == 0:
            # Root admin
            admin = User.objects.create_user(username='admin', password='123', email='admin@alpha.com')
            admin.is_staff = True
            admin.is_superuser = True
            admin.save()
            admin_profile = UserProfile.objects.create(user=admin, role='admin', parent=None, position=None)

            # Level 1: two users under admin
            user1 = User.objects.create_user(username='ali', password='123', email='ali@alpha.com')
            UserProfile.objects.create(user=user1, role='user', parent=admin, position='left')

            user2 = User.objects.create_user(username='ahmed', password='123', email='ahmed@alpha.com')
            UserProfile.objects.create(user=user2, role='user', parent=admin, position='right')

            # Level 2: two users under ali
            user3 = User.objects.create_user(username='sara', password='123', email='sara@alpha.com')
            UserProfile.objects.create(user=user3, role='user', parent=user1, position='left')

            user4 = User.objects.create_user(username='bilal', password='123', email='bilal@alpha.com')
            UserProfile.objects.create(user=user4, role='user', parent=user1, position='right')

            # Level 2: one user under ahmed (left only — right is empty)
            user5 = User.objects.create_user(username='fatima', password='123', email='fatima@alpha.com')
            UserProfile.objects.create(user=user5, role='user', parent=user2, position='left')

            self.stdout.write(self.style.SUCCESS(
                '✓ Seeded users: admin, ali, ahmed, sara, bilal, fatima (all pw: 123)'
            ))

            # ── Account records (track who created whom) ──
            Account.objects.bulk_create([
                Account(created_by=admin, linked_user=user1, username='ali', email='ali@alpha.com',
                        under_user=admin, position='left'),
                Account.objects.create(created_by=admin, linked_user=user2, username='ahmed', email='ahmed@alpha.com',
                        under_user=admin, position='right') if False else
                Account(created_by=admin, linked_user=user2, username='ahmed', email='ahmed@alpha.com',
                        under_user=admin, position='right'),
                Account(created_by=user1, linked_user=user3, username='sara', email='sara@alpha.com',
                        under_user=user1, position='left'),
                Account(created_by=user1, linked_user=user4, username='bilal', email='bilal@alpha.com',
                        under_user=user1, position='right'),
                Account(created_by=user2, linked_user=user5, username='fatima', email='fatima@alpha.com',
                        under_user=user2, position='left'),
            ])

            # ── Deposits ──
            Deposit.objects.bulk_create([
                Deposit(user=admin, amount=Decimal('5000.00'), status='Approved', payment_method='Bank'),
                Deposit(user=user1, amount=Decimal('1500.00'), status='Approved', payment_method='EasyPaisa'),
                Deposit(user=user1, amount=Decimal('500.00'), status='Pending', payment_method='JazzCash'),
                Deposit(user=user2, amount=Decimal('2000.00'), status='Approved', payment_method='Bank'),
                Deposit(user=user3, amount=Decimal('750.00'), status='Approved', payment_method='EasyPaisa'),
                Deposit(user=user4, amount=Decimal('300.00'), status='Rejected', payment_method='JazzCash'),
                Deposit(user=user5, amount=Decimal('1200.00'), status='Approved', payment_method='Bank'),
            ])
            self.stdout.write(self.style.SUCCESS('✓ Seeded deposits'))

            # ── Withdrawals ──
            Withdrawal.objects.bulk_create([
                Withdrawal(user=user1, email='ali@alpha.com', amount=Decimal('200.00'), status='Approved'),
                Withdrawal(user=user1, email='ali@alpha.com', amount=Decimal('350.00'), status='Pending'),
                Withdrawal(user=user2, email='ahmed@alpha.com', amount=Decimal('500.00'), status='Approved'),
                Withdrawal(user=user2, email='ahmed@alpha.com', amount=Decimal('150.00'), status='Pending'),
                Withdrawal(user=user3, email='sara@alpha.com', amount=Decimal('100.00'), status='Pending'),
                Withdrawal(user=user5, email='fatima@alpha.com', amount=Decimal('250.00'), status='Rejected'),
            ])
            self.stdout.write(self.style.SUCCESS('✓ Seeded withdrawals'))

            # ── Pin Codes ──
            PinCode.objects.bulk_create([
                PinCode(code='PIN-A1B2C3D4', status='Available', assigned_to=user1),
                PinCode(code='PIN-E5F6G7H8', status='Used', assigned_to=user1),
                PinCode(code='PIN-I9J0K1L2', status='Available', assigned_to=user2),
            ])
            self.stdout.write(self.style.SUCCESS('✓ Seeded pin codes'))

            # ── Pin Requests ──
            PinRequest.objects.bulk_create([
                PinRequest(user=user3, account_number='03001234567', trx_id='TRX001',
                           user_email='sara@alpha.com', amount='500', status='Pending'),
                PinRequest(user=user4, account_number='03009876543', trx_id='TRX002',
                           user_email='bilal@alpha.com', amount='1000', status='Pending'),
            ])
            self.stdout.write(self.style.SUCCESS('✓ Seeded pin requests'))

        # ── Rewards (always seed if empty) ──
        if Reward.objects.count() == 0:
            Reward.objects.bulk_create([
                Reward(team='10/10', rank='Level 1', reward='1,000', status='Non-active'),
                Reward(team='25/25', rank='Level 2', reward='2,000', status='Non-active'),
                Reward(team='50/50', rank='Level 3', reward='3,000', status='Non-active'),
                Reward(team='100/100', rank='Level 4', reward='5,000', status='Non-active'),
                Reward(team='250/250', rank='Level 5', reward='10,000', status='Non-active'),
                Reward(team='500/500', rank='Level 6', reward='30,000', status='Non-active'),
                Reward(team='1000/1000', rank='Level 7', reward='50,000', status='Non-active'),
                Reward(team='2.5k / 2.5k', rank='Level 8', reward='125,000', status='Non-active'),
                Reward(team='5k / 5k', rank='Level 9', reward='250,000', status='Non-active'),
                Reward(team='10k / 10k', rank='Level 10', reward='500,000', status='Non-active'),
                Reward(team='20k / 20k', rank='Level 11', reward='800,000', status='Non-active'),
                Reward(team='35k / 35k', rank='Level 12', reward='1,000,000', status='Non-active'),
                Reward(team='50k / 50k', rank='Level 13', reward='1,500,000', status='Non-active'),
            ])
            self.stdout.write(self.style.SUCCESS('✓ Seeded rewards'))

        self.stdout.write(self.style.SUCCESS('\n✅ Database seeding complete!'))
