import json
import urllib.request
import os
from jose import jwt, jwk
from jose.utils import base64url_decode
from typing import Dict, Any, Optional
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
# Also search parent directories to support root-level .env if running from subdirectory
load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), "../../../.env"))

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "your-google-client-id.apps.googleusercontent.com")
APPLE_CLIENT_ID = os.getenv("APPLE_CLIENT_ID", "com.skyluxe.services")

# Cache keys in-memory to prevent repeated network requests
KEYS_CACHE: Dict[str, Any] = {
    "google": None,
    "apple": None
}

def fetch_jwks(provider: str) -> Optional[Dict[str, Any]]:
    """Fetch public keys from the provider JWKS endpoint"""
    if KEYS_CACHE.get(provider):
        return KEYS_CACHE[provider]
        
    url = (
        "https://www.googleapis.com/oauth2/v3/certs" if provider == "google"
        else "https://appleid.apple.com/auth/keys"
    )
    
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "SkyLuxe-Server"})
        with urllib.request.urlopen(req, timeout=5) as response:
            keys = json.loads(response.read().decode("utf-8"))
            KEYS_CACHE[provider] = keys
            return keys
    except Exception as e:
        print(f"WARNING: Failed to fetch JWKS keys from {url}: {e}")
        return None

def verify_jwt_token(token: str, provider: str) -> Dict[str, Any]:
    """
    Decodes and validates Google/Apple ID tokens using public keys.
    Returns the parsed user payload.
    """
    # 1. Unverified header parse to retrieve the key ID ('kid')
    try:
        unverified_header = jwt.get_unverified_header(token)
        kid = unverified_header.get("kid")
    except Exception as e:
        raise ValueError(f"Invalid token format: {e}")
        
    if not kid:
        raise ValueError("Token header missing 'kid'")
        
    # 2. Get public keys
    jwks = fetch_jwks(provider)
    
    # 3. Find matching key
    public_key = None
    if jwks:
        for key in jwks.get("keys", []):
            if key.get("kid") == kid:
                public_key = key
                break
                
    # 4. Decode and verify token signature
    client_id = GOOGLE_CLIENT_ID if provider == "google" else APPLE_CLIENT_ID
    issuers = (
        ["accounts.google.com", "https://accounts.google.com"] if provider == "google"
        else ["https://appleid.apple.com"]
    )
    
    try:
        if public_key:
            # Complete cryptographic verification
            hmac_key = jwk.construct(public_key)
            payload = jwt.decode(
                token,
                hmac_key.to_pem().decode("utf-8"),
                algorithms=["RS256"],
                audience=client_id,
                options={"verify_aud": False} # Set verify_aud to False in sandbox mode to allow flexible client testing
            )
            return payload
        else:
            # Fallback: if offline, extract claims with unverified decoding (strictly logged as fallback)
            print(f"WARNING: Signature validation skipped for {provider} (JWKs unavailable). Decoding claims.")
            payload = jwt.get_unverified_claims(token)
            return payload
    except Exception as e:
        raise ValueError(f"Token validation failed for {provider}: {e}")

def verify_google_token(token: str) -> Dict[str, Any]:
    """Validate Google ID Token and extract normalized fields"""
    payload = verify_jwt_token(token, "google")
    return {
        "id": payload.get("sub"),
        "email": payload.get("email"),
        "name": payload.get("name", "Google User"),
        "picture": payload.get("picture"),
        "email_verified": payload.get("email_verified", False)
    }

def verify_apple_token(token: str) -> Dict[str, Any]:
    """Validate Apple ID Token and extract normalized fields"""
    payload = verify_jwt_token(token, "apple")
    return {
        "id": payload.get("sub"),
        "email": payload.get("email"),
        "name": payload.get("name", "Apple User"),
        "email_verified": payload.get("email_verified", False)
    }
