# Joy Service Web Design Guidelines (v3.0 - Clean & Airy / Tesla Inspired)

本指南基于 **Tesla Dashboard** 极简风格进行深度定制。核心理念转向**极度干净、通透、高亮（High-Key）**的视觉体验。去除多余的分割线和重色块，利用**大圆角、柔和投影、高饱和度蓝色**来构建层级。

## 核心设计理念

**“Airy & Electric（轻盈与电光）”**

- **Airy（轻盈）：** 全局采用高明度的白与浅灰，侧边栏回归纯白，界面如同漂浮在云端。
- **Electric（电光）：** 关键数据和交互点使用高饱和度的电光蓝，在纯净背景上产生强烈的视觉冲击。

## 1. 布局与结构 (Layout & Structure)

### 侧边栏 (Sidebar)

- **背景：** **纯白 (`#FFFFFF`)**，宽度 **280px**，右侧无实体边框，改用极淡的阴影或透明边框。
- **导航项 (Nav Items)：**
  - **高度：** `52px`。
  - **形状：** **胶囊形 (Pill Shape, Radius 26px)**。
  - **选中态：** **浅蓝色背景 (`#E6F0FF`)** + **电光蓝文字 (`#2D6BFE`)** + **加粗文字/图标**。
  - **未选中态：** 灰色文字 (`#6B7280`)，悬停时背景轻微变灰。
- **Logo：** 左上角，高度 `88px` 区域内垂直居中，字号 `20px+`，加粗品牌名。
- **用户信息：** 底部固定区域，包含头像、姓名、邮箱，带有淡边框或阴影的独立卡片样式。

### 主内容区 (Main Content)

- **背景：** **极浅灰 (`#F4F5F7`)**，为白色卡片提供承载底色。
- **顶部导航 (Header)：**
  - **大标题：** 左上角显示当前页面标题（如 "仪表盘"），字号 `28px`，字重 `800` (ExtraBold)，颜色 `#1A1F36`。
  - **副标题：** 标题下方显示描述性文字，字号 `15px`，颜色 `#6B7280`。
  - **筛选器 (Filters)：** 位于标题右侧。
    - **样式：** 纯白背景，圆角 `12px`，带淡边框和阴影，文字加粗。
- **栅格系统：** 卡片间距 `20px` - `24px`。

## 2. 卡片设计 (Card Design)

### 风格特征

- **大圆角 (Large Radius)：** 统一使用 **`20px` - `24px`** 的圆角。
- **无边框 (No Border)：** 尽量去除描边，或使用极淡的 `#E5E7EB`。
- **投影 (Soft Shadow)：** `box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);`。
- **内边距 (Padding)：** `24px` - `32px`，保持内部呼吸感。
- **交互：** 悬停时轻微上浮 (`translateY(-2px)`)。

## 3. 色彩体系 (Color System)

### A. 主色：电光蓝 (Electric Blue)

- **Primary:** `#2D6BFE` (品牌色，用于按钮、图标背景、关键数据)。
- **Secondary:** `#5B8EFF` (用于图表次级数据)。
- **Background:** `#E6F0FF` (极浅蓝，用于选中态、图表背景)。
- **Dim:** `#A6C1FF` (淡化的品牌色，用于对比图表)。

### B. 文本色 (Typography Colors)

- **Primary Text:** `#1A1F36` (深蓝黑，用于标题、KPI 数字)。
- **Secondary Text:** `#6B7280` (中灰，用于副标题、标签)。
- **Tertiary Text:** `#9CA3AF` (浅灰，用于辅助说明、图标)。

### C. 数据色 (Data Colors)

- **Success:** `#10B981` (文字/图标) / `#E6F8F2` (背景)。
- **Warning:** `#F59E0B` (文字/图标) / `#FFF8E1` (背景)。
- **Error:** `#EF4444` (文字/图标) / `#FEF2F2` (背景)。

## 4. 数据可视化 (Data Visualization)

### 关键指标 (KPI Cards)

- **布局：**
  - 顶部：左侧 Label (14px Bold Secondary)，右侧 Icon (20px Tertiary) in Box (bgSub)。
  - 底部：左侧 Value (36px ExtraBold Primary)，右侧 Trend Pill。
- **趋势标签：** 胶囊形 (`Radius 99px`)，背景色为浅红/浅绿，文字加粗。

### 图表风格 (Chart Style)

- **柱状图 (Bar Chart)：**
  - **圆角：** 柱子顶部 **全圆角 (Radius 10px)**。
  - **宽度：** `20px` - `24px`。
  - **颜色：** AI处理使用 Primary Blue，人工处理使用 Brand Dim。
  - **坐标轴：** 隐藏轴线，仅保留刻度文字 (Secondary Color)。

### 排行榜 (Leaderboard)

- **列表项：**
  - 左侧：排名 (前三名高亮) + 头像 (bgSub + Brand Letter)。
  - 中间：姓名 + 胜率/分数。
  - 底部：进度条 (Height 8px, Radius 4px)。

## 5. 组件细节 (Component Details)

### 按钮 (Buttons)

- **主按钮：** 电光蓝背景，白色文字，圆角 `14px`，带蓝色投影。
- **次级按钮：** 浅灰背景或纯白背景，深灰文字。
- **胶囊按钮：** 用于 Filter 或 Tab，完全圆角。

### 输入框 (Inputs)

- **AI 提问框：**
  - 背景：半透明白色 (`rgba(255,255,255,0.8)`)。
  - 边框：`1px solid #E5E7EB`。
  - 圆角：`14px`。
  - 阴影：`s0`。

## 总结

v3.0 (Tesla Inspired) 风格关键词：**Pill-Shape (胶囊形)、ExtraBold (超粗字体)、Pure White (纯白)、Soft Blue (柔和蓝)**。
界面通过大量的留白和大圆角元素，营造出一种未来感和科技感，同时保持了极高的可读性。
