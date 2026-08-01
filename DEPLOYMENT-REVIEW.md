# Mind Flow 灵感流 - 部署复盘文档

## 📅 部署日期：2026-07-31

## 🎯 项目信息

- **项目名称**: Mind Flow 灵感流
- **仓库地址**: https://github.com/Yuuu-design/mind-web
- **服务器**: 阿里云轻量应用服务器 (Tencent Cloud)
- **服务器 IP**: 118.31.36.240
- **访问地址**: http://118.31.36.240
- **技术栈**: React + Vite + Tailwind CSS + Docker + Nginx

---

## 🚀 部署流程

### 1. 本地开发
- 使用 React + Vite + Tailwind CSS 开发前端应用
- 数据存储在 localStorage
- 7 个核心页面：灵感输入、紧急待办、不紧急待办、首页日历、灵感页面、待办页面、设置页面

### 2. Docker 化
创建 `Dockerfile`:
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
```

创建 `nginx.conf`:
```nginx
server {
    listen 8080;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### 3. 自动部署配置 (GitHub Actions)
创建 `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Server
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          password: ${{ secrets.SERVER_PASSWORD }}
          port: ${{ secrets.SERVER_PORT }}
          script: |
            cd /root/mind-web
            git pull origin main
            docker build --no-cache -t mind-web .
            docker stop mind-web && docker rm mind-web
            docker run -d --name mind-web -p 8080:8080 mind-web
```

### 4. GitHub Secrets 配置
在 GitHub 仓库 Settings → Secrets and variables → Actions 添加：
- `SERVER_HOST`: 118.31.36.240
- `SERVER_USER`: root
- `SERVER_PASSWORD`: Nbt12345
- `SERVER_PORT`: 22

---

## 🔧 踩坑记录

### 问题1：Docker 构建失败 - Permission denied
**现象**: `sh: vite: Permission denied`

**原因**: npm 安装后，可执行文件没有执行权限

**解决方案**:
```dockerfile
# 方案1：加 chmod
RUN npm install && chmod +x node_modules/.bin/*

# 方案2：直接用 npx
RUN npx vite build
```

---

### 问题2：Nginx 启动失败 - nginx.conf 丢失
**现象**: `nginx: [emerg] open() "/etc/nginx/nginx.conf" failed`

**原因**: Dockerfile 里删除了 nginx.conf

**解决方案**: 不删除 nginx.conf，只覆盖 default.conf

---

### 问题3：端口映射不匹配
**现象**: 容器运行正常，但外部无法访问

**原因**: Docker 端口映射配置错误

**解决方案**:
```bash
docker run -d --name mind-web -p 主机端口:容器端口 mind-web
```

---

### 问题4：阿里云安全组未开放端口
**现象**: 本地 `curl localhost:端口` 正常，外部访问返回 502

**原因**: 阿里云安全组阻止了外部访问

**解决方案**: 
- 阿里云控制台 → 轻量应用服务器 → 防火墙 → 添加端口规则
- 或服务器上运行：
```bash
iptables -I INPUT -p tcp --dport 端口 -j ACCEPT
service iptables save
```

---

### 问题5：Docker 缓存导致构建结果不更新
**现象**: 代码更新了但构建结果没变

**解决方案**:
```bash
docker build --no-cache -t 镜像名 .
```

---

## ✅ 部署检查清单

| 检查项 | 命令 |
|--------|------|
| Docker 是否运行 | `docker ps` |
| 容器日志 | `docker logs mind-web` |
| 端口映射 | `docker port mind-web` |
| 本地访问 | `curl http://localhost:8080` |
| 防火墙规则 | `iptables -L -n \| grep 8080` |
| 外部访问 | `curl http://IP:8080` |

---

## 📝 常用命令

```bash
# 查看容器状态
docker ps

# 查看日志
docker logs mind-web

# 停止容器
docker stop mind-web

# 删除容器
docker rm mind-web

# 重新构建并运行
cd /root/mind-web
docker build --no-cache -t mind-web .
docker run -d --name mind-web -p 8080:8080 --restart unless-stopped mind-web

# 进入容器
docker exec -it mind-web sh

# 查看容器内文件
docker exec mind-web ls -la /usr/share/nginx/html/
```

---

## 🔄 自动部署流程

```
你推送代码到 GitHub
       ↓
GitHub 触发 Webhook
       ↓
GitHub Actions 运行
       ↓
SSH 连接到服务器
       ↓
拉取最新代码 → 构建镜像 → 重启容器
       ↓
部署成功 ✅
```

---

## 💡 经验总结

1. **Docker 权限问题**: 构建后加 `chmod +x` 或用 `npx` 直接运行
2. **Nginx 配置**: 不要删除主配置文件，只覆盖 default.conf
3. **阿里云安全组**: 部署后记得开放端口
4. **Docker 缓存**: 代码更新后使用 `--no-cache` 重新构建
5. **GitHub Actions**: 配置 Secrets 后 push 即自动部署

---

## 🔗 相关链接

- GitHub 仓库: https://github.com/Yuuu-design/mind-web
- 访问地址: http://118.31.36.240
- GitHub Actions: https://github.com/Yuuu-design/mind-web/actions
