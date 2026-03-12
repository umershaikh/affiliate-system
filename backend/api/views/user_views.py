# ═══════════════════════════════════════════════
#  USER VIEWS — Dynamic Dashboard, Tree,
#  Withdrawals, Rewards, Pins, Accounts, Contact
# ═══════════════════════════════════════════════

import json
import re
import urllib.request
import urllib.parse
from django.utils import timezone
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.contrib.auth.models import User
from django.db.models import Sum, Count, Q
from django.conf import settings as django_settings
from api.models import (
    UserProfile, Deposit, Withdrawal, Reward, UserReward,
    PinCode, PinRequest, Account, ContactMessage
)
from api.auth import login_required


def _parse_json_body(request):
    """Safely parse JSON from the request body. Returns (data, error_response)."""
    try:
        return json.loads(request.body), None
    except (json.JSONDecodeError, ValueError):
        return None, JsonResponse(
            {'success': False, 'message': 'Invalid or missing JSON body.'},
            status=400
        )


# ── DASHBOARD (user-specific, computed from DB) ──

@require_http_methods(["GET"])
@login_required
def dashboard_stats_view(request):
    """Return real stats for the logged-in user, computed from the database."""
    user = request.auth_user

    # Withdrawals
    w_qs = Withdrawal.objects.filter(user=user)
    withdrawal_agg = w_qs.aggregate(
        total=Sum('amount'),
        approved=Sum('amount', filter=Q(status='Approved')),
        pending=Sum('amount', filter=Q(status='Pending')),
        pending_count=Count('id', filter=Q(status='Pending')),
        approved_count=Count('id', filter=Q(status='Approved')),
        rejected_count=Count('id', filter=Q(status='Rejected')),
    )

    # Deposits
    d_qs = Deposit.objects.filter(user=user)
    deposit_agg = d_qs.aggregate(
        total=Sum('amount'),
        approved=Sum('amount', filter=Q(status='Approved')),
        pending_count=Count('id', filter=Q(status='Pending')),
        approved_count=Count('id', filter=Q(status='Approved')),
        rejected_count=Count('id', filter=Q(status='Rejected')),
    )

    # Available balance = approved deposits - approved withdrawals - pending withdrawals
    approved_deposits = float(deposit_agg['approved'] or 0)
    approved_withdrawals = float(withdrawal_agg['approved'] or 0)
    pending_withdrawals = float(withdrawal_agg['pending'] or 0)
    available_balance = max(approved_deposits - approved_withdrawals - pending_withdrawals, 0)

    # Team / Referrals
    try:
        profile = user.userprofile
        direct_referrals = profile.get_direct_referrals()
        team_size = profile.get_team_size()
    except UserProfile.DoesNotExist:
        direct_referrals = 0
        team_size = 0

    # Pins
    pins_available = PinCode.objects.filter(assigned_to=user, status='Available').count()
    pins_used = PinCode.objects.filter(assigned_to=user, status='Used').count()

    return JsonResponse({
        'availableBalance': available_balance,
        'withdrawals': {
            'total': float(withdrawal_agg['total'] or 0),
            'approved': float(withdrawal_agg['approved'] or 0),
            'pending': float(withdrawal_agg['pending'] or 0),
            'pendingCount': withdrawal_agg['pending_count'],
            'approvedCount': withdrawal_agg['approved_count'],
            'rejectedCount': withdrawal_agg['rejected_count'],
        },
        'deposits': {
            'total': float(deposit_agg['total'] or 0),
            'approved': float(deposit_agg['approved'] or 0),
            'pendingCount': deposit_agg['pending_count'],
            'approvedCount': deposit_agg['approved_count'],
            'rejectedCount': deposit_agg['rejected_count'],
        },
        'team': {
            'directReferrals': direct_referrals,
            'totalTeamSize': team_size,
        },
        'pins': {
            'available': pins_available,
            'used': pins_used,
        },
        'joinDate': user.date_joined.strftime('%Y-%m-%d'),
    })


# ── TREE (dynamic — built from UserProfile parent-child) ──

