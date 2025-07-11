from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import padding
import secrets
from config import settings

def encrypt(text: str) -> str:
    iv          = secrets.token_bytes(16)
    key         = bytes.fromhex(settings.aes_256_secret)
    cipher      = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
    encryptor   = cipher.encryptor()
    padder      = padding.PKCS7(128).padder()
    padded_text = padder.update(text.encode('UTF-8')) + padder.finalize()
    encrypted   = encryptor.update(padded_text) + encryptor.finalize()
    return iv.hex() + ":" + encrypted.hex()

def decrypt(encrypted_text: str) -> str:
    text_parts = encrypted_text.split(":")
    
    if len(text_parts) != 2:
        raise ValueError("Invalid encrypted text format")
    
    iv             = bytes.fromhex(text_parts[0])
    encrypted_data = bytes.fromhex(text_parts[1])
    key            = bytes.fromhex(settings.aes_256_secret)
    cipher         = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
    decryptor      = cipher.decryptor()
    decrypted      = decryptor.update(encrypted_data) + decryptor.finalize()
    unpadder       = padding.PKCS7(128).unpadder()
    decrypted      = unpadder.update(decrypted) + unpadder.finalize()
    return decrypted.decode('UTF-8')