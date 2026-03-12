import jwt
import datetime
from functools import wraps
from django.http import JsonResponse
from django.conf import settings
from django.contrib.auth.models import User


def generate_token(user):
    """Generate a JWT token for the given user."""
    from .models import UserProfile
    try:
        profile = user.userprofile
        role = profile.role
    except UserProfile.DoesNotExist:
        role = 'user'

    payload = {
        'user_id': user.id,
        'username': user.username,
        'role': role,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24),
        'iat': datetime.datetime.utcnow(),
    }
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
    return token


def verify_token(token):
    """Verify and decode a JWT token. Returns payload or None."""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


def get_user_from_request(request):
    """Extract and verify the JWT token from the Authorization header."""
    auth_header = request.META.get('HTTP_AUTHORIZATION', '')
    if not auth_header.startswith('Bearer '):
        return None, None

    token = auth_header[7:]  # Strip "Bearer "
    payload = verify_token(token)
    if payload is None:
        return None, None

    try:
        user = User.objects.get(id=payload['user_id'])
        return user, payload
    except User.DoesNotExist:
        return None, None


def login_required(view_func):
    """Decorator: rejects request with 401 if no valid JWT token."""
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        user, payload = get_user_from_request(request)
        if user is None:
            return JsonResponse(
                {'success': False, 'message': 'Authentication required.'},
                status=401
            )
        request.auth_user = user
        request.auth_payload = payload
        return view_func(request, *args, **kwargs)
    return wrapper


def admin_required(view_func):
    """Decorator: rejects request with 403 if user is not an admin.
    Re-checks role from DB on every request (JWT payload may be stale)."""
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        from .models import UserProfile
        user, payload = get_user_from_request(request)
        if user is None:
            return JsonResponse(
                {'success': False, 'message': 'Authentication required.'},
                status=401
            )
        # Verify role from DB, not JWT payload (prevents stale tokens)
        try:
            db_role = user.userprofile.role
        except UserProfile.DoesNotExist:
            db_role = 'user'
        if db_role != 'admin':
            return JsonResponse(
                {'success': False, 'message': 'Admin access required.'},
                status=403
            )
        request.auth_user = user
        request.auth_payload = payload
        return view_func(request, *args, **kwargs)
    return wrapper