@require_http_methods(["GET"])
@login_required
def tree_view(request):
    """Build the binary tree dynamically for the logged-in user (as root)."""
    user = request.auth_user

    def build_node(u, depth=0, max_depth=4):
        """Recursively build tree node from UserProfile relationships."""
        if u is None or depth > max_depth:
            return None

        try:
            profile = u.userprofile
        except UserProfile.DoesNotExist:
            return {
                'name': u.username,
                'status': 'active',
                'position': None,
                'children': [
                    {'name': 'Empty', 'status': 'empty', 'position': 'left', 'children': []},
                    {'name': 'Empty', 'status': 'empty', 'position': 'right', 'children': []},
                ]
            }

        left_child = profile.get_left_child()
        right_child = profile.get_right_child()

        left_node = build_node(left_child.user, depth + 1, max_depth) if left_child else {
            'name': 'Empty', 'status': 'empty', 'position': 'left', 'children': []
        }
        right_node = build_node(right_child.user, depth + 1, max_depth) if right_child else {
            'name': 'Empty', 'status': 'empty', 'position': 'right', 'children': []
        }

        if left_node and 'position' not in left_node:
            left_node['position'] = 'left'
        if right_node and 'position' not in right_node:
            right_node['position'] = 'right'

        return {
            'name': u.username,
            'status': 'root' if depth == 0 else 'active',
            'position': profile.position,
            'children': [left_node, right_node],
        }

    tree = build_node(user)
    return JsonResponse(tree)


@require_http_methods(["GET"])
@login_required
def tree_members_view(request):
    """Return flat list of all users in the downline tree with available positions."""
    user = request.auth_user
    members = []

    def collect(u):
        try:
            profile = u.userprofile
        except UserProfile.DoesNotExist:
            profile = None

        has_left = UserProfile.objects.filter(parent=u, position='left').exists()
        has_right = UserProfile.objects.filter(parent=u, position='right').exists()
        available = []
        if not has_left:
            available.append('left')
        if not has_right:
            available.append('right')

        members.append({
            'username': u.username,
            'email': u.email,
            'availablePositions': available,
        })

        children = UserProfile.objects.filter(parent=u)
        for child in children:
            collect(child.user)

    collect(user)
    return JsonResponse(members, safe=False)


# ── WITHDRAWALS ──

@require_http_methods(["GET"])
@login_required
def withdrawals_view(request):
    """Return the logged-in user's withdrawal history."""
    rows = Withdrawal.objects.filter(user=request.auth_user).order_by('-id')
    result = [
        {
            'id': row.id,
            'email': row.email,
            'amount': str(row.amount),
            'paymentMethod': row.payment_method,
            'accountNumber': row.account_number,
            'accountTitle': row.account_title,
            'bankName': row.bank_name,
            'status': row.status,
            'updatedAt': row.updated_at.strftime('%Y-%m-%d %H:%M') if row.updated_at else '',
        }
        for row in rows
    ]
    return JsonResponse(result, safe=False)


@require_http_methods(["GET"])
@login_required
def withdrawal_balance_view(request):
    """Return user's available balance (approved deposits - approved withdrawals - pending withdrawals)."""
    user = request.auth_user
    approved_deposits = Deposit.objects.filter(user=user, status='Approved').aggregate(
        total=Sum('amount'))['total'] or 0
    approved_withdrawals = Withdrawal.objects.filter(user=user, status='Approved').aggregate(
        total=Sum('amount'))['total'] or 0
    pending_withdrawals = Withdrawal.objects.filter(user=user, status='Pending').aggregate(
        total=Sum('amount'))['total'] or 0
    balance = float(approved_deposits) - float(approved_withdrawals) - float(pending_withdrawals)
    return JsonResponse({'balance': max(balance, 0)})


