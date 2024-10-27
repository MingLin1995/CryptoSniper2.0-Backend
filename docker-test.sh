#!/bin/bash

# 設置變量
COMPOSE_FILE="docker-compose.yml"
ENV_FILE=".env.test"
PROJECT_NAME="cryptosniper-test"
CONTAINER_NAME="cryptosniper2.0-backend-test"

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
