# JoyServe 🤖

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/react-19.1.1-61DAFB.svg)
![Vite](https://img.shields.io/badge/vite-7.1.3-646CFF.svg)

**JoyServe** 是面向东南亚跨境电商卖家的 Agent-Native AI 客服 SaaS 管理平台。

区别于传统客服工具，JoyServe 以 **AI Agent** 作为核心产品形态，让卖家像培训新员工一样配置 Agent，Agent 自主处理客服工作，人工仅需在关键节点介入。

> **核心理念：** 像培训一个新员工一样配置 Agent，它上岗后自己干活，你只管看结果。

---

## 🚀 核心特性

### 1. AI Agent 客服体系

- **三层架构设计：** 路由层（意图识别） -> 子 Agent（接待/物流/退款/导购） -> Manager Agent（决策/协调/守门）。
- **Manager Agent：** 具备自主审批权限（如 $50 以内退款）、跨 Agent 协调能力以及人工接管的软着陆机制。
- **技能市场 (Skill Market)：** 像安装 App 一样按需装配技能（订单查询、物流追踪、退款处理、智能导购等）。
- **Agent 演练场：** 上线前模拟真实买家对话，支持 7 种东南亚语言环境测试。

### 2. 智能工作台

- **三栏式设计：** 专为人工客服打造的高效界面，包含会话列表、聊天窗口、以及买家画像/AI 辅助面板。
- **AI 辅助：** 自动生成回复建议、情感分析预警、实时翻译。
- **待办事项系统：** 自动聚合需人工介入的高优先级任务。

### 3. 主动营销与关怀

- **全生命周期管理：** 从下单确认、发货通知、到货提醒到售后回访的全自动时间线。
- **沉默客户唤醒：** 基于历史购买数据的个性化复购推荐。
- **物流异常干预：** 主动识别物流滞留并安抚买家，降低投诉率。

### 4. 数据驱动

- **ROI 可视化：** 清晰展示 AI 节省的人力成本与带来的 GMV 增长。
- **场景健康度：** 基于真实对话分析 AI 在不同场景下的解决率，而非简单的文档覆盖率。

---

## 🛠️ 技术栈

本项目基于现代前端技术栈构建：

- **Core:** [React 19](https://react.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Data Visualization:** [Recharts](https://recharts.org/) (用于数据大屏与图表分析)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Design System:** Custom Modern Card-Based UI

---

## 🎨 设计规范

JoyServe 遵循 **现代、极简、清晰** 的设计语言：

- **核心风格：** Modern Card-Based UI（现代卡片式设计），利用微投影构建轻微 Z 轴空间感。
- **色彩体系：**
  - **背景：** 极浅冷灰 (`#F4F5F7`) 减少视觉疲劳。
  - **强调色：** 高饱和度亮蓝 (`#2D6BFE`) 用于视觉引导与核心数据。
  - **文本：** 摒弃纯黑，使用深灰 (`#1A1F36`) 与浅灰 (`#8792A2`) 构建层级。
- **数据可视化：** 圆润柔和的图表风格，强调核心指标 (KPIs)。

---

## 📦 快速开始

### 前置要求

- Node.js (推荐 v18+)
- pnpm (推荐) 或 npm/yarn

### 安装与运行

1. **克隆仓库**

   ```bash
   git clone https://github.com/your-username/joy-serve.git
   cd joy-serve
   ```

2. **安装依赖**

   ```bash
   pnpm install
   ```

3. **启动开发服务器**

   ```bash
   pnpm dev
   ```

4. **构建生产版本**
   ```bash
   pnpm build
   ```

---

## 🗺️ 开发路线图 (Roadmap)

### P0: MVP 核心功能 (Current Focus)

- [ ] Agent 冷启动引导流程
- [ ] 基础 Skill：欢迎接待、订单查询、物流追踪
- [ ] Manager Agent 基础版（退款审批）
- [ ] 三栏式客服工作台 & AI 辅助面板

### P1: 重要功能扩展

- [ ] 完整 Skill 市场（催付、催评、评价回复）
- [ ] 智能导购 Skill & 商品数据同步
- [ ] 购后关怀全自动时间线
- [ ] 场景健康度看板

### P2: 高级能力

- [ ] 多模态图片识别（处理买家发图）
- [ ] 跨店铺 Agent 协同
- [ ] A/B 测试话术

---

## 🤝 贡献指南

欢迎参与 JoyServe 的开源建设！请遵循以下步骤：

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的修改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

---

## 📄 许可证

本项目采用 [MIT 许可证](LICENSE) 开源。

Copyright (c) 2024 JoyServe Team
