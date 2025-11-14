# clinic-system-h5

基于 Vue 3 + Vite 构建的医疗陪诊 H5 移动端应用，提供用户预约、订单管理、陪护师服务等核心功能，适配多端设备。


## 项目介绍

`clinic-system-h5` 是医疗陪诊场景下的移动端用户端应用，专注于为患者提供**在线预约陪诊服务、订单跟踪、服务评价**等功能，与后台管理系统（[clinic-system-admin](https://github.com/Rainseason-hash/clinic-system-admin)）配合，形成“用户预约-平台管理-服务交付”的完整业务闭环。


## 技术栈

| 类别         | 技术/工具                          |
|--------------|------------------------------------|
| 核心框架     | Vue 3（Composition API + `<script setup>`） |
| 构建工具     | Vite                               |
| 路由管理     | Vue Router                         |
| UI 组件库    | Vant（移动端组件库）               |
| 状态管理     | Pinia                              |
| HTTP 客户端  | Axios（封装于 `src/utils/request.js`） |
| 样式处理     | Less                               |
| 日期处理     | dayjs                              |
| 代码规范     | ESLint + Prettier                  |


## 快速开始

### 环境要求

- Node.js ≥ 14.18.0
- npm / yarn / pnpm（推荐 pnpm 提升安装速度）


### 安装依赖

```bash
# 使用 npm
npm install


# 或使用 pnpm
pnpm install
