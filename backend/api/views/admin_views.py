# ═══════════════════════════════════════════════
#  ADMIN VIEWS — Platform Dashboard, Withdrawal
#  Management, Pin Management, Users, Rewards
# ═══════════════════════════════════════════════

import json
import uuid
from datetime import date
from decimal import Decimal
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.contrib.auth.models import User
from django.db.models import Sum, Count, Q
from api.models import UserProfile, Deposit, Withdrawal, PinCode, PinRequest, Reward
from api.auth import admin_required


def _parse_json_body(request):
    """Safely parse JSON from the request body. Returns (data, error_response)."""
    try:
        return json.loads(request.body), None
    except (json.JSONDecodeError, ValueError):
        return None, JsonResponse(
            {'success': False, 'message': 'Invalid or missing JSON body.'},
            status=400
        )


# ── ADMIN DASHBOARD (platform-wide real stats) ──

@require_http_methods(["GET"])
@admin_required
def admin_dashboard_view(request):
    """Platform-wide statistics computed live from the database."""

    # Users
    total_users = User.objects.count()
    active_users = User.objects.filter(is_active=True).count()

    # Deposits
    dep_agg = Deposit.objects.aggregate(
        total=Sum('amount'),
        approved=Sum('amount', filter=Q(status='Approved')),
        pending_count=Count('id', filter=Q(status='Pending')),
        rejected_count=Count('id', filter=Q(status='Rejected')),
    )

    # Withdrawals
    w_agg = Withdrawal.objects.aggregate(
        total=Sum('amount'),
        approved=Sum('amount', filter=Q(status='Approved')),
        pending_count=Count('id', filter=Q(status='Pending')),
        rejected_count=Count('id', filter=Q(status='Rejected')),
    )

    # Pins
    pins_available = PinCode.objects.filter(status='Available').count()
    pins_pending = PinRequest.objects.filter(status='Pending').count()

    return JsonResponse({
        'users': {
            'total': total_users,
            'active': active_users,
        },
        'deposits': {
            'total': float(dep_agg['total'] or 0),
            'approved': float(dep_agg['approved'] or 0),
            'pendingCount': dep_agg['pending_count'],
            'rejectedCount': dep_agg['rejected_count'],
        },
        'withdrawals': {
            'total': float(w_agg['total'] or 0),
            'approved': float(w_agg['approved'] or 0),
            'pendingCount': w_agg['pending_count'],
            'rejectedCount': w_agg['rejected_count'],
        },
        'pins': {
            'available': pins_available,
            'pendingRequests': pins_pending,
        },
    })


# ── WITHDRAWAL MANAGEMENT ──────────────────────

@require_http_methods(["GET"])
@admin_required
def admin_withdrawals_pending(request):
    rows = Withdrawal.objects.filter(status='Pending').order_by('-id')
    return JsonResponse([_serialize_withdrawal(w) for w in rows], safe=False)


@require_http_methods(["GET"])
@admin_required
def admin_withdrawals_today(request):
    today = date.today()
    rows = Withdrawal.objects.filter(
        status='Approved',
        updated_at__date=today
    ).order_by('-id')
    return JsonResponse([_serialize_withdrawal(w) for w in rows], safe=False)


@require_http_methods(["GET"])
@admin_required
def admin_withdrawals_all(request):
    rows = Withdrawal.objects.all().order_by('-id')
    return JsonResponse([_serialize_withdrawal(w) for w in rows], safe=False)


@csrf_exempt
@require_http_methods(["POST"])
@admin_required
def admin_withdrawal_action(request, pk):
    data, err = _parse_json_body(request)
    if err:
        return err
    action = data.get('action', '')
    try:
        withdrawal = Withdrawal.objects.get(pk=pk)
    except Withdrawal.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Not found.'}, status=404)

    if action == 'approve':
        withdrawal.status = 'Approved'
    elif action == 'reject':
        withdrawal.status = 'Rejected'
    else:
        return JsonResponse({'success': False, 'message': 'Invalid action.'}, status=400)
    withdrawal.save()
    return JsonResponse({'success': True, 'message': f'Withdrawal {action}d.'})


def _serialize_withdrawal(w):
    return {
        'id': w.id,
        'email': w.email,
        'username': w.user.username if w.user else 'N/A',
        'amount': str(w.amount),
        'status': w.status,
        'updatedAt': w.updated_at.strftime('%Y-%m-%d %H:%M:%S') if w.updated_at else '',
        'createdAt': w.created_at.strftime('%Y-%m-%d %H:%M:%S') if w.created_at else '',
    }


# ── PIN MANAGEMENT ─────────────────────────────

