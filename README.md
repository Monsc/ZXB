# ZXB - 社交媒体项目

## 项目简介
ZXB 是一个社交媒体平台

## 技术栈
- 前端：React + Vite + TailwindCSS
- 后端：Node.js + Express + MongoDB
- 自动化测试：Cypress

## 主要功能
- 推文流（Feed）
- 用户注册/登录/个人资料
- 评论、点赞、关注、私信
- 通知系统
- 搜索与推荐
- 多语言国际化（中英文切换）
- 骨架屏、图片懒加载、交互动画

## 快速启动
### 1. 安装依赖
```bash
cd client && npm install
cd ../server && npm install
```
### 2. 启动服务
```bash
# 启动后端
cd server && npm run dev
# 启动前端
cd client && npm run dev
```
前端默认端口：3000 或 3001，后端默认端口：5001。

## 国际化说明
- 全站支持中英文切换，所有主流程、交互、弹窗、空状态、Toast 等均已国际化。
- 语言切换入口位于全局导航栏。

## 自动化测试
- 使用 Cypress 覆盖注册、登录、发帖、评论、点赞、通知、私信、国际化切换等主流程。
- 测试脚本位于 `cypress/e2e/` 目录。

## 贡献与安全建议
- 建议所有 PR 不包含密钥、个人隐私等敏感信息。
- 推荐前后端接口鉴权、XSS/CSRF 防护、输入内容过滤、异常监控等安全措施。

## 仓库结构
```
ZXB-main/
├── client/           # 前端源码
├── server/           # 后端源码
├── src/              # 旧版或通用代码
├── cypress/          # 自动化测试
├── public/           # 静态资源
├── test-results/     # 测试结果
├── ...
```

欢迎协作，开发！
