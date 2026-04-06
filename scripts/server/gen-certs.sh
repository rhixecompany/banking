#!/bin/bash
# gen-certs.sh - Generate self-signed TLS certificates for Traefik

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CERT_DIR="$SCRIPT_DIR/../compose/production/traefik/certs"

mkdir -p "$CERT_DIR"

echo "Generating CA..."
openssl genrsa -out "$CERT_DIR/ca.key" 2048 2>/dev/null
openssl req -new -x509 -days 365 -key "$CERT_DIR/ca.key" -out "$CERT_DIR/ca.crt" \
    -subj "/CN=Banking CA" 2>/dev/null

echo "Generating server key..."
openssl genrsa -out "$CERT_DIR/server.key" 2048 2>/dev/null

echo "Generating server certificate..."
openssl req -new -key "$CERT_DIR/server.key" -out "$CERT_DIR/server.csr" \
    -subj "/CN=banking.example.com" 2>/dev/null
openssl x509 -req -days 365 -in "$CERT_DIR/server.csr" -CA "$CERT_DIR/ca.crt" \
    -CAkey "$CERT_DIR/ca.key" -CAcreateserial -out "$CERT_DIR/server.crt" 2>/dev/null

rm -f "$CERT_DIR/server.csr" "$CERT_DIR/ca.key" "$CERT_DIR/ca.srl"

echo "Certificates generated in $CERT_DIR:"
ls -la "$CERT_DIR/"