@require_http_methods(["GET"])
@admin_required
def admin_pins_available(request):
    rows = PinCode.objects.all().order_by('-id')
    return JsonResponse([
        {
            'id': r.id,
            'code': r.code,
            'status': r.status,
            'assignedTo': r.assigned_to.username if r.assigned_to else None,
            'usedBy': r.used_by.username if r.used_by else None,
            'createdAt': r.created_at.strftime('%Y-%m-%d %H:%M') if r.created_at else '',
        }
        for r in rows
    ], safe=False)


@require_http_methods(["GET"])
@admin_required
def admin_pins_pending(request):
    rows = PinRequest.objects.filter(status='Pending').order_by('-id')
    return JsonResponse([_serialize_pin_request(r) for r in rows], safe=False)


@csrf_exempt
@require_http_methods(["POST"])
@admin_required
def admin_pin_action(request, pk):
    data, err = _parse_json_body(request)
    if err:
        return err
    action = data.get('action', '')
    try:
        pin_req = PinRequest.objects.get(pk=pk)
    except PinRequest.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Not found.'}, status=404)

    if action == 'approve':
        pin_req.status = 'Approved'
        pin_code = PinCode.objects.create(
            code=f'PIN-{uuid.uuid4().hex[:8].upper()}',
            status='Available',
            assigned_to=pin_req.user,
            pin_request=pin_req,
        )
        pin_req.save()
        return JsonResponse({'success': True, 'message': f'Approved. Pin: {pin_code.code}'})
    elif action == 'reject':
        pin_req.status = 'Rejected'
        pin_req.save()
        return JsonResponse({'success': True, 'message': 'Rejected.'})
    else:
        return JsonResponse({'success': False, 'message': 'Invalid action.'}, status=400)


def _serialize_pin_request(r):
    return {
        'id': r.id,
        'username': r.user.username if r.user else 'N/A',
        'accountNumber': r.account_number,
        'trxId': r.trx_id,
        'userEmail': r.user_email,
        'amount': r.amount,
        'screenshot': r.screenshot,
        'status': r.status,
        'createdAt': str(r.created_at),
    }


# ── DEPOSIT MANAGEMENT ─────────────────────────

@require_http_methods(["GET"])
@admin_required
def admin_deposits_pending(request):
    """List all pending deposits."""
    rows = Deposit.objects.filter(status='Pending').order_by('-id')
    return JsonResponse([_serialize_deposit(d) for d in rows], safe=False)


@require_http_methods(["GET"])
@admin_required
def admin_deposits_all(request):
    """List all deposits."""
    rows = Deposit.objects.all().order_by('-id')
    return JsonResponse([_serialize_deposit(d) for d in rows], safe=False)


@csrf_exempt
@require_http_methods(["POST"])
@admin_required
def admin_deposit_action(request, pk):
    """Approve or reject a deposit."""
    data, err = _parse_json_body(request)
    if err:
        return err
    action = data.get('action', '')
    try:
        deposit = Deposit.objects.get(pk=pk)
    except Deposit.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Not found.'}, status=404)

    if action == 'approve':
        deposit.status = 'Approved'
    elif action == 'reject':
        deposit.status = 'Rejected'
    else:
        return JsonResponse({'success': False, 'message': 'Invalid action.'}, status=400)
    deposit.save()
    return JsonResponse({'success': True, 'message': f'Deposit {action}d.'})


def _serialize_deposit(d):
    return {
        'id': d.id,
        'username': d.user.username if d.user else 'N/A',
        'email': d.user.email if d.user else '',
        'amount': str(d.amount),
        'paymentMethod': d.payment_method,
        'trxId': d.trx_id,
        'senderAccount': d.sender_account,
        'screenshot': d.screenshot,
        'status': d.status,
        'hasScreenshot': bool(d.screenshot),
        'createdAt': d.created_at.strftime('%Y-%m-%d %H:%M'),
    }


# ── REWARDS ────────────────────────────────────

@require_http_methods(["GET"])
@admin_required
def admin_rewards_view(request):
    rows = Reward.objects.all().order_by('id')
    return JsonResponse([
        {'id': r.id, 'team': r.team, 'rank': r.rank, 'reward': r.reward, 'status': r.status}
        for r in rows
    ], safe=False)


# ── USER MANAGEMENT ────────────────────────────

@require_http_methods(["GET"])
@admin_required
def admin_users_view(request):
    users = User.objects.all().order_by('-id')
    result = []
    for u in users:
        try:
            role = u.userprofile.role
        except UserProfile.DoesNotExist:
            role = 'user'
        result.append({
            'id': u.id,
            'username': u.username,
            'email': u.email,
            'role': role,
            'dateJoined': u.date_joined.strftime('%Y-%m-%d %H:%M:%S'),
            'isActive': u.is_active,
        })
    return JsonResponse(result, safe=False)


