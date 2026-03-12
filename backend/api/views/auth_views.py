# ═══════════════════════════════════════════════
#  AUTH VIEWS — Login, Logout, Me, Change Password
# ═══════════════════════════════════════════════

import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.contrib.auth import authenticate
from api.models import UserProfile
from api.auth import generate_token, login_required


def _parse_json_body(request):
    """Safely parse JSON from the request body. Returns (data, error_response)."""
    try:
        return json.loads(request.body), None
    except (json.JSONDecodeError, ValueError):
        return None, JsonResponse(
            {'success': False, 'message': 'Invalid or missing JSON body.'},
            status=400
        )


@csrf_exempt
@require_http_methods(["POST"])
def login_view(request):
    """Authenticate user and return JWT token."""
    data, err = _parse_json_body(request)
    if err:
        return err

    username = data.get('username', '')
    password = data.get('password', '')

    user = authenticate(username=username, password=password)
    if user is not None:
        token = generate_token(user)
        try:
            role = user.userprofile.role
        except UserProfile.DoesNotExist:
            role = 'user'

        route = '/dashboard/admin/overview' if role == 'admin' else '/dashboard'

        return JsonResponse({
            'success': True,
            'token': token,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': role,
            },
            'route': route,
        })
    else:
        return JsonResponse({
            'success': False,
            'message': 'Access Denied. Please check your credentials.'
        }, status=401)


@csrf_exempt
@require_http_methods(["POST"])
@login_required
def logout_view(request):
    """Logout the current user (client-side token removal)."""
    return JsonResponse({'success': True, 'message': 'Logged out successfully.'})


@require_http_methods(["GET"])
@login_required
def me_view(request):
    """Return current authenticated user info."""
    user = request.auth_user
    try:
        role = user.userprofile.role
    except UserProfile.DoesNotExist:
        role = 'user'

    return JsonResponse({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'role': role,
    })


@csrf_exempt
@require_http_methods(["POST"])
@login_required
def change_password_view(request):
    """Change the authenticated user's password."""
    data, err = _parse_json_body(request)
    if err:
        return err

    current_password = data.get('currentPassword', '')
    new_password = data.get('newPassword', '')
    confirm_password = data.get('confirmPassword', '')

    user = request.auth_user

    if not user.check_password(current_password):
        return JsonResponse({
            'success': False,
            'message': 'Current password is incorrect.'
        }, status=400)

    if new_password != confirm_password:
        return JsonResponse({
            'success': False,
            'message': 'New passwords do not match.'
        }, status=400)

    if len(new_password) < 8:
        return JsonResponse({
            'success': False,
            'message': 'New password must be at least 8 characters long.'
        }, status=400)

    user.set_password(new_password)
    user.save()

    new_token = generate_token(user)

    return JsonResponse({
        'success': True,
        'message': 'Password changed successfully.',
        'token': new_token,
    })
