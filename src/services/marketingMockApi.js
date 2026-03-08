const MARKETING_MOCK_DB = {
  summary: {
    activeRules: 8,
    liveCoupons: 24,
    pendingReviews: 142,
    autoReachRate: 78,
    couponUseRate: 39.5,
    reviewHandleHours: 2.1,
  },
  touchRules: [
    { id: "rule_order_confirm", name: "下单确认", trigger: "下单后1小时", channel: "站内信", enabled: true, reach: 9820, openRate: 86, conversionRate: 11.2 },
    { id: "rule_shipping_notice", name: "发货通知", trigger: "发货后5分钟", channel: "站内信", enabled: true, reach: 7540, openRate: 91, conversionRate: 8.7 },
    { id: "rule_delivery_remind", name: "到货提醒", trigger: "预计签收前6小时", channel: "短信", enabled: true, reach: 6350, openRate: 73, conversionRate: 6.4 },
    { id: "rule_review_nudge", name: "收货后催评", trigger: "签收后3天", channel: "站内信", enabled: true, reach: 4120, openRate: 68, conversionRate: 18.5 },
    { id: "rule_repurchase", name: "好评后二次推荐", trigger: "好评后24小时", channel: "站内信", enabled: false, reach: 2190, openRate: 62, conversionRate: 14.9 },
  ],
  logisticsAlerts: [
    { id: "alert_1", level: "warning", title: "48小时无物流更新", action: "自动触发延迟安抚+补偿券", affectedOrders: 38 },
    { id: "alert_2", level: "danger", title: "跨境清关拥堵", action: "切换人工复核模板并提升优先级", affectedOrders: 12 },
  ],
  reactivationSegments: [
    { id: "seg_60d", name: "60天未复购老客", buyers: 1860, strategy: "推荐同类新品 + 专属券", bestTime: "14:00-16:00", openRate: 41 },
    { id: "seg_high_value", name: "高客单沉默客户", buyers: 420, strategy: "客服关怀 + 会员权益提醒", bestTime: "20:00-22:00", openRate: 53 },
  ],
  reviewOps: {
    negativeRate: 2.8,
    avgHandleHours: 2.1,
    pending: [
      { id: "rv_1001", buyer: "Nguyen Van A", rating: 2, sentiment: "物流慢", status: "待回复", createdAt: "10:12" },
      { id: "rv_1002", buyer: "Siti Rahma", rating: 1, sentiment: "商品不符", status: "待人工审核", createdAt: "09:44" },
      { id: "rv_1003", buyer: "Juan Cruz", rating: 3, sentiment: "包装破损", status: "AI建议已生成", createdAt: "08:26" },
    ],
  },
  couponCampaigns: [
    { id: "cp_01", name: "物流延迟补偿券", type: "满减券", trigger: "物流异常48h", issued: 1320, used: 684, gmv: 19400, status: "运行中" },
    { id: "cp_02", name: "沉默客户唤醒券", type: "折扣券", trigger: "60天未复购", issued: 890, used: 281, gmv: 9800, status: "运行中" },
    { id: "cp_03", name: "好评返场券", type: "定向券", trigger: "评价4星及以上", issued: 540, used: 216, gmv: 7300, status: "草稿" },
  ],
  couponTrend: [
    { date: "03-01", issued: 210, used: 74 },
    { date: "03-02", issued: 240, used: 96 },
    { date: "03-03", issued: 260, used: 102 },
    { date: "03-04", issued: 280, used: 120 },
    { date: "03-05", issued: 300, used: 132 },
    { date: "03-06", issued: 330, used: 148 },
    { date: "03-07", issued: 360, used: 162 },
  ],
};

let memoryDB = structuredClone(MARKETING_MOCK_DB);

const wait = (ms = 220) => new Promise((resolve) => setTimeout(resolve, ms));

const clone = (v) => structuredClone(v);

const nextSummary = () => ({
  ...memoryDB.summary,
  activeRules: memoryDB.touchRules.filter((rule) => rule.enabled).length,
  pendingReviews: memoryDB.reviewOps.pending.length,
  liveCoupons: memoryDB.couponCampaigns.filter((c) => c.status === "运行中").length,
  couponUseRate: Number(
    (
      (memoryDB.couponCampaigns.reduce((sum, c) => sum + c.used, 0) /
        Math.max(memoryDB.couponCampaigns.reduce((sum, c) => sum + c.issued, 0), 1)) *
      100
    ).toFixed(1)
  ),
});

export async function fetchMarketingDashboard() {
  await wait();
  return clone({
    ...memoryDB,
    summary: nextSummary(),
  });
}

export async function toggleTouchRule(ruleId, enabled) {
  await wait(160);
  memoryDB = {
    ...memoryDB,
    touchRules: memoryDB.touchRules.map((rule) =>
      rule.id === ruleId ? { ...rule, enabled } : rule
    ),
  };
  return fetchMarketingDashboard();
}

export async function createTouchRule(payload) {
  await wait(180);
  const item = {
    id: `rule_custom_${Date.now()}`,
    name: payload.name,
    trigger: payload.trigger,
    channel: payload.channel,
    enabled: true,
    reach: 0,
    openRate: 0,
    conversionRate: 0,
  };
  memoryDB = {
    ...memoryDB,
    touchRules: [item, ...memoryDB.touchRules],
  };
  return clone(item);
}

export async function triggerCouponCampaign(couponId) {
  await wait(140);
  memoryDB = {
    ...memoryDB,
    couponCampaigns: memoryDB.couponCampaigns.map((coupon) =>
      coupon.id === couponId
        ? { ...coupon, issued: coupon.issued + 60, used: coupon.used + 18, gmv: coupon.gmv + 1200, status: "运行中" }
        : coupon
    ),
  };
  return fetchMarketingDashboard();
}

export async function batchReplyReviews(reviewIds) {
  await wait(180);
  memoryDB = {
    ...memoryDB,
    reviewOps: {
      ...memoryDB.reviewOps,
      pending: memoryDB.reviewOps.pending.map((review) =>
        reviewIds.includes(review.id) ? { ...review, status: "AI建议已发送" } : review
      ),
    },
  };
  return fetchMarketingDashboard();
}

export function resetMarketingMockDB() {
  memoryDB = structuredClone(MARKETING_MOCK_DB);
}

export { MARKETING_MOCK_DB };
