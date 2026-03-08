import { useEffect, useMemo, useState } from 'react';
import { Megaphone, RefreshCw, Sparkles } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { D } from '../../constants/data';
import {
  Btn,
  Card,
  CTip,
  Chip,
  Field,
  Input,
  Modal,
  PHeader,
  Sel,
  TabBar,
  Textarea,
  Toggle,
} from '../common/components';
import {
  batchReplyReviews,
  createTouchRule,
  fetchMarketingDashboard,
  triggerCouponCampaign,
  toggleTouchRule,
} from '../../services/marketingMockApi';

export default function Marketing({ toast }) {
  const [tab, setTab] = useState('touch');
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);
  const [selectedReviews, setSelectedReviews] = useState([]);
  const [ruleModalOpen, setRuleModalOpen] = useState(false);
  const [ruleForm, setRuleForm] = useState({
    name: '',
    trigger: '下单后1小时',
    channel: '站内信',
    message: '',
  });

  const tabs = useMemo(() => {
    if (!dashboard)
      return [
        { k: 'touch', l: '主动触达' },
        { k: 'review', l: '评价运营' },
        { k: 'coupon', l: '优惠券管理' },
      ];
    return [
      { k: 'touch', l: '主动触达', n: dashboard.touchRules.filter((rule) => rule.enabled).length },
      { k: 'review', l: '评价运营', n: dashboard.reviewOps.pending.length },
      {
        k: 'coupon',
        l: '优惠券管理',
        n: dashboard.couponCampaigns.filter((item) => item.status === '运行中').length,
      },
    ];
  }, [dashboard]);

  const loadDashboard = async (withToast = false) => {
    setLoading(true);
    const data = await fetchMarketingDashboard();
    setDashboard(data);
    setLoading(false);
    if (withToast) toast?.show('营销数据已刷新', 'success');
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const onToggleTouchRule = async (ruleId, enabled) => {
    const next = await toggleTouchRule(ruleId, enabled);
    setDashboard(next);
    toast?.show(enabled ? '规则已启用' : '规则已暂停', enabled ? 'success' : 'info');
  };

  const onSubmitTouchRule = async () => {
    if (!ruleForm.name.trim()) {
      toast?.show('请填写规则名称', 'warning');
      return;
    }
    await createTouchRule(ruleForm);
    await loadDashboard();
    setRuleModalOpen(false);
    setRuleForm({
      name: '',
      trigger: '下单后1小时',
      channel: '站内信',
      message: '',
    });
    toast?.show('触达规则创建成功', 'success');
  };

  const onBatchReply = async () => {
    if (!selectedReviews.length) {
      toast?.show('请先选择评价', 'warning');
      return;
    }
    const next = await batchReplyReviews(selectedReviews);
    setDashboard(next);
    setSelectedReviews([]);
    toast?.show('已生成并发送 AI 建议回复', 'success');
  };

  const onTriggerCoupon = async (couponId) => {
    const next = await triggerCouponCampaign(couponId);
    setDashboard(next);
    toast?.show('优惠券活动已触发', 'success');
  };

  if (loading || !dashboard) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <PHeader title='智能营销' sub='主动触达 · 优惠券管理 · 评价运营' />
        <Card>
          <p
            style={{
              margin: 0,
              padding: '26px 0',
              textAlign: 'center',
              color: D.t3,
              fontSize: 13,
            }}>
            正在加载营销数据...
          </p>
        </Card>
      </div>
    );
  }

  const kpis = [
    {
      icon: '🎯',
      title: '主动触达规则',
      value: dashboard.summary.activeRules,
      chipType: 'brand',
      chipText: `${dashboard.summary.autoReachRate}% 覆盖率`,
    },
    {
      icon: '🎁',
      title: '活跃优惠券',
      value: dashboard.summary.liveCoupons,
      chipType: 'success',
      chipText: `${dashboard.summary.couponUseRate}% 核销率`,
    },
    {
      icon: '⭐',
      title: '待处理评价',
      value: dashboard.summary.pendingReviews,
      chipType: 'warning',
      chipText: `${dashboard.summary.reviewHandleHours}h 平均处理`,
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <PHeader title='智能营销' sub='主动触达 · 优惠券管理 · 评价运营'>
        <Btn v='sub' sz='sm' onClick={() => loadDashboard(true)}>
          <RefreshCw size={13} />
          刷新
        </Btn>
        <Btn v='primary' sz='sm' onClick={() => setRuleModalOpen(true)}>
          <Megaphone size={13} />
          新建触达规则
        </Btn>
      </PHeader>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
        {kpis.map((item) => (
          <Card key={item.title} pad={20} style={{ cursor: 'pointer' }}>
            <div style={{ fontSize: 26, marginBottom: 12 }}>{item.icon}</div>
            <div
              style={{
                fontSize: 26,
                fontWeight: 700,
                color: D.t1,
                marginBottom: 4,
                letterSpacing: '-0.4px',
              }}>
              {item.value}
            </div>
            <p style={{ fontSize: 13, color: D.t2, margin: '0 0 8px' }}>{item.title}</p>
            <Chip type={item.chipType}>{item.chipText}</Chip>
          </Card>
        ))}
      </div>

      <TabBar tabs={tabs} active={tab} onChange={setTab} />

      {tab === 'touch' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 14 }}>
          <Card>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 14,
              }}>
              <p style={{ margin: 0, fontSize: 14, color: D.t1, fontWeight: 700 }}>
                主动关怀时间线
              </p>
              <Chip type='brand'>全自动运行</Chip>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {dashboard.touchRules.map((rule) => (
                <div
                  key={rule.id}
                  style={{
                    border: `1px solid ${D.border}`,
                    borderRadius: 16,
                    padding: '12px 14px',
                    background: D.bgCard,
                  }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 10,
                    }}>
                    <div>
                      <p style={{ margin: '0 0 4px', color: D.t1, fontSize: 13, fontWeight: 600 }}>
                        {rule.name}
                      </p>
                      <p style={{ margin: 0, color: D.t4, fontSize: 12 }}>
                        {rule.trigger} · {rule.channel}
                      </p>
                    </div>
                    <Toggle
                      on={rule.enabled}
                      onChange={(next) => onToggleTouchRule(rule.id, next)}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                    <div style={{ background: D.bgSub, borderRadius: 10, padding: '8px 10px' }}>
                      <p style={{ margin: '0 0 2px', fontSize: 11, color: D.t4 }}>触达量</p>
                      <p style={{ margin: 0, fontSize: 13, color: D.t1, fontWeight: 600 }}>
                        {rule.reach}
                      </p>
                    </div>
                    <div style={{ background: D.bgSub, borderRadius: 10, padding: '8px 10px' }}>
                      <p style={{ margin: '0 0 2px', fontSize: 11, color: D.t4 }}>打开率</p>
                      <p style={{ margin: 0, fontSize: 13, color: D.brand, fontWeight: 600 }}>
                        {rule.openRate}%
                      </p>
                    </div>
                    <div style={{ background: D.bgSub, borderRadius: 10, padding: '8px 10px' }}>
                      <p style={{ margin: '0 0 2px', fontSize: 11, color: D.t4 }}>转化率</p>
                      <p style={{ margin: 0, fontSize: 13, color: D.green, fontWeight: 600 }}>
                        {rule.conversionRate}%
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Card>
              <p style={{ margin: '0 0 10px', fontSize: 14, color: D.t1, fontWeight: 700 }}>
                物流异常主动干预
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {dashboard.logisticsAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    style={{
                      border: `1px solid ${D.border}`,
                      borderRadius: 12,
                      padding: '10px 12px',
                      background: D.bgSub,
                    }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 4,
                      }}>
                      <p style={{ margin: 0, fontSize: 12, color: D.t1, fontWeight: 600 }}>
                        {alert.title}
                      </p>
                      <Chip type={alert.level === 'danger' ? 'danger' : 'warning'}>
                        {alert.affectedOrders} 单
                      </Chip>
                    </div>
                    <p style={{ margin: 0, fontSize: 12, color: D.t3 }}>{alert.action}</p>
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <p style={{ margin: '0 0 10px', fontSize: 14, color: D.t1, fontWeight: 700 }}>
                沉默客户唤醒分群
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {dashboard.reactivationSegments.map((segment) => (
                  <div
                    key={segment.id}
                    style={{
                      border: `1px solid ${D.border}`,
                      borderRadius: 12,
                      padding: '10px 12px',
                    }}>
                    <p style={{ margin: '0 0 4px', fontSize: 12, color: D.t1, fontWeight: 600 }}>
                      {segment.name}
                    </p>
                    <p style={{ margin: '0 0 4px', fontSize: 12, color: D.t3 }}>
                      {segment.strategy}
                    </p>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: 11,
                        color: D.t4,
                      }}>
                      <span>{segment.buyers} 人</span>
                      <span>{segment.bestTime}</span>
                      <span>{segment.openRate}% 打开率</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {tab === 'review' && (
        <Card pad={0}>
          <div
            style={{
              padding: '14px 18px',
              borderBottom: `1px solid ${D.border}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <span style={{ fontSize: 14, color: D.t1, fontWeight: 700 }}>评价运营队列</span>
            <Btn v='primary' sz='sm' onClick={onBatchReply}>
              <Sparkles size={12} />
              批量生成回复
            </Btn>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: D.bgSub }}>
                {['选择', '买家', '评分', '问题标签', '状态', '提交时间'].map((head) => (
                  <th
                    key={head}
                    style={{
                      textAlign: 'left',
                      padding: '10px 18px',
                      fontSize: 11,
                      color: D.t4,
                      fontWeight: 600,
                    }}>
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dashboard.reviewOps.pending.map((review) => (
                <tr key={review.id} style={{ borderTop: `1px solid ${D.divider}` }}>
                  <td style={{ padding: '12px 18px' }}>
                    <input
                      type='checkbox'
                      checked={selectedReviews.includes(review.id)}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedReviews((prev) => [...prev, review.id]);
                        else setSelectedReviews((prev) => prev.filter((id) => id !== review.id));
                      }}
                    />
                  </td>
                  <td style={{ padding: '12px 18px', fontSize: 13, color: D.t2 }}>
                    {review.buyer}
                  </td>
                  <td style={{ padding: '12px 18px' }}>
                    <Chip type={review.rating <= 2 ? 'danger' : 'warning'}>{review.rating} 星</Chip>
                  </td>
                  <td style={{ padding: '12px 18px', fontSize: 12, color: D.t3 }}>
                    {review.sentiment}
                  </td>
                  <td style={{ padding: '12px 18px' }}>
                    <Chip type={review.status === 'AI建议已发送' ? 'success' : 'slate'}>
                      {review.status}
                    </Chip>
                  </td>
                  <td style={{ padding: '12px 18px', fontSize: 12, color: D.t4 }}>
                    {review.createdAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {tab === 'coupon' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 14 }}>
          <Card>
            <p style={{ margin: '0 0 12px', fontSize: 14, color: D.t1, fontWeight: 700 }}>
              优惠券发放与核销趋势
            </p>
            <ResponsiveContainer width='100%' height={220}>
              <BarChart data={dashboard.couponTrend}>
                <CartesianGrid strokeDasharray='3 3' stroke={D.divider} vertical={false} />
                <XAxis
                  dataKey='date'
                  tick={{ fontSize: 11, fill: D.t4 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis tick={{ fontSize: 11, fill: D.t4 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CTip />} />
                <Bar dataKey='issued' name='发放量' fill={D.brandDim} radius={[4, 4, 0, 0]} />
                <Bar dataKey='used' name='核销量' fill={D.brand} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
          <Card>
            <p style={{ margin: '0 0 10px', fontSize: 14, color: D.t1, fontWeight: 700 }}>
              活动列表
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {dashboard.couponCampaigns.map((coupon) => (
                <div
                  key={coupon.id}
                  style={{
                    border: `1px solid ${D.border}`,
                    borderRadius: 12,
                    padding: '10px 12px',
                  }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 5,
                    }}>
                    <p style={{ margin: 0, fontSize: 12, color: D.t1, fontWeight: 600 }}>
                      {coupon.name}
                    </p>
                    <Chip type={coupon.status === '运行中' ? 'success' : 'slate'}>
                      {coupon.status}
                    </Chip>
                  </div>
                  <p style={{ margin: '0 0 8px', fontSize: 11, color: D.t4 }}>
                    {coupon.type} · 触发条件：{coupon.trigger}
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <span style={{ fontSize: 11, color: D.t3 }}>
                      发放 {coupon.issued} / 核销 {coupon.used}
                    </span>
                    <Btn v='ghost' sz='sm' onClick={() => onTriggerCoupon(coupon.id)}>
                      立即发放
                    </Btn>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      <Modal
        open={ruleModalOpen}
        onClose={() => setRuleModalOpen(false)}
        title='新建主动触达规则'
        footer={
          <>
            <Btn v='sub' onClick={() => setRuleModalOpen(false)}>
              取消
            </Btn>
            <Btn v='primary' onClick={onSubmitTouchRule}>
              保存规则
            </Btn>
          </>
        }>
        <Field label='规则名称' req>
          <Input
            value={ruleForm.name}
            onChange={(e) => setRuleForm((prev) => ({ ...prev, name: e.target.value }))}
            placeholder='例如：收货后 7 天唤醒'
          />
        </Field>
        <Field label='触发时机'>
          <Sel
            value={ruleForm.trigger}
            onChange={(next) => setRuleForm((prev) => ({ ...prev, trigger: next }))}
            opts={[
              { v: '下单后1小时', l: '下单后1小时' },
              { v: '发货后5分钟', l: '发货后5分钟' },
              { v: '签收后3天', l: '签收后3天' },
              { v: '好评后24小时', l: '好评后24小时' },
            ]}
          />
        </Field>
        <Field label='触达渠道'>
          <Sel
            value={ruleForm.channel}
            onChange={(next) => setRuleForm((prev) => ({ ...prev, channel: next }))}
            opts={[
              { v: '站内信', l: '站内信' },
              { v: '短信', l: '短信' },
              { v: 'WhatsApp', l: 'WhatsApp' },
            ]}
          />
        </Field>
        <Field label='消息模板'>
          <Textarea
            value={ruleForm.message}
            onChange={(e) => setRuleForm((prev) => ({ ...prev, message: e.target.value }))}
            placeholder='输入触达消息模板，支持变量：{buyer_name} {order_id}'
            rows={4}
          />
        </Field>
      </Modal>
    </div>
  );
}
