#!/bin/bash
set -euo pipefail

APP_DIR="/home/claude/usholding-site"
cd "$APP_DIR"

echo "=== Pulling latest changes ==="
git pull origin rebuild

echo "=== Installing dependencies ==="
npm ci --legacy-peer-deps

echo "=== Building Next.js ==="
npm run build

echo "=== Restarting PM2 ==="
pm2 restart ecosystem.config.cjs --update-env || pm2 start ecosystem.config.cjs

echo "=== Done ==="
pm2 status
