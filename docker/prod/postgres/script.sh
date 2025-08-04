#!/bin/bash

# Generate the private key
openssl genrsa -out server.key 2048

# Secure the private key
chmod 600 server.key

# Create a certificate signing request (CSR) using the config file
openssl req -new -key server.key -out server.csr -config openssl.cnf

# Generate a self-signed certificate with the extensions from the config
openssl x509 -req -in server.csr -signkey server.key -out server.crt -days 365 \
    -extfile openssl.cnf -extensions v3_req

# Optionally, create a CA (if you want to verify client certificates)
openssl req -new -x509 -key server.key -out ca.crt -days 365 -config openssl.cnf

# Copy the certificate to the vault directory
rm -f ../vault/server.crt
cp server.crt ../vault/server.crt