@csrf_exempt
@require_http_methods(["POST"])
@login_required
def withdrawal_create_view(request):
    """Create a new withdrawal request. Validates balance and sends admin email."""
    user = request.auth_user
    data, err = _parse_json_body(request)
    if err:
        return err

    amount = data.get('amount', '')
    payment_method = data.get('paymentMethod', '')
    account_number = data.get('accountNumber', '')
    account_title = data.get('accountTitle', '')
    bank_name = data.get('bankName', '')
    iban = data.get('iban', '')

    # Validate amount
    if not amount:
        return JsonResponse({'success': False, 'message': 'Amount is required.'}, status=400)
    try:
        amount_val = float(amount)
        if amount_val <= 0:
            raise ValueError
    except ValueError:
        return JsonResponse({'success': False, 'message': 'Enter a valid amount.'}, status=400)

    # Validate payment method
    if payment_method not in ['EasyPaisa', 'JazzCash', 'Bank']:
        return JsonResponse({'success': False, 'message': 'Select a valid payment method.'}, status=400)

    # Bank-specific validation
    if payment_method == 'Bank':
        if not bank_name or not account_number or not account_title:
            return JsonResponse({'success': False, 'message': 'Bank name, account number, and account title are required for bank transfers.'}, status=400)
    else:
        if not account_number:
            return JsonResponse({'success': False, 'message': 'Account number is required.'}, status=400)

    # Balance check
    approved_deposits = Deposit.objects.filter(user=user, status='Approved').aggregate(
        total=Sum('amount'))['total'] or 0
    approved_withdrawals = Withdrawal.objects.filter(user=user, status='Approved').aggregate(
        total=Sum('amount'))['total'] or 0
    pending_withdrawals = Withdrawal.objects.filter(user=user, status='Pending').aggregate(
        total=Sum('amount'))['total'] or 0
    available = float(approved_deposits) - float(approved_withdrawals) - float(pending_withdrawals)

    if amount_val > available:
        return JsonResponse({
            'success': False,
            'message': f'Insufficient balance. Available: Rs. {available:.2f}'
        }, status=400)

    # Create withdrawal
    Withdrawal.objects.create(
        user=user,
        email=user.email or '',
        amount=amount_val,
        payment_method=payment_method,
        account_number=account_number,
        account_title=account_title,
        bank_name=bank_name,
        iban=iban,
        status='Pending',
    )

    # Send admin email notification (best-effort, don't block on failure)
    try:
        from django.core.mail import send_mail
        from django.conf import settings
        method_label = 'Bank Transfer' if payment_method == 'Bank' else payment_method
        body = (
            f"New withdrawal request from {user.username} ({user.email})\n\n"
            f"Amount: Rs. {amount_val}\n"
            f"Method: {method_label}\n"
            f"Account: {account_number}\n"
            f"Account Title: {account_title}\n"
        )
        if payment_method == 'Bank':
            body += f"Bank: {bank_name}\nIBAN: {iban}\n"
        body += f"\nPlease review in the admin panel."
        send_mail(
            subject=f'[AWP] Withdrawal Request — Rs. {amount_val} by {user.username}',
            message=body,
            from_email=settings.DEFAULT_FROM_EMAIL if hasattr(settings, 'DEFAULT_FROM_EMAIL') else 'noreply@alphawp.com',
            recipient_list=[settings.ADMIN_EMAIL if hasattr(settings, 'ADMIN_EMAIL') else 'admin@alphawp.com'],
            fail_silently=True,
        )
    except Exception:
        pass  # email is best-effort

    return JsonResponse({
        'success': True,
        'message': 'Withdrawal request submitted successfully! It will be reviewed by admin.',
    })


# ── REWARDS ──

def process_reward_payouts(user):
    """Check all claimed rewards and pay out monthly salary if due."""
    now = timezone.now()
    claimed = UserReward.objects.filter(user=user, next_payout__lte=now)
    for ur in claimed:
        # Parse reward amount
        try:
            amount = int(re.search(r'\d+', str(ur.reward.reward)).group())
        except (ValueError, AttributeError):
            continue
        # Credit salary as an approved deposit
        Deposit.objects.create(
            user=user,
            amount=amount,
            status='Approved',
            payment_method='Reward',
            trx_id=f'SALARY-{ur.reward.rank}-{now.strftime("%Y%m")}',
            sender_account='System',
        )
        ur.total_earned += amount
        ur.next_payout = now + timezone.timedelta(days=30)
        ur.save()


