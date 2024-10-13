# 使用 Node.js 18 的 Alpine 版本作為基礎映像
FROM node:18-alpine

# 設置工作目錄
WORKDIR /usr/src/app

# 安裝 pnpm
RUN npm install -g pnpm

# 複製 package.json 和 pnpm-lock.yaml到工作目錄
COPY package*.json pnpm-lock.yaml* ./

# 使用 pnpm 安裝依賴
RUN pnpm install

# 複製所有內容到工作目錄
COPY . .

# 對應 3000 port （main.ts）
EXPOSE 3000

# 定義參數 NODE_ENV，默認值為 development
ARG NODE_ENV=development
# 將 ARG 的值設置為環境變量
ENV NODE_ENV=${NODE_ENV}

# 如果 NODE_ENV 是 production，則先構建項目然後運行生產版本
# 否則運行開發版本
CMD if [ "$NODE_ENV" = "production" ] ; then pnpm run build && pnpm run start:prod ; else pnpm run start:dev ; fi