import hashlib
import bcrypt

_BCRYPT_ROUNDS = 12

def _sha256_hexdigest_bytes(password: str) -> bytes:
    return hashlib.sha256(password.encode()).hexdigest().encode()

def hash_password(password: str) -> str:
    prehashed = _sha256_hexdigest_bytes(password)
    salt = bcrypt.gensalt(rounds=_BCRYPT_ROUNDS)
    hashed = bcrypt.hashpw(prehashed, salt)

    return hashed.decode()

def verify_password(password: str, hashed_password: str) -> bool:
    hp_bytes = hashed_password.encode()
    prehashed = _sha256_hexdigest_bytes(password)
    if bcrypt.checkpw(prehashed, hp_bytes):
        return True
    try:
        return bcrypt.checkpw(password.encode(), hp_bytes)
    
    except ValueError:
        return False