@login_required
def rewards_view(request):
    """Return all reward levels + user's progress + claim status."""
    user = request.auth_user

    # Process any pending payouts first
    process_reward_payouts(user)

    # Get user's team size
    try:
        profile = user.userprofile
        team_size = profile.get_team_size()
    except UserProfile.DoesNotExist:
        team_size = 0

    # Count pins used
    pins_used = PinCode.objects.filter(
        Q(used_by=user) | Q(assigned_to=user, status='Used')
    ).count()

    # Get claimed reward IDs
    claimed_map = {}
    for ur in UserReward.objects.filter(user=user):
        claimed_map[ur.reward_id] = {
            'claimedAt': ur.claimed_at.strftime('%Y-%m-%d'),
            'nextPayout': ur.next_payout.strftime('%Y-%m-%d'),
            'totalEarned': float(ur.total_earned),
        }

    rows = Reward.objects.all().order_by('id')
    levels = []
    current_rank = None
    next_level = None

    for row in rows:
        try:
            match = re.search(r'\d+', str(row.team)) if row.team else None
            required = int(match.group()) if match else 0
        except (ValueError, TypeError):
            required = 0

        eligible = team_size >= required
        claimed = row.id in claimed_map
        can_claim = eligible and not claimed and row.status != 'Non-active'

        if eligible:
            current_rank = row.rank
        elif next_level is None:
            next_level = {'rank': row.rank, 'required': required}

        level_data = {
            'id': row.id,
            'team': row.team,
            'rank': row.rank,
            'reward': row.reward,
            'status': row.status,
            'required': required,
            'unlocked': eligible,
            'claimed': claimed,
            'canClaim': can_claim,
        }
        if claimed:
            level_data['claimInfo'] = claimed_map[row.id]

        levels.append(level_data)

    return JsonResponse({
        'levels': levels,
        'teamSize': team_size,
        'pinsUsed': pins_used,
        'currentRank': current_rank or 'Starter',
        'nextLevel': next_level,
    })


@csrf_exempt
@require_http_methods(["POST"])
@login_required
def reward_claim_view(request):
    """Claim a reward level — starts monthly salary."""
    data, err = _parse_json_body(request)
    if err:
        return err
    reward_id = data.get('rewardId')

    try:
        reward = Reward.objects.get(pk=reward_id)
    except Reward.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Reward not found.'}, status=404)

    if reward.status == 'Non-active':
        return JsonResponse({'success': False, 'message': 'This reward level is not active.'}, status=400)

    # Check team requirement
    user = request.auth_user
    try:
        profile = user.userprofile
        team_size = profile.get_team_size()
    except UserProfile.DoesNotExist:
        team_size = 0

    try:
        required = int(re.search(r'\d+', str(reward.team)).group()) if reward.team else 0
    except (ValueError, AttributeError):
        required = 0

    if team_size < required:
        return JsonResponse({'success': False, 'message': f'You need {required} team members. You have {team_size}.'}, status=400)

    # Check not already claimed
    if UserReward.objects.filter(user=user, reward=reward).exists():
        return JsonResponse({'success': False, 'message': 'You have already claimed this reward.'}, status=400)

    # Claim it — first payout in 30 days
    now = timezone.now()
    UserReward.objects.create(
        user=user,
        reward=reward,
        next_payout=now + timezone.timedelta(days=30),
    )

    return JsonResponse({
        'success': True,
        'message': f'🎉 Congratulations! You\'ve unlocked {reward.rank}! Your monthly salary of Rs. {reward.reward} will be deposited every 30 days.',
    })


# ── PIN CODES ──

@require_http_methods(["GET"])
@login_required
def pin_codes_view(request):
    """Return pin codes assigned to the logged-in user."""
    rows = PinCode.objects.filter(assigned_to=request.auth_user).order_by('-id')
    result = [
        {
            'id': row.id,
            'code': row.code,
            'status': row.status,
            'usedBy': row.used_by.username if row.used_by else None,
            'usedAt': row.used_at.strftime('%Y-%m-%d %H:%M') if row.used_at else None,
            'createdAt': str(row.created_at),
        }
        for row in rows
    ]
    return JsonResponse(result, safe=False)


# ── PIN REQUESTS ──

@require_http_methods(["GET"])
@login_required
def pin_requests_list_view(request):
    """Return pin requests made by the logged-in user."""
    rows = PinRequest.objects.filter(user=request.auth_user).order_by('-id')
    result = [
        {
            'id': row.id,
            'accountNumber': row.account_number,
            'trxId': row.trx_id,
            'userEmail': row.user_email,
            'amount': row.amount,
            'screenshot': row.screenshot,
            'status': row.status,
            'createdAt': row.created_at.strftime('%Y-%m-%d %H:%M') if row.created_at else '',
        }
        for row in rows
    ]
    return JsonResponse(result, safe=False)


