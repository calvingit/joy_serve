import { useState } from "react";
import {
  BarChart3,
  Bell,
  BookOpen,
  Bot,
  ChevronLeft,
  ChevronRight,
  Home,
  Megaphone,
  MessageCircle,
  MessageSquare,
  Search,
  Settings,
} from "lucide-react";
import { D } from "../../constants/data";
import { useToast } from "../../hooks/useToast";
import { Btn, Toast } from "../common/components";
import {
  AIAgents,
  Analytics,
  Console,
  Dashboard,
  Knowledge,
  Marketing,
  System,
} from "../pages/JoyServePages";

export default function AppShell() {
  const [page, setPage] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const toast = useToast();

  const NAV = [
    { id: "dashboard", Icon: Home, l: "首页" },
    { id: "console", Icon: MessageSquare, l: "客服工作台", badge: 9 },
    { id: "agents", Icon: Bot, l: "AI 客服" },
    { id: "knowledge", Icon: BookOpen, l: "知识库" },
    { id: "marketing", Icon: Megaphone, l: "智能营销" },
    { id: "analytics", Icon: BarChart3, l: "数据洞察" },
    { id: "system", Icon: Settings, l: "系统管理" },
  ];
  const PAGES = {
    dashboard: Dashboard,
    console: Console,
    agents: AIAgents,
    knowledge: Knowledge,
    analytics: Analytics,
    system: System,
    marketing: Marketing,
  };
  const Active = PAGES[page] || Dashboard;

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: D.bgPage,
        color: D.t2,
        fontSize: 13,
        fontFamily: D.fontBody,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        @keyframes tsIn { from { opacity: 0; transform: translate3d(0, -8px, 0); } to { opacity: 1; transform: translate3d(0, 0, 0); } }
        @keyframes pulseDot { 0% { opacity: .65; transform: scale(1); } 50% { opacity: 1; transform: scale(1.08); } 100% { opacity: .65; transform: scale(1); } }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #D8DEEB; border-radius: 999px; }
        button, input, textarea, select { font: inherit; }
        input::placeholder, textarea::placeholder { color: ${D.t4}; }
      `}</style>

      <aside
        style={{
          width: collapsed ? 92 : 264,
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          padding: "20px 14px 18px",
          transition: "width .2s ease",
          background: D.bgCard,
          borderRight: `1px solid ${D.border}`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "space-between",
            padding: collapsed ? "8px 0 18px" : "8px 8px 18px 10px",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 14,
                background: "linear-gradient(135deg, #5B8EFF 0%, #4880FF 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: D.sBlue,
                flexShrink: 0,
              }}
            >
              <MessageCircle size={18} color="#fff" />
            </div>
            {!collapsed && (
              <div style={{ minWidth: 0 }}>
                <p
                  style={{
                    margin: 0,
                    fontSize: 20,
                    lineHeight: 1,
                    color: D.textPrimary,
                    fontWeight: 800,
                    letterSpacing: "-0.04em",
                    fontFamily: D.fontDisplay,
                  }}
                >
                  JoyServe
                </p>
                <p style={{ margin: "6px 0 0", fontSize: 12, color: D.textSecondary }}>
                  AI commerce operations hub
                </p>
              </div>
            )}
          </div>
          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              aria-label="收起侧边栏"
              style={{
                width: 32,
                height: 32,
                borderRadius: 12,
                border: `1px solid ${D.border}`,
                background: D.bgCard,
                color: D.t4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: D.s0,
              }}
            >
              <ChevronLeft size={16} />
            </button>
          )}
        </div>

        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 6,
            paddingTop: 8,
            flex: 1,
            overflowY: "auto",
          }}
        >
          {NAV.map((item) => {
            const active = page === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setPage(item.id);
                  setNotifOpen(false);
                }}
                title={collapsed ? item.l : ""}
                style={{
                  width: "100%",
                  height: 48,
                  padding: collapsed ? 0 : "0 14px",
                  borderRadius: 16,
                  border: `1px solid ${active ? D.brandEdge : "transparent"}`,
                  background: active ? D.brandPale : "transparent",
                  color: active ? D.brand : D.textSecondary,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: collapsed ? "center" : "flex-start",
                  gap: collapsed ? 0 : 12,
                  cursor: "pointer",
                  transition: "all .2s ease",
                  fontSize: 14,
                  fontWeight: active ? 700 : 500,
                  position: "relative",
                }}
              >
                {active && (
                  <span
                    style={{
                      position: "absolute",
                      left: 10,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: D.brand,
                    }}
                  />
                )}
                <item.Icon size={18} style={{ marginLeft: active && !collapsed ? 10 : 0, flexShrink: 0 }} />
                {!collapsed && <span style={{ flex: 1, textAlign: "left" }}>{item.l}</span>}
                {!collapsed && item.badge != null && (
                  <span
                    style={{
                      minWidth: 22,
                      height: 22,
                      padding: "0 7px",
                      borderRadius: 999,
                      background: active ? D.bgCard : D.brandPale,
                      color: D.brand,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 700,
                      fontFamily: D.fontDisplay,
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div style={{ paddingTop: 16 }}>
          {collapsed && (
            <button
              onClick={() => setCollapsed(false)}
              aria-label="展开侧边栏"
              style={{
                width: "100%",
                height: 40,
                borderRadius: 14,
                border: `1px solid ${D.border}`,
                background: D.bgCard,
                color: D.t4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: D.s0,
                marginBottom: 12,
              }}
            >
              <ChevronRight size={16} />
            </button>
          )}

          <div
            style={{
              borderRadius: 18,
              background: collapsed ? D.bgSub : D.bgPage,
              border: `1px solid ${D.border}`,
              padding: collapsed ? "10px 0" : "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: collapsed ? "center" : "flex-start",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: D.bgCard,
                border: `1px solid ${D.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: D.brand,
                fontWeight: 800,
                fontFamily: D.fontDisplay,
                boxShadow: D.s0,
                flexShrink: 0,
              }}
            >
              管
            </div>
            {!collapsed && (
              <div style={{ minWidth: 0 }}>
                <p style={{ margin: 0, color: D.textPrimary, fontWeight: 700 }}>超级管理员</p>
                <p
                  style={{
                    margin: "4px 0 0",
                    color: D.textTertiary,
                    fontSize: 12,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  admin@joyserve.ai
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>

      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 20,
            padding: "22px 28px 0",
            flexShrink: 0,
          }}
        >
          <div style={{ position: "relative", flex: "0 1 360px" }}>
            <Search
              size={16}
              style={{
                position: "absolute",
                left: 14,
                top: "50%",
                transform: "translateY(-50%)",
                color: D.t4,
              }}
            />
            <input
              name="global-search"
              placeholder="Search"
              style={{
                width: "100%",
                height: 44,
                padding: "0 16px 0 40px",
                background: D.bgCard,
                border: `1px solid ${D.border}`,
                borderRadius: 16,
                boxShadow: D.s0,
                color: D.t2,
                outline: "none",
              }}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "0 12px",
                height: 40,
                borderRadius: 999,
                border: `1px solid ${D.greenEdge}`,
                background: D.greenPale,
                color: D.green,
                fontSize: 12,
                fontWeight: 700,
                fontFamily: D.fontDisplay,
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: D.green,
                  display: "inline-block",
                  animation: "pulseDot 1.8s ease infinite",
                }}
              />
              Live
            </div>

            <div style={{ position: "relative" }}>
              <button
                onClick={() => setNotifOpen((p) => !p)}
                aria-label="打开通知"
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 16,
                  border: `1px solid ${D.border}`,
                  background: D.bgCard,
                  color: D.textSecondary,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: D.s0,
                  position: "relative",
                }}
              >
                <Bell size={16} />
                <span
                  style={{
                    position: "absolute",
                    top: 9,
                    right: 10,
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: D.red,
                    border: `2px solid ${D.bgCard}`,
                  }}
                />
              </button>

              {notifOpen && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "calc(100% + 10px)",
                    width: 320,
                    background: D.bgCard,
                    border: `1px solid ${D.border}`,
                    borderRadius: 22,
                    boxShadow: D.s3,
                    overflow: "hidden",
                    zIndex: 300,
                  }}
                >
                  <div
                    style={{
                      padding: "16px 18px 14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      borderBottom: `1px solid ${D.divider}`,
                    }}
                  >
                    <span style={{ color: D.t1, fontWeight: 800, fontFamily: D.fontDisplay }}>通知中心</span>
                    <Btn
                      v="text"
                      sz="sm"
                      onClick={() => {
                        toast.show("已全部标记已读", "info");
                        setNotifOpen(false);
                      }}
                    >
                      全部已读
                    </Btn>
                  </div>

                  {[
                    { text: "4 条紧急客诉待处理", type: "danger", time: "刚刚" },
                    { text: "泰语知识库健康度下降至 45%", type: "warning", time: "10分钟前" },
                    { text: "Shopee TH 授权即将到期", type: "warning", time: "1小时前" },
                    { text: "本周 AI 解决率提升 3.2%", type: "success", time: "今天" },
                  ].map((n, i) => (
                    <div
                      key={i}
                      onClick={() => setNotifOpen(false)}
                      style={{
                        display: "flex",
                        gap: 12,
                        padding: "14px 18px",
                        borderBottom: i === 3 ? "none" : `1px solid ${D.divider}`,
                        cursor: "pointer",
                      }}
                    >
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: n.type === "danger" ? D.red : n.type === "warning" ? D.amber : D.green,
                          marginTop: 6,
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ minWidth: 0 }}>
                        <p style={{ margin: 0, color: D.t2, lineHeight: 1.5 }}>{n.text}</p>
                        <p style={{ margin: "4px 0 0", color: D.t4, fontSize: 12 }}>{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "6px 8px 6px 6px",
                borderRadius: 999,
                background: D.bgCard,
                border: `1px solid ${D.border}`,
                boxShadow: D.s0,
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  background: D.brandPale,
                  color: D.brand,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontFamily: D.fontDisplay,
                }}
              >
                管
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ margin: 0, color: D.t1, fontWeight: 700, fontSize: 13 }}>JoyServe Admin</p>
                <p style={{ margin: "2px 0 0", color: D.t4, fontSize: 11 }}>Operations</p>
              </div>
            </div>
          </div>
        </header>

        <main style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: page === "console" ? "20px 28px 28px" : "24px 28px 28px" }}>
          <Active toast={toast} />
        </main>
      </div>

      {toast.toast && <Toast msg={toast.toast} onClose={toast.hide} />}
    </div>
  );
}
