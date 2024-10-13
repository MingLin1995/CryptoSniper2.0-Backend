#!/bin/bash

# 設置變量
COMPOSE_FILE="docker-compose.yml"
ENV_FILE=".env.test"
PROJECT_NAME="cryptosniper-test"
CONTAINER_NAME="cryptosniper20-backend-test"

# 檢查並停止現有的容器（如果存在）
if docker ps -q -f name=$CONTAINER_NAME | grep -q .; then
    echo "Stopping existing container..."
    docker-compose -f $COMPOSE_FILE --env-file $ENV_FILE --project-name $PROJECT_NAME down
else
    echo "No existing container found."
fi

# 嘗試移除容器（即使它不存在）
docker rm -f $CONTAINER_NAME 2>/dev/null || true

# 清理未使用的 Docker 資源
echo "Cleaning up Docker resources..."
docker system prune -f

# 構建並啟動測試容器
echo "Building and starting test container..."
docker-compose -f $COMPOSE_FILE --env-file $ENV_FILE --project-name $PROJECT_NAME up --build -d

# 等待容器啟動
echo "Waiting for container to start..."
sleep 10

# 檢查容器狀態
echo "Checking container status..."
docker ps -a | grep $CONTAINER_NAME

# 檢查容器日誌
echo "Checking container logs..."
docker logs $CONTAINER_NAME

# 檢查容器文件系統
echo "Checking container filesystem..."
docker exec $CONTAINER_NAME ls -la /usr/src/app
docker exec $CONTAINER_NAME ls -la /usr/src/app/dist

# 在容器內執行構建
echo "Building the application inside the container..."
docker exec $CONTAINER_NAME pnpm run build

# 再次檢查 dist 目錄
echo "Checking dist directory after build..."
docker exec $CONTAINER_NAME ls -la /usr/src/app/dist

# 嘗試手動運行應用
echo "Attempting to run the application manually..."
docker exec $CONTAINER_NAME node dist/main.js

# 顯示容器日誌
echo "Displaying container logs..."
docker-compose -f $COMPOSE_FILE --env-file $ENV_FILE --project-name $PROJECT_NAME logs -f