@csrf_exempt
@require_http_methods(["PUT"])
@admin_required
def admin_user_update(request, pk):
    """Edit user: email, role, is_active, password reset."""
    try:
        target = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'User not found.'}, status=404)

    data, err = _parse_json_body(request)
    if err:
        return err

    if 'email' in data and data['email']:
        target.email = data['email']
    if 'isActive' in data:
        target.is_active = bool(data['isActive'])
    if 'password' in data and data['password']:
        target.set_password(data['password'])
    target.save()

    # Update role in UserProfile
    if 'role' in data:
        profile, _ = UserProfile.objects.get_or_create(user=target, defaults={'role': 'user'})
        profile.role = data['role']
        profile.save()

    return JsonResponse({'success': True, 'message': 'User updated.'})


@csrf_exempt
@require_http_methods(["DELETE"])
@admin_required
def admin_user_delete(request, pk):
    """Delete a user and all related data."""
    try:
        target = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'User not found.'}, status=404)

    # Prevent self-deletion
    if target.id == request.auth_user.id:
        return JsonResponse({'success': False, 'message': 'Cannot delete yourself.'}, status=400)

    target.delete()
    return JsonResponse({'success': True, 'message': 'User deleted.'})


# ── DEPOSIT DELETE ─────────────────────────────

@csrf_exempt
@require_http_methods(["DELETE"])
@admin_required
def admin_deposit_delete(request, pk):
    try:
        Deposit.objects.get(pk=pk).delete()
    except Deposit.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Not found.'}, status=404)
    return JsonResponse({'success': True, 'message': 'Deposit deleted.'})


# ── WITHDRAWAL DELETE ──────────────────────────

@csrf_exempt
@require_http_methods(["DELETE"])
@admin_required
def admin_withdrawal_delete(request, pk):
    try:
        Withdrawal.objects.get(pk=pk).delete()
    except Withdrawal.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Not found.'}, status=404)
    return JsonResponse({'success': True, 'message': 'Withdrawal deleted.'})


# ── PIN CREATE / DELETE ────────────────────────

@csrf_exempt
@require_http_methods(["POST"])
@admin_required
def admin_pin_create(request):
    """Generate N pin codes, optionally assigned to a user."""
    data, err = _parse_json_body(request)
    if err:
        return err
    count = int(data.get('count', 1))
    count = min(max(count, 1), 100)  # clamp 1-100
    assign_to_username = data.get('assignTo', '').strip()

    assigned_user = None
    if assign_to_username:
        try:
            assigned_user = User.objects.get(username=assign_to_username)
        except User.DoesNotExist:
            try:
                assigned_user = User.objects.get(email=assign_to_username)
            except User.DoesNotExist:
                return JsonResponse({'success': False, 'message': f'User "{assign_to_username}" not found.'}, status=400)

    pins = []
    for _ in range(count):
        code = f'PIN-{uuid.uuid4().hex[:8].upper()}'
        p = PinCode.objects.create(code=code, status='Available', assigned_to=assigned_user)
        pins.append({'id': p.id, 'code': p.code})

    msg = f'{count} pin(s) created'
    if assigned_user:
        msg += f' and assigned to {assigned_user.username}'
    return JsonResponse({'success': True, 'message': msg + '.', 'pins': pins})


@csrf_exempt
@require_http_methods(["DELETE"])
@admin_required
def admin_pin_delete(request, pk):
    try:
        PinCode.objects.get(pk=pk).delete()
    except PinCode.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Not found.'}, status=404)
    return JsonResponse({'success': True, 'message': 'Pin deleted.'})


# ── REWARD CRUD ────────────────────────────────

@csrf_exempt
@require_http_methods(["POST"])
@admin_required
def admin_reward_create(request):
    data, err = _parse_json_body(request)
    if err:
        return err
    r = Reward.objects.create(
        team=data.get('team', ''),
        rank=data.get('rank', ''),
        reward=data.get('reward', ''),
        status=data.get('status', 'Non-active'),
    )
    return JsonResponse({'success': True, 'message': 'Reward created.', 'id': r.id})


@csrf_exempt
@require_http_methods(["PUT"])
@admin_required
def admin_reward_update(request, pk):
    try:
        r = Reward.objects.get(pk=pk)
    except Reward.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Not found.'}, status=404)
    data, err = _parse_json_body(request)
    if err:
        return err
    if 'team' in data: r.team = data['team']
    if 'rank' in data: r.rank = data['rank']
    if 'reward' in data: r.reward = data['reward']
    if 'status' in data: r.status = data['status']
    r.save()
    return JsonResponse({'success': True, 'message': 'Reward updated.'})


@csrf_exempt
@require_http_methods(["DELETE"])
@admin_required
def admin_reward_delete(request, pk):
    try:
        Reward.objects.get(pk=pk).delete()
    except Reward.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Not found.'}, status=404)
    return JsonResponse({'success': True, 'message': 'Reward deleted.'})