@csrf_exempt
@require_http_methods(["POST"])
@login_required
def pin_requests_create_view(request):
    """Submit a new pin request."""
    data, err = _parse_json_body(request)
    if err:
        return err
    PinRequest.objects.create(
        user=request.auth_user,
        account_number=data.get('accountNumber', ''),
        trx_id=data.get('trxId', ''),
        user_email=request.auth_user.email or data.get('userEmail', ''),
        amount=data.get('amount', ''),
        screenshot=data.get('screenshot', ''),
        status='Pending',
    )
    return JsonResponse({'success': True, 'message': 'Pin request submitted successfully.'})


# ── ACCOUNTS (Join a User — creates real User + tree placement) ──

@csrf_exempt
@require_http_methods(["POST"])
@login_required
def accounts_create_view(request):
    """
    Create a new user account and place them in the binary tree.
    Requires a valid, available E-Pin assigned to the current user.
    """
    data, err = _parse_json_body(request)
    if err:
        return err
    username = data.get('username', '').strip()
    email = data.get('email', '').strip()
    position = data.get('position', 'Right').lower()
    under_username = data.get('underUserId', '').strip()
    pin_code = data.get('pin', '').strip()

    # Validation
    if not username or not email:
        return JsonResponse({'success': False, 'message': 'Username and email are required.'}, status=400)

    # Validate E-Pin
    if not pin_code:
        return JsonResponse({'success': False, 'message': 'An E-Pin is required to create an account.'}, status=400)

    try:
        pin = PinCode.objects.get(code=pin_code, assigned_to=request.auth_user, status='Available')
    except PinCode.DoesNotExist:
        return JsonResponse({
            'success': False,
            'message': 'Invalid E-Pin. Make sure the pin is assigned to you and has not been used.'
        }, status=400)

    if User.objects.filter(username=username).exists():
        return JsonResponse({'success': False, 'message': 'This username is already taken.'}, status=400)

    if User.objects.filter(email=email).exists():
        return JsonResponse({'success': False, 'message': 'This email is already registered.'}, status=400)

    # Find parent user
    if under_username:
        try:
            parent_user = User.objects.get(username=under_username)
        except User.DoesNotExist:
            try:
                parent_user = User.objects.get(email=under_username)
            except User.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'message': f'Parent user "{under_username}" not found.'
                }, status=400)
    else:
        parent_user = request.auth_user

    # Check if position is available
    existing = UserProfile.objects.filter(parent=parent_user, position=position).first()
    if existing:
        return JsonResponse({
            'success': False,
            'message': f'The {position} position under "{parent_user.username}" is already taken by "{existing.user.username}".'
        }, status=400)

    # Create the new Django User
    new_user = User.objects.create_user(
        username=username,
        email=email,
        password='123',
    )

    # Create UserProfile with tree placement
    UserProfile.objects.create(
        user=new_user,
        role='user',
        parent=parent_user,
        position=position,
    )

    # Consume the E-Pin
    pin.status = 'Used'
    pin.used_by = new_user
    pin.used_at = timezone.now()
    pin.save()

    # Create Account record
    Account.objects.create(
        created_by=request.auth_user,
        linked_user=new_user,
        pin=pin_code,
        username=username,
        email=email,
        account_number=data.get('accountNumber', ''),
        payment_method=data.get('paymentMethod', ''),
        account_title=data.get('accountTitle', ''),
        under_user=parent_user,
        position=position,
    )

    return JsonResponse({
        'success': True,
        'message': f'Account "{username}" created using pin {pin_code}. Placed under "{parent_user.username}" ({position} side). Default password: 123',
    })


# ── DEPOSITS ──

