#!/bin/sh

if [ "$NODE_ENV" = "development" ]; then
    # 開發環境
    pnpm run start:dev
else
    # 測試或生產環境
    pnpm run build
    node dist/main.js &
fi
