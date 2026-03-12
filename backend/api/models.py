from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    """Extends Django auth User with affiliate tree fields."""
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=50, default='user')  # 'admin' or 'user'

    # Binary tree fields
    parent = models.ForeignKey(
        User, on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='children_profiles',
        help_text='The user who referred/sponsored this user'
    )
    position = models.CharField(
        max_length=10,
        choices=[('left', 'Left'), ('right', 'Right')],
        null=True, blank=True,
        help_text='Position under the parent (left or right)'
    )

    class Meta:
        db_table = 'user_profiles'

    def __str__(self):
        return f"{self.user.username} ({self.role})"

    def get_left_child(self):
        """Return the UserProfile placed on the left under this user."""
        try:
            return UserProfile.objects.get(parent=self.user, position='left')
        except UserProfile.DoesNotExist:
            return None

    def get_right_child(self):
        """Return the UserProfile placed on the right under this user."""
        try:
            return UserProfile.objects.get(parent=self.user, position='right')
        except UserProfile.DoesNotExist:
            return None

    def get_team_size(self):
        """Count all users in the downline (recursive)."""
        count = 0
        children = UserProfile.objects.filter(parent=self.user)
        for child in children:
            count += 1
            count += child.get_team_size()
        return count

    def get_direct_referrals(self):
        """Count direct children (max 2 in binary tree)."""
        return UserProfile.objects.filter(parent=self.user).count()


class Deposit(models.Model):
    """Tracks user deposits."""
    STATUS_CHOICES = [('Pending', 'Pending'), ('Approved', 'Approved'), ('Rejected', 'Rejected')]
    PAYMENT_CHOICES = [('', '---'), ('EasyPaisa', 'EasyPaisa'), ('JazzCash', 'JazzCash'), ('Bank', 'Bank Transfer')]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='deposits')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=50, default='Pending', choices=STATUS_CHOICES)
    payment_method = models.CharField(max_length=50, blank=True, default='', choices=PAYMENT_CHOICES)
    trx_id = models.CharField(max_length=100, blank=True, default='')
    sender_account = models.CharField(max_length=150, blank=True, default='')
    screenshot = models.TextField(blank=True, default='', help_text='Base64 screenshot of payment proof')
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'deposits'

    def __str__(self):
        return f"{self.user.username} — Rs.{self.amount} ({self.status})"


class Withdrawal(models.Model):
    STATUS_CHOICES = [('Pending', 'Pending'), ('Approved', 'Approved'), ('Rejected', 'Rejected')]
    PAYMENT_CHOICES = [('EasyPaisa', 'EasyPaisa'), ('JazzCash', 'JazzCash'), ('Bank', 'Bank Transfer')]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='withdrawals')
    email = models.EmailField()
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    payment_method = models.CharField(max_length=50, blank=True, default='', choices=PAYMENT_CHOICES)
    account_number = models.CharField(max_length=150, blank=True, default='')
    account_title = models.CharField(max_length=150, blank=True, default='')
    bank_name = models.CharField(max_length=150, blank=True, default='')
    iban = models.CharField(max_length=50, blank=True, default='')
    status = models.CharField(max_length=50, default='Pending', choices=STATUS_CHOICES)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'withdrawals'

    def __str__(self):
        return f"{self.email} — Rs.{self.amount}"


class Reward(models.Model):
    team = models.CharField(max_length=50)
    rank = models.CharField(max_length=50)
    reward = models.CharField(max_length=50)
    status = models.CharField(max_length=50)

    class Meta:
        db_table = 'rewards'

    def __str__(self):
        return f"{self.rank} — {self.reward}"


class UserReward(models.Model):
    """Tracks which reward levels a user has claimed."""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_rewards')
    reward = models.ForeignKey(Reward, on_delete=models.CASCADE)
    claimed_at = models.DateTimeField(auto_now_add=True)
    next_payout = models.DateTimeField()
    total_earned = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    class Meta:
        db_table = 'user_rewards'
        unique_together = ('user', 'reward')

    def __str__(self):
        return f"{self.user.username} — {self.reward.rank}"


class PinCode(models.Model):
    STATUS_CHOICES = [('Available', 'Available'), ('Used', 'Used')]

    code = models.CharField(max_length=100)
    status = models.CharField(max_length=50, default='Available', choices=STATUS_CHOICES)
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_pins')
    used_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='used_pins')
    used_at = models.DateTimeField(null=True, blank=True)
    pin_request = models.ForeignKey('PinRequest', on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'pin_codes'

    def __str__(self):
        return self.code


class PinRequest(models.Model):
    STATUS_CHOICES = [('Pending', 'Pending'), ('Approved', 'Approved'), ('Rejected', 'Rejected')]

    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    account_number = models.CharField(max_length=100)
    trx_id = models.CharField(max_length=100)
    user_email = models.EmailField(blank=True, default='')
    amount = models.CharField(max_length=50)
    screenshot = models.CharField(max_length=255, blank=True, default='')
    status = models.CharField(max_length=50, default='Pending', choices=STATUS_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'pin_requests'

    def __str__(self):
        return f"PIN Request #{self.id}"


class Account(models.Model):
    """Record of account creation — links to the User that was created."""
    created_by = models.ForeignKey(
        User, on_delete=models.CASCADE,
        related_name='created_accounts',
        null=True, blank=True,
        help_text='The user who submitted this form'
    )
    linked_user = models.OneToOneField(
        User, on_delete=models.SET_NULL,
        related_name='account_record',
        null=True, blank=True,
        help_text='The actual Django User that was created from this form'
    )
    pin = models.CharField(max_length=100, blank=True, default='')
    username = models.CharField(max_length=150)
    email = models.EmailField()
    account_number = models.CharField(max_length=100, blank=True, default='')
    payment_method = models.CharField(max_length=50, blank=True, default='')
    account_title = models.CharField(max_length=150, blank=True, default='')
    under_user = models.ForeignKey(
        User, on_delete=models.SET_NULL,
        related_name='downline_accounts',
        null=True, blank=True,
        help_text='Parent user in the binary tree'
    )
    position = models.CharField(max_length=10, default='right')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'accounts'

    def __str__(self):
        return self.username


class ContactMessage(models.Model):
    name = models.CharField(max_length=150)
    email = models.EmailField()
    subject = models.CharField(max_length=255)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'contact_messages'

    def __str__(self):
        return f"{self.name} — {self.subject}"
