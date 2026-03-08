# Service 模块与 Mock API 实践规范

本文档沉淀 Marketing 模块的实现方式，用于复用到其他业务模块（如 Knowledge、System、Analytics）。

## 1. 目标

- 页面层不直接管理复杂业务数据变更
- 统一通过 service 层提供异步 API
- mock 数据可模拟真实后端行为（延迟、增删改、聚合字段）
- 单元测试可直接覆盖 service 与页面交互

## 2. 推荐目录结构

```text
src/
├── components/pages/
│   ├── XxxModule.jsx
│   └── XxxModule.test.jsx
├── services/
│   ├── xxxMockApi.js
│   └── xxxMockApi.test.js
└── test/
    └── setup.js
```

## 3. Service 设计约定

以 `src/services/marketingMockApi.js` 为标准：

1. 数据源与内存态分离

- `XXX_MOCK_DB`：模块初始数据（只作为模板）
- `memoryDB`：运行时可变数据（模拟后端状态）

1. 所有返回值深拷贝

- 使用 `structuredClone`，避免页面误改 service 内存态

1. 统一异步行为

- `wait(ms)` 模拟网络延迟
- 所有 API 均返回 `Promise`

1. 聚合字段统一计算

- 例如 `summary` 内统计值通过 `nextSummary()` 派生，不在页面层拼装

1. 提供重置方法用于测试

- `resetXxxMockDB()` 每个测试前恢复初始状态

## 4. Marketing API 清单（可复用命名风格）

```js
fetchMarketingDashboard()        // 查询看板
toggleTouchRule(ruleId, enabled) // 更新布尔状态
createTouchRule(payload)         // 新增规则
triggerCouponCampaign(couponId)  // 触发活动并更新统计
batchReplyReviews(reviewIds)     // 批量处理
resetMarketingMockDB()           // 测试重置
```

建议其他模块保持同样的 API 语义分层：

- `fetchXxxDashboard / fetchXxxList`
- `createXxx / updateXxx / removeXxx`
- `toggleXxx`
- `batchXxx`
- `resetXxxMockDB`

## 5. 页面接入模式

Marketing 页面采用以下模式，建议其他模块照搬：

1) 页面加载只调用一个入口加载函数（如 `loadDashboard`）
2) 每个交互事件只调用一个 service API，再回填状态
3) 交互后统一给用户反馈（toast）
4) 本地状态只存 UI 态（tab、modal、selectedIds、form）

示例（伪代码）：

```js
const loadData = async () => {
  setLoading(true);
  const data = await fetchXxxDashboard();
  setDashboard(data);
  setLoading(false);
};

const onToggle = async (id, next) => {
  const data = await toggleXxx(id, next);
  setDashboard(data);
  toast.show(next ? "已启用" : "已暂停", next ? "success" : "info");
};
```

## 6. Mock 数据建模建议

每个模块至少包含以下层次：

- `summary`：头部 KPI
- `list`：主列表数据
- `alerts`：预警信息
- `trend`：图表序列数据

字段规范建议：

- 主键统一 `id`
- 状态值使用明确枚举（如：`运行中`、`草稿`）
- 时间字段统一可读字符串或 ISO 时间
- 百分比字段使用数值，显示时再拼 `%`

## 7. 测试策略

### 7.1 service 测试（必须）

- 验证查询接口结构完整
- 验证更新接口会真正改变内存态
- 验证聚合统计会联动更新
- 每个测试前 `resetXxxMockDB()`

### 7.2 页面测试（建议）

- 验证加载态 -> 数据态切换
- 验证 Tab/筛选切换
- 验证关键动作（批量操作、启停、创建）
- 验证 toast 提示调用

## 8. 迁移到其他模块的步骤

1) 先定义 `XXX_MOCK_DB` 与 `memoryDB`
2) 写 `fetch + mutate + reset` 三类 API
3) 页面用 `loadXxx` 单入口接入
4) 补齐 service.test + page.test
5) 最后再接真实后端，保持 API 签名不变

## 9. 与真实 API 对接时的替换策略

- 保持函数名和返回结构不变，只替换实现
- `mockApi.js` 可平滑迁移为 `api.js`
- 页面层无需改动或仅做最小改动
- 保留 `resetXxxMockDB` 仅在测试环境使用

---

参考实现：

- `src/services/marketingMockApi.js`
- `src/components/pages/Marketing.jsx`
- `src/services/marketingMockApi.test.js`
- `src/components/pages/Marketing.test.jsx`