# Admin payment details — shown to users when they choose a payment method
ADMIN_PAYMENT_ACCOUNTS = {
    'EasyPaisa': {
        'title': 'Alpha Wealth (EasyPaisa)',
        'accountNumber': '0300-1234567',
        'accountName': 'Alpha Wealth Official',
        'instructions': 'Send the amount to the above EasyPaisa number and attach screenshot below.',
    },
    'JazzCash': {
        'title': 'Alpha Wealth (JazzCash)',
        'accountNumber': '0301-7654321',
        'accountName': 'Alpha Wealth Official',
        'instructions': 'Send the amount to the above JazzCash number and attach screenshot below.',
    },
    'Bank': {
        'title': 'Alpha Wealth (Bank Transfer)',
        'accountNumber': 'PK06 MEZN 0001 2345 6789 0123',
        'bankName': 'Meezan Bank',
        'accountName': 'Alpha Wealth Pvt Ltd',
        'instructions': 'Transfer to the above bank account and attach screenshot below.',
    },
}


@require_http_methods(["GET"])
@login_required
def payment_info_view(request):
    """Return admin payment details so frontend can display them."""
    return JsonResponse(ADMIN_PAYMENT_ACCOUNTS)


@require_http_methods(["GET"])
@login_required
def deposits_list_view(request):
    """Return the logged-in user's deposit history."""
    rows = Deposit.objects.filter(user=request.auth_user).order_by('-id')
    result = [
        {
            'id': row.id,
            'amount': str(row.amount),
            'paymentMethod': row.payment_method,
            'trxId': row.trx_id,
            'senderAccount': row.sender_account,
            'status': row.status,
            'createdAt': row.created_at.strftime('%Y-%m-%d %H:%M'),
        }
        for row in rows
    ]
    return JsonResponse(result, safe=False)


@csrf_exempt
@require_http_methods(["POST"])
@login_required
def deposit_create_view(request):
    """Submit a new deposit request with payment screenshot."""
    data, err = _parse_json_body(request)
    if err:
        return err
    amount = data.get('amount', '')
    payment_method = data.get('paymentMethod', '')
    trx_id = data.get('trxId', '')
    sender_account = data.get('senderAccount', '')
    screenshot = data.get('screenshot', '')

    if not amount or not payment_method:
        return JsonResponse({'success': False, 'message': 'Amount and payment method are required.'}, status=400)

    try:
        amount_val = float(amount)
        if amount_val <= 0:
            raise ValueError
    except ValueError:
        return JsonResponse({'success': False, 'message': 'Please enter a valid amount.'}, status=400)

    if payment_method not in ['EasyPaisa', 'JazzCash', 'Bank']:
        return JsonResponse({'success': False, 'message': 'Invalid payment method.'}, status=400)

    Deposit.objects.create(
        user=request.auth_user,
        amount=amount_val,
        payment_method=payment_method,
        trx_id=trx_id,
        sender_account=sender_account,
        screenshot=screenshot,
        status='Pending',
    )

    return JsonResponse({
        'success': True,
        'message': 'Deposit request submitted! It will be reviewed by admin shortly.',
    })


# ── CONTACT (public — no auth) ──

@csrf_exempt
@require_http_methods(["POST"])
def contact_view(request):
    """Public endpoint — submit a contact message (no auth required)."""
    data, err = _parse_json_body(request)
    if err:
        return err

    name = data.get('name', '')[:150]
    email = data.get('email', '')[:254]
    subject = data.get('subject', '')[:255]
    message = data.get('message', '')[:5000]

    if not name or not email or not subject or not message:
        return JsonResponse({'success': False, 'message': 'All fields are required.'}, status=400)

    # Verify reCAPTCHA token (if configured)
    recaptcha_token = data.get('recaptchaToken', '')
    recaptcha_secret = getattr(django_settings, 'RECAPTCHA_SECRET_KEY', '')
    if recaptcha_secret and recaptcha_token:
        try:
            verify_data = urllib.parse.urlencode({
                'secret': recaptcha_secret,
                'response': recaptcha_token,
            }).encode()
            req = urllib.request.Request('https://www.google.com/recaptcha/api/siteverify', data=verify_data)
            resp = urllib.request.urlopen(req, timeout=5)
            result = json.loads(resp.read().decode())
            if not result.get('success'):
                return JsonResponse({'success': False, 'message': 'reCAPTCHA verification failed.'}, status=400)
        except Exception:
            pass  # Fail open — don't block legit users if Google is unreachable

    ContactMessage.objects.create(
        name=name,
        email=email,
        subject=subject,
        message=message,
    )
    return JsonResponse({'success': True, 'message': 'Message sent successfully.'})
