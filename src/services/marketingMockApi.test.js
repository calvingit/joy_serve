import {
  batchReplyReviews,
  createTouchRule,
  fetchMarketingDashboard,
  resetMarketingMockDB,
  toggleTouchRule,
  triggerCouponCampaign,
} from "./marketingMockApi";

describe("marketingMockApi", () => {
  beforeEach(() => {
    resetMarketingMockDB();
  });

  it("返回营销看板完整数据", async () => {
    const data = await fetchMarketingDashboard();
    expect(data.summary.activeRules).toBeGreaterThan(0);
    expect(data.touchRules.length).toBeGreaterThan(0);
    expect(data.couponCampaigns.length).toBeGreaterThan(0);
  });

  it("支持启停触达规则并更新统计", async () => {
    const initial = await fetchMarketingDashboard();
    const target = initial.touchRules.find((rule) => rule.enabled);
    const next = await toggleTouchRule(target.id, false);
    const changed = next.touchRules.find((rule) => rule.id === target.id);
    expect(changed.enabled).toBe(false);
    expect(next.summary.activeRules).toBe(initial.summary.activeRules - 1);
  });

  it("支持创建规则和触发优惠券活动", async () => {
    await createTouchRule({
      name: "测试规则",
      trigger: "签收后3天",
      channel: "站内信",
      message: "Hello",
    });
    const afterCreate = await fetchMarketingDashboard();
    expect(afterCreate.touchRules[0].name).toBe("测试规则");

    const couponId = afterCreate.couponCampaigns[0].id;
    const afterTrigger = await triggerCouponCampaign(couponId);
    expect(afterTrigger.couponCampaigns[0].issued).toBeGreaterThan(afterCreate.couponCampaigns[0].issued);
  });

  it("支持批量处理评价", async () => {
    const initial = await fetchMarketingDashboard();
    const ids = initial.reviewOps.pending.slice(0, 2).map((item) => item.id);
    const next = await batchReplyReviews(ids);
    ids.forEach((id) => {
      const row = next.reviewOps.pending.find((item) => item.id === id);
      expect(row.status).toBe("AI建议已发送");
    });
  });
});
