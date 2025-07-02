package utils

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"encoding/hex"
	"errors"
	"fmt"
	"io"
	"strings"
)

func AesGenerateKey() ([]byte, string, error) {
	key := make([]byte, 32)
	_, err := rand.Read(key)

	if err != nil {
		return nil, "", fmt.Errorf("failed to generate random key: %v", err)
	}

	hexKey := hex.EncodeToString(key)
	return key, hexKey, nil
}

func AesGenerateNonce() ([]byte, string, error) {
	nonce := make([]byte, 12)
	if _, err := io.ReadFull(rand.Reader, nonce); err != nil {
		return nil, "", err
	}
	return nonce, fmt.Sprintf("%x", nonce), nil
}

func AesEncrypt(key string, text string) (string, error) {
	hexKey, err := hex.DecodeString(key)

	if err != nil {
		return "", err
	}

	block, err := aes.NewCipher(hexKey)

	if err != nil {
		return "", err
	}

	hexNonce, _, err := AesGenerateNonce()

	if err != nil {
		return "", err
	}

	aesgcm, err := cipher.NewGCM(block)
	if err != nil {
		return "", err
	}

	cipherText := aesgcm.Seal(nil, hexNonce, []byte(text), nil)
	return fmt.Sprintf("%x:%x", cipherText, hexNonce), nil

}

func AesDecrypt(key string, cipherHexStr string) (string, error) {
	splitText := strings.Split(cipherHexStr, ":")

	fmt.Println(splitText)

	if len(splitText) != 2 {
		return "", errors.New("encrypted string is not properly formatted")
	}

	hexKey, err := hex.DecodeString(key)

	if err != nil {
		return "", err
	}

	nonce := splitText[1]
	hexNonce, err := hex.DecodeString(nonce)

	if err != nil {
		return "", err
	}

	block, err := aes.NewCipher(hexKey)
	if err != nil {
		return "", err
	}

	aesgcm, err := cipher.NewGCM(block)
	if err != nil {
		return "", err
	}

	cipherText, err := hex.DecodeString(splitText[0])
	if err != nil {
		return "", err
	}

	plainText, err := aesgcm.Open(nil, hexNonce, cipherText, nil)
	if err != nil {
		return "", err
	}

	return string(plainText), nil
}
