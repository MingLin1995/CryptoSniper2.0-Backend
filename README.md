# CryptoSniper2.0 Backend

CryptoSniper2.0 後端，使用 NestJS 框架開發

## 環境需求

- Node.js 18
- pnpm
- Docker 和 Docker Compose

## 環境變量設定

使用 .env 文件來管理不同環境的配置

1. `.env.dev` - 開發環境配置
2. `.env.test` - 測試環境配置
3. `.env.prod` - 生產環境配置

## 開發環境

啟動開發環境

```
pnpm run dev
```

## 測試環境

啟動測試環境

```
pnpm run docker:test
```

## 生產環境

啟動生產環境

```
pnpm run master
```

## 單元測試

啟動單元測試

```
pnpm run test
```

## GitHub Actions CI/CD 設定

### 設置步驟

1. 在 GitHub 存儲庫中，進入 "Settings" > "Secrets and variables" > "Actions"

2. 增加以下 secrets

   - `EC2_SSH_PRIVATE_KEY`:

     ```
     -----BEGIN RSA PRIVATE KEY-----
     MIIEpAIBAAKCAQEAn4XOc6lV/PxnyhbkZJKRoWbM7O4UE3Wj+Uf5cVhNTbKZuOc4
     ...（中間內容省略）...
     NQ7n6KWpV5e4Yt9msN9s6/TJsaving6igyMQrwqRx2A8Yq5Q==
     -----END RSA PRIVATE KEY-----
     ```

   - `EC2_HOST`: `ec2-xx-xx-xx-xx.compute-1.amazonaws.com`

   - `ENV_DEV`
   - `ENV_TEST`
   - `ENV_PROD`
