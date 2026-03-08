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
  const [page, setPage]       = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const toast = useToast();

  const NAV = [
    { id:"dashboard", Icon:Home,           l:"首页",       badge:null  },
    { id:"console",   Icon:MessageSquare,  l:"客服工作台", badge:9     },
    { id:"agents",    Icon:Bot,            l:"AI 客服",    badge:null, highlight:true },
    { id:"knowledge", Icon:BookOpen,       l:"知识库",     badge:null  },
    { id:"marketing", Icon:Megaphone,      l:"智能营销",   badge:null  },
    { id:"analytics", Icon:BarChart3,      l:"数据洞察",   badge:null  },
    { id:"system",    Icon:Settings,       l:"系统管理",   badge:null  },
  ];
  const PAGES = { dashboard:Dashboard, console:Console, agents:AIAgents, knowledge:Knowledge, analytics:Analytics, system:System, marketing:Marketing };
  const Active = PAGES[page] || Dashboard;

  return (
    <div style={{display:"flex",height:"100vh",background:D.bgPage,fontFamily:"-apple-system,'PingFang SC','Microsoft YaHei',sans-serif",color:D.t2,fontSize:13}}>
      <style>{`
        *{box-sizing:border-box}
        @keyframes tsIn{from{opacity:0;transform:translateX(12px)}to{opacity:1;transform:translateX(0)}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:${D.border};border-radius:2px}
        button:focus{outline:none}
        input::placeholder,textarea::placeholder{color:${D.t4}}
      `}</style>

      {/* ── Sidebar ── */}
      <aside style={{width:collapsed?64:240,flexShrink:0,background:"#fff",display:"flex",flexDirection:"column",transition:"width .2s ease",overflow:"hidden",boxShadow:"2px 0 20px rgba(0,0,0,0.02)",zIndex:20}}>
        {/* Logo */}
        <div style={{height:64,display:"flex",alignItems:"center",justifyContent:collapsed?"center":"space-between",padding:collapsed?"0":"0 24px",flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:32,height:32,borderRadius:10,background:D.brand,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:D.sBlue}}>
              <MessageCircle size={18} color="#fff"/>
            </div>
            {!collapsed&&<div><p style={{fontSize:16,fontWeight:800,color:D.t1,margin:0,letterSpacing:"-0.3px",lineHeight:1}}>JoyServe</p></div>}
          </div>
          {!collapsed&&<button onClick={()=>setCollapsed(true)} style={{background:"none",border:"none",cursor:"pointer",color:D.t4,display:"flex",padding:4,borderRadius:4,transition:"background .2s",hover:{background:D.bgSub}}}><ChevronLeft size={16}/></button>}
        </div>

        {/* Nav items */}
        <nav style={{flex:1,padding:"12px 16px",overflowY:"auto",display:"flex",flexDirection:"column",gap:4}}>
          {NAV.map(item=>{
            const active = page===item.id;
            return (
              <button key={item.id} onClick={()=>setPage(item.id)} title={collapsed?item.l:""} style={{width:"100%",display:"flex",alignItems:"center",gap:collapsed?0:12,padding:collapsed?"12px 0":"12px 16px",justifyContent:collapsed?"center":"flex-start",borderRadius:12,cursor:"pointer",background:active?D.brandPale:"transparent",border:"none",color:active?D.brand:D.textSecondary,fontSize:14,fontWeight:active?600:500,transition:"all .2s ease",fontFamily:"inherit",position:"relative"}}>
                {active && !collapsed && <div style={{position:"absolute",left:0,top:"50%",transform:"translateY(-50%)",width:4,height:20,background:D.brand,borderRadius:"0 4px 4px 0"}}/>}
                <item.Icon size={20} style={{flexShrink:0, opacity:active?1:0.8}}/>
                {!collapsed&&<span style={{flex:1,textAlign:"left"}}>{item.l}</span>}
                {!collapsed&&item.badge!=null&&<span style={{minWidth:20,height:20,borderRadius:10,background:D.red,color:"#fff",fontSize:11,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 6px",boxShadow:"0 2px 5px rgba(220,38,38,0.3)"}}>{item.badge}</span>}
              </button>
            );
          })}
        </nav>

        {/* User */}
        <div style={{padding:"16px",marginTop:"auto"}}>
          {collapsed&&<button onClick={()=>setCollapsed(false)} style={{width:"100%",display:"flex",justifyContent:"center",padding:"8px 0",background:"none",border:"none",cursor:"pointer",color:D.t4,marginBottom:8}}><ChevronRight size={16}/></button>}
          <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px",borderRadius:16,background:D.bgSub,transition:"all .2s"}}>
            <div style={{width:36,height:36,borderRadius:"50%",background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,color:D.brand,flexShrink:0,boxShadow:D.s0}}>管</div>
            {!collapsed&&<div style={{flex:1,minWidth:0}}><p style={{fontSize:13,fontWeight:600,color:D.t1,margin:0}}>超级管理员</p><p style={{fontSize:12,color:D.textTertiary,margin:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>admin@joyserve.ai</p></div>}
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",background:D.bgPage}}>
        {/* Topbar */}
        <header style={{height:64,background:"transparent",display:"flex",alignItems:"center",padding:"0 32px",gap:24,flexShrink:0}}>
          <div style={{flex:1}}>
            <div style={{position:"relative",display:"inline-block"}}>
              <Search size={16} style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:D.t4}}/>
              <input placeholder="全局搜索..." style={{padding:"10px 16px 10px 36px",background:"#fff",border:"none",borderRadius:12,color:D.t2,fontSize:13,outline:"none",width:280,fontFamily:"inherit",boxShadow:D.s0,transition:"all .2s"}}/>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{fontSize:11,color:D.green,background:D.greenPale,padding:"3px 9px",borderRadius:20,border:`1px solid ${D.greenEdge}`,fontWeight:500,display:"flex",alignItems:"center",gap:4}}>
              <span style={{width:5,height:5,borderRadius:"50%",background:D.green,display:"inline-block"}}/>实时连接
            </div>
            <div style={{position:"relative"}}>
              <button onClick={()=>setNotifOpen(p=>!p)} style={{width:32,height:32,borderRadius:7,border:`1px solid ${D.border}`,background:D.bgCard,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:D.t3,position:"relative"}}>
                <Bell size={14}/>
                <span style={{position:"absolute",top:7,right:7,width:6,height:6,borderRadius:"50%",background:D.red,border:`2px solid ${D.bgCard}`}}/>
              </button>
              {notifOpen&&(
                <div style={{position:"absolute",right:0,top:"calc(100% + 8px)",width:304,background:D.bgCard,border:`1px solid ${D.border}`,borderRadius:10,boxShadow:D.s3,zIndex:300,overflow:"hidden"}}>
                  <div style={{padding:"12px 16px",borderBottom:`1px solid ${D.divider}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span style={{fontSize:13,fontWeight:600,color:D.t1}}>通知中心</span>
                    <Btn v="text" sz="sm" onClick={()=>{toast.show("已全部标记已读","info");setNotifOpen(false);}}>全部已读</Btn>
                  </div>
                  {[{text:"4 条紧急客诉待处理",type:"danger",time:"刚刚"},{text:"泰语知识库健康度下降至 45%",type:"warning",time:"10分钟前"},{text:"Shopee TH 授权即将到期",type:"warning",time:"1小时前"},{text:"本周 AI 解决率提升 3.2%",type:"success",time:"今天"}].map((n,i)=>(
                    <div key={i} onClick={()=>setNotifOpen(false)} style={{padding:"10px 16px",borderBottom:`1px solid ${D.divider}`,display:"flex",gap:10,alignItems:"flex-start",cursor:"pointer"}}>
                      <span style={{width:6,height:6,borderRadius:"50%",background:n.type==="danger"?D.red:n.type==="warning"?D.amber:D.green,marginTop:4,flexShrink:0}}/>
                      <div style={{flex:1}}><p style={{fontSize:12,color:D.t2,margin:"0 0 2px"}}>{n.text}</p><p style={{fontSize:11,color:D.t4,margin:0}}>{n.time}</p></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{width:30,height:30,borderRadius:"50%",background:D.bgSub,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:D.t3,cursor:"pointer",border:`1px solid ${D.border}`}}>管</div>
          </div>
        </header>

        {/* Content */}
        <main style={{flex:1,overflowY:"auto",padding:page==="console"?0:24}}>
          {page==="console"
            ? <div style={{padding:24,height:"100%"}}><Active toast={toast}/></div>
            : <Active toast={toast}/>
          }
        </main>
      </div>

      {toast.toast&&<Toast msg={toast.toast} onClose={toast.hide}/>}
    </div>
  );
}
