import { useState, useEffect, useRef, useCallback } from "react";
import {
  Home, MessageSquare, BookOpen, Megaphone, Bot, BarChart3, Settings,
  Search, Bell, ChevronRight, ChevronLeft, ChevronDown, ChevronUp,
  Zap, Clock, CheckCircle2, AlertCircle, Plus, Filter, Send,
  Paperclip, Star, Upload, Download, Eye, Edit3, Trash2, Shield,
  Key, Activity, ArrowUpRight, ArrowDownRight, X, Play, Pause,
  FileText, Info, AlertTriangle, CheckCheck, Sparkles, User,
  MessageCircle, RefreshCcw, UserPlus, ArrowLeft, Check, Minus,
  FlaskConical, RotateCcw, Workflow, ShieldCheck, Lock, Inbox,
  Image, Smile, Cpu, RefreshCw, Flag, MoreHorizontal, Award
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

/* ─────────────────────────────────────────────────────────────────────────────
   DESIGN SYSTEM
   Philosophy: 80% cold-gray background · 15% grayscale text · 5% brand blue
   Single accent color strategy — blue is the ONLY non-neutral color signal
───────────────────────────────────────────────────────────────────────────── */
const D = {
  /* Surface layers */
  bgPage  : "#F4F5F7",   // page background — cold gray
  bgCard  : "#FFFFFF",   // card surface — pure white
  bgSub   : "#F8F9FB",   // recessed / inner — slightly off-white
  bgInput : "#F4F5F7",   // input background

  /* Brand — one accent, used sparingly */
  brand   : "#2D6BFE",
  brandB  : "#1A54E0",   // pressed / darker
  brandPale: "#EEF3FF",  // pale tint for hover/selected states
  brandEdge: "#D6E3FF",  // border when brand state active
  brandGlow: "rgba(45,107,254,0.18)", // chart gradient top

  /* Same-hue desaturated — for chart secondary series */
  brandDim : "#A6C1FF",

  /* Semantic — only used for status badges, never decorative */
  green : "#0DB37A", greenPale : "#E6F8F2", greenEdge : "#B3E8D7",
  amber : "#D97706", amberPale : "#FFF8E1", amberEdge : "#FDE68A",
  red   : "#DC2626", redPale   : "#FEF2F2", redEdge   : "#FECACA",
  slate : "#64748B", slatePale : "#F1F5F9", slateEdge : "#CBD5E1",

  /* Typography — strict grayscale, no pure black */
  t1 : "#111827",  // KPI numerals, card titles — darkest
  t2 : "#374151",  // body, table rows
  t3 : "#6B7280",  // labels, axis, secondary
  t4 : "#9CA3AF",  // placeholder, muted
  t5 : "#D1D5DB",  // dividers, disabled

  /* Borders */
  border  : "#E5E7EB",
  divider : "#F3F4F6",

  /* Shadows — diffused, never sharp */
  s0 : "0 1px 2px rgba(0,0,0,0.04)",
  s1 : "0 1px 4px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04)",
  s2 : "0 4px 16px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)",
  s3 : "0 12px 40px rgba(0,0,0,0.10), 0 4px 12px rgba(0,0,0,0.06)",
  sBlue: "0 4px 14px rgba(45,107,254,0.22)",
};

/* ─── Mock Data ─────────────────────────────────────────────────────────────── */
const DATA = {
  trend: [
    { t:"00:00", ai:120, h:18 }, { t:"04:00", ai:85, h:11 },
    { t:"08:00", ai:290, h:38 }, { t:"12:00", ai:520, h:64 },
    { t:"16:00", ai:680, h:87 }, { t:"20:00", ai:480, h:60 },
    { t:"23:59", ai:310, h:42 },
  ],
  week: [
    { d:"周一", ai:420, h:58 }, { d:"周二", ai:380, h:71 },
    { d:"周三", ai:510, h:43 }, { d:"周四", ai:490, h:62 },
    { d:"周五", ai:620, h:89 }, { d:"周六", ai:370, h:34 },
    { d:"周日", ai:270, h:26 },
  ],
  monthly: [
    { m:"9月", s:18400, r:15800 }, { m:"10月", s:21200, r:18600 },
    { m:"11月", s:28900, r:25400 }, { m:"12月", s:35600, r:31200 },
    { m:"1月",  s:29800, r:26100 }, { m:"2月",  s:31200, r:27800 },
  ],
  platform: [
    { name:"Shopee",  value:48, color:"#2D6BFE" },
    { name:"Lazada",  value:28, color:"#A6C1FF" },
    { name:"TikTok",  value:15, color:"#6B9BFF" },
    { name:"其他",    value:9,  color:"#D6E3FF"  },
  ],
  coverage: [
    { scene:"订单查询", rate:96, avg:89 }, { scene:"物流追踪", rate:91, avg:85 },
    { scene:"退款处理", rate:72, avg:78 }, { scene:"商品咨询", rate:61, avg:75 },
    { scene:"取消订单", rate:52, avg:71 }, { scene:"催付提醒", rate:88, avg:82 },
  ],
  sessions: [
    { id:1, buyer:"Nguyen Van A", platform:"Shopee VN", avatar:"N", status:"ai",    msg:"我的订单什么时候发货？",            time:"2m",  unread:3, flag:"🇻🇳", urgent:true,  order:"#VN2024030589" },
    { id:2, buyer:"Siti Rahma",   platform:"Lazada MY", avatar:"S", status:"human", msg:"Can I return this product?",      time:"5m",  unread:1, flag:"🇮🇩", urgent:false, order:"#MY2024030421" },
    { id:3, buyer:"Malee K.",     platform:"TikTok TH", avatar:"M", status:"ai",    msg:"สินค้ามีสีอื่นไหมคะ",            time:"8m",  unread:0, flag:"🇹🇭", urgent:false, order:"#TH2024030312" },
    { id:4, buyer:"Juan Cruz",    platform:"Shopee PH", avatar:"J", status:"pending",msg:"Hindi pa dumating yung package", time:"12m", unread:2, flag:"🇵🇭", urgent:true,  order:"#PH2024030198" },
    { id:5, buyer:"Ahmad Rizal",  platform:"Lazada MY", avatar:"A", status:"ai",    msg:"Boleh tukar saiz tak?",           time:"15m", unread:0, flag:"🇲🇾", urgent:false, order:"#MY2024030377" },
    { id:6, buyer:"Warisa P.",    platform:"Shopee TH", avatar:"W", status:"human", msg:"ต้องการใบเสร็จ",                  time:"18m", unread:1, flag:"🇹🇭", urgent:false, order:"#TH2024030089" },
  ],
  chat: [
    { id:1, role:"buyer", text:"我的订单 #VN2024030589 什么时候发货？我已经等了3天了", time:"14:22" },
    { id:2, role:"ai",    text:"您好！感谢您的耐心等待。让我为您查询订单 #VN2024030589 的状态。", time:"14:22" },
    { id:3, role:"tool",  fn:"get_order_status", args:"order_id='VN2024030589'", result:'{"status":"shipped","tracking":"VNPOST2847391","eta":"tomorrow 15:00-18:00"}', time:"14:22" },
    { id:4, role:"ai",    text:"查询结果：您的订单已于今天 10:30 从越南河内仓库发出，预计明天下午 3–6 点到达。\n快递单号：VNPOST2847391，可通过越南邮政官网追踪。", time:"14:23" },
    { id:5, role:"buyer", text:"好的谢谢！那如果明天没收到怎么办？", time:"14:25" },
    { id:6, role:"ai",    text:"如果在预计时间段内没有收到包裹，您可以：\n① 联系越南邮政客服 1800-5555\n② 或直接告知我们，我们会为您申请延误补偿。", time:"14:25" },
  ],
  agents: [
    { id:1, name:"接待专员",  sub:"欢迎接待 · 订单查询 · 物流追踪", platform:"Shopee VN",  status:"running", sessions:142, rate:89, skills:["欢迎接待","订单查询","物流追踪","情感分析"] },
    { id:2, name:"售后主管",  sub:"退款处理 · 取消订单 · 投诉升级", platform:"全平台",     status:"running", sessions:89,  rate:94, skills:["退款处理","取消订单","情感分析"] },
    { id:3, name:"导购助手",  sub:"商品推荐 · 库存查询 · 催付提醒", platform:"Lazada MY",  status:"paused",  sessions:34,  rate:76, skills:["智能导购","库存查询","催付提醒"] },
    { id:4, name:"营销专员",  sub:"主动关怀 · 催评引导 · 优惠推送", platform:"TikTok Shop", status:"draft",   sessions:0,   rate:0,  skills:["主动关怀","催评引导","优惠推送"] },
  ],
  skills: [
    { id:"welcome",  icon:"🎉", name:"欢迎接待",  desc:"自动回复新买家首条消息，建立良好第一印象",    cat:"基础", installed:true,  hits:3847  },
    { id:"order",    icon:"📦", name:"订单查询",  desc:"自动查询并回复订单状态，支持多平台订单系统",  cat:"基础", installed:true,  hits:12406 },
    { id:"logistics",icon:"🚚", name:"物流追踪",  desc:"实时查询物流信息，支持主流物流商及异常处理",  cat:"基础", installed:true,  hits:9821  },
    { id:"refund",   icon:"💸", name:"退款处理",  desc:"自动处理退款申请，支持规则化自动审批流程",    cat:"售后", installed:true,  hits:4231  },
    { id:"emotion",  icon:"😊", name:"情感分析",  desc:"识别买家情绪，4级分级，高风险自动升级至主管", cat:"智能", installed:true,  hits:7654  },
    { id:"guide",    icon:"🛍️", name:"智能导购",  desc:"理解需求，结合实时商品数据智能推荐，提升转化", cat:"营销", installed:false, hits:2103  },
    { id:"review",   icon:"⭐", name:"评价回复",  desc:"自动回复买家评价，好中差评分级策略处理",      cat:"营销", installed:false, hits:1876  },
    { id:"care",     icon:"💝", name:"主动关怀",  desc:"全自动购后关怀时间线，提升复购率与满意度",    cat:"营销", installed:false, hits:1542  },
    { id:"urgepay",  icon:"⏰", name:"催付提醒",  desc:"下单未付款自动提醒，降低弃单率",              cat:"营销", installed:false, hits:3201  },
    { id:"urgerev",  icon:"🌟", name:"催评引导",  desc:"收货后智能引导好评，提升店铺综合评分",        cat:"营销", installed:false, hits:2876  },
    { id:"cancel",   icon:"❌", name:"取消订单",  desc:"自动处理取消申请，支持挽留话术与条件审批",    cat:"售后", installed:false, hits:1234  },
    { id:"product",  icon:"🔍", name:"商品咨询",  desc:"回答商品详情、尺码、参数等精细化咨询",        cat:"基础", installed:false, hits:5612  },
  ],
  knowledge: [
    { id:1, title:"退换货政策 - 标准流程", langs:["zh","vi","th","id"], health:95, updated:"2小时前", cat:"售后", hits:328  },
    { id:2, title:"发货时效与物流说明",   langs:["zh","vi","en"],      health:78, updated:"1天前",   cat:"物流", hits:201  },
    { id:3, title:"优惠券使用规则",       langs:["zh","th","id","ms"], health:62, updated:"3天前",   cat:"促销", hits:143  },
    { id:4, title:"产品尺寸对照表",       langs:["zh","vi"],           health:45, updated:"7天前",   cat:"产品", hits:87   },
    { id:5, title:"账号安全与登录问题",   langs:["zh","en","id"],      health:88, updated:"5小时前", cat:"账号", hits:119  },
  ],
  members: [
    { id:1, name:"张晓明", email:"zhang@joyserve.ai", role:"超级管理员", status:"online", last:"刚刚",    a:"张" },
    { id:2, name:"李美玲", email:"li@joyserve.ai",    role:"客服主管",   status:"online", last:"5分钟前", a:"李" },
    { id:3, name:"陈大伟", email:"chen@joyserve.ai",  role:"高级客服",   status:"offline",last:"2小时前", a:"陈" },
    { id:4, name:"王小雨", email:"wang@joyserve.ai",  role:"数据分析师", status:"online", last:"10分钟前",a:"王" },
    { id:5, name:"林俊杰", email:"lin@joyserve.ai",   role:"客服专员",   status:"busy",   last:"在线",   a:"林" },
  ],
};
const LANG_FLAG = { zh:"🇨🇳", vi:"🇻🇳", th:"🇹🇭", id:"🇮🇩", ms:"🇲🇾", en:"🇺🇸", fil:"🇵🇭" };

/* ─── Core Primitives ─────────────────────────────────────────────────────── */
function useModal() { const [o,setO]=useState(false); return { open:o, show:()=>setO(true), hide:()=>setO(false) }; }

function useToast() {
  const [t,setT] = useState(null);
  const show = useCallback((text,type="success")=>{ setT({text,type}); },[]);
  return { toast:t, show, hide:()=>setT(null) };
}

/* Modal — clean, generous whitespace */
function Modal({ open, onClose, title, width=520, children, footer }) {
  if (!open) return null;
  return (
    <div style={{position:"fixed",inset:0,zIndex:900,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div onClick={onClose} style={{position:"absolute",inset:0,background:"rgba(17,24,39,0.45)",backdropFilter:"blur(2px)"}}/>
      <div style={{position:"relative",width,maxWidth:"92vw",maxHeight:"90vh",background:D.bgCard,borderRadius:12,boxShadow:D.s3,display:"flex",flexDirection:"column",overflow:"hidden",border:`1px solid ${D.border}`}}>
        <div style={{padding:"20px 24px 18px",borderBottom:`1px solid ${D.divider}`,display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
          <span style={{fontSize:15,fontWeight:600,color:D.t1,letterSpacing:"-0.15px"}}>{title}</span>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:D.t4,display:"flex",padding:4,borderRadius:6,transition:"color .15s"}}
            onMouseEnter={e=>e.currentTarget.style.color=D.t3} onMouseLeave={e=>e.currentTarget.style.color=D.t4}><X size={16}/></button>
        </div>
        <div style={{padding:24,overflowY:"auto",flex:1}}>{children}</div>
        {footer&&<div style={{padding:"16px 24px",borderTop:`1px solid ${D.divider}`,display:"flex",justifyContent:"flex-end",gap:8,flexShrink:0,background:D.bgSub}}>{footer}</div>}
      </div>
    </div>
  );
}

/* Toast */
function Toast({ msg, onClose }) {
  useEffect(()=>{if(msg){const id=setTimeout(onClose,3200);return()=>clearTimeout(id);}},[msg]);
  if (!msg) return null;
  const c = { success:{bg:"#F0FDF4",border:D.greenEdge,dot:D.green}, error:{bg:D.redPale,border:D.redEdge,dot:D.red}, info:{bg:D.brandPale,border:D.brandEdge,dot:D.brand} }[msg.type]||{bg:D.brandPale,border:D.brandEdge,dot:D.brand};
  return (
    <div style={{position:"fixed",top:64,right:20,zIndex:9999,minWidth:268,background:c.bg,border:`1px solid ${c.border}`,borderRadius:10,padding:"11px 16px",boxShadow:D.s2,display:"flex",alignItems:"center",gap:10,animation:"tsIn .18s ease"}}>
      <span style={{width:7,height:7,borderRadius:"50%",background:c.dot,display:"inline-block",flexShrink:0}}/>
      <span style={{fontSize:13,color:D.t2,flex:1,lineHeight:1.5}}>{msg.text}</span>
      <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:D.t4,display:"flex"}}><X size={13}/></button>
    </div>
  );
}

/* Btn — minimal, flat aesthetic */
function Btn({ v="default", sz="md", onClick, disabled, children, full=false, style:ex={} }) {
  const S = { sm:{h:30,px:10,fs:12,r:6}, md:{h:34,px:14,fs:13,r:7}, lg:{h:40,px:18,fs:14,r:8} }[sz];
  const V = {
    primary : { bg:D.brand,     c:"#fff",  brd:D.brand,     sh:D.sBlue  },
    default : { bg:D.bgCard,    c:D.t2,    brd:D.border,    sh:"none"   },
    ghost   : { bg:D.brandPale, c:D.brand, brd:D.brandEdge, sh:"none"   },
    danger  : { bg:D.redPale,   c:D.red,   brd:D.redEdge,   sh:"none"   },
    sub     : { bg:D.bgSub,     c:D.t3,    brd:D.border,    sh:"none"   },
    text    : { bg:"transparent",c:D.brand,brd:"transparent",sh:"none"  },
  }[v]||{bg:D.bgCard,c:D.t2,brd:D.border,sh:"none"};
  return (
    <button onClick={onClick} disabled={disabled} style={{display:"inline-flex",alignItems:"center",justifyContent:"center",gap:5,height:S.h,padding:`0 ${S.px}px`,borderRadius:S.r,fontSize:S.fs,fontWeight:500,cursor:disabled?"not-allowed":"pointer",border:`1px solid ${V.brd}`,background:V.bg,color:V.c,boxShadow:V.sh,opacity:disabled?.45:1,transition:"all .13s",outline:"none",fontFamily:"inherit",width:full?"100%":"auto",whiteSpace:"nowrap",letterSpacing:"-0.1px",...ex}}>
      {children}
    </button>
  );
}

/* Status chip */
function Chip({ type="slate", children }) {
  const C = {
    success : { bg:D.greenPale, c:D.green, brd:D.greenEdge },
    warning : { bg:D.amberPale, c:D.amber, brd:D.amberEdge },
    danger  : { bg:D.redPale,   c:D.red,   brd:D.redEdge   },
    brand   : { bg:D.brandPale, c:D.brand, brd:D.brandEdge },
    slate   : { bg:D.slatePale, c:D.slate, brd:D.slateEdge },
  }[type]||{bg:D.slatePale,c:D.slate,brd:D.slateEdge};
  return <span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"2px 8px",borderRadius:5,fontSize:11,fontWeight:600,background:C.bg,color:C.c,border:`1px solid ${C.brd}`,letterSpacing:"0.1px",whiteSpace:"nowrap"}}>{children}</span>;
}

/* Card — white surface, diffused shadow */
function Card({ children, pad=20, style:ex={}, onClick }) {
  return <div onClick={onClick} style={{background:D.bgCard,borderRadius:10,border:`1px solid ${D.border}`,boxShadow:D.s1,padding:pad,overflow:"hidden",...ex}}>{children}</div>;
}

/* Inline switch */
function Toggle({ on, onChange }) {
  return (
    <div onClick={()=>onChange(!on)} style={{width:40,height:22,borderRadius:11,background:on?D.brand:D.t5,cursor:"pointer",position:"relative",transition:"background .2s",flexShrink:0}}>
      <div style={{position:"absolute",top:3,left:on?20:3,width:16,height:16,borderRadius:"50%",background:"#fff",transition:"left .2s",boxShadow:"0 1px 3px rgba(0,0,0,0.18)"}}/>
    </div>
  );
}

/* Form field wrapper */
function Field({ label, req, help, children }) {
  return (
    <div style={{marginBottom:18}}>
      {label&&<label style={{display:"block",fontSize:12,fontWeight:500,color:D.t3,marginBottom:6,letterSpacing:"0.2px",textTransform:"uppercase"}}>
        {req&&<span style={{color:D.red,marginRight:2}}>*</span>}{label}
      </label>}
      {children}
      {help&&<div style={{fontSize:12,color:D.t4,marginTop:5,lineHeight:1.5}}>{help}</div>}
    </div>
  );
}

/* Input */
function Input({ value, onChange, placeholder, type="text", prefix, style:ex={} }) {
  return (
    <div style={{display:"flex",alignItems:"center",border:`1px solid ${D.border}`,borderRadius:7,overflow:"hidden",background:D.bgCard,...ex}}>
      {prefix&&<span style={{padding:"0 10px",color:D.t4,borderRight:`1px solid ${D.border}`,background:D.bgSub,fontSize:13,display:"flex",alignItems:"center",alignSelf:"stretch"}}>{prefix}</span>}
      <input type={type} value={value||""} onChange={onChange} placeholder={placeholder} style={{flex:1,border:"none",outline:"none",padding:"9px 11px",fontSize:13,color:D.t2,fontFamily:"inherit",background:"transparent"}}/>
    </div>
  );
}

/* Select */
function Sel({ value, onChange, opts }) {
  return <select value={value||""} onChange={e=>onChange(e.target.value)} style={{width:"100%",padding:"9px 11px",border:`1px solid ${D.border}`,borderRadius:7,fontSize:13,color:D.t2,background:D.bgCard,outline:"none",fontFamily:"inherit",cursor:"pointer"}}>{opts.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}</select>;
}

/* Textarea */
function Textarea({ value, onChange, placeholder, rows=4 }) {
  return <textarea value={value||""} onChange={onChange} placeholder={placeholder} rows={rows} style={{width:"100%",padding:"9px 11px",border:`1px solid ${D.border}`,borderRadius:7,fontSize:13,color:D.t2,background:D.bgCard,outline:"none",resize:"vertical",fontFamily:"inherit",lineHeight:1.7,boxSizing:"border-box"}}/>;
}

/* Tab bar */
function TabBar({ tabs, active, onChange, style:ex={} }) {
  return (
    <div style={{display:"flex",borderBottom:`1px solid ${D.divider}`,...ex}}>
      {tabs.map(t=>(
        <button key={t.k} onClick={()=>onChange(t.k)} style={{padding:"10px 16px",background:"none",border:"none",cursor:"pointer",color:active===t.k?D.brand:D.t4,fontWeight:active===t.k?600:400,borderBottom:`2px solid ${active===t.k?D.brand:"transparent"}`,fontSize:13,transition:"all .15s",marginBottom:-1,fontFamily:"inherit",display:"flex",alignItems:"center",gap:5,whiteSpace:"nowrap"}}>
          {t.l}
          {t.n!=null&&<span style={{padding:"1px 6px",borderRadius:10,background:active===t.k?D.brand:D.bgSub,color:active===t.k?"#fff":D.t4,fontSize:11,fontWeight:700}}>{t.n}</span>}
        </button>
      ))}
    </div>
  );
}

/* Health bar — single blue, desaturated by value */
function HealthBar({ v }) {
  const color = v>=80 ? D.brand : v>=60 ? D.amber : D.red;
  return (
    <div style={{display:"flex",alignItems:"center",gap:8}}>
      <div style={{flex:1,height:5,background:D.bgSub,borderRadius:3,overflow:"hidden"}}>
        <div style={{width:`${v}%`,height:"100%",background:color,borderRadius:3,transition:"width .5s ease"}}/>
      </div>
      <span style={{fontSize:12,color,fontWeight:600,minWidth:30,textAlign:"right"}}>{v}%</span>
    </div>
  );
}

/* Section label with left accent bar */
function SLabel({ children, action }) {
  return (
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
      <div style={{display:"flex",alignItems:"center",gap:9}}>
        <span style={{display:"inline-block",width:3,height:14,borderRadius:2,background:D.brand}}/>
        <span style={{fontSize:13,fontWeight:600,color:D.t1,letterSpacing:"-0.1px"}}>{children}</span>
      </div>
      {action}
    </div>
  );
}

/* Page header */
function PHeader({ title, sub, back, onBack, children }) {
  return (
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        {back&&<Btn v="sub" sz="sm" onClick={onBack}><ArrowLeft size={14}/></Btn>}
        <div>
          <h2 style={{fontSize:20,fontWeight:700,color:D.t1,margin:0,letterSpacing:"-0.4px"}}>{title}</h2>
          {sub&&<p style={{fontSize:13,color:D.t3,margin:"4px 0 0",lineHeight:1.4}}>{sub}</p>}
        </div>
      </div>
      {children&&<div style={{display:"flex",gap:8,alignItems:"center"}}>{children}</div>}
    </div>
  );
}

/* Confirm dialog */
function Confirm({ open, onClose, onConfirm, title, body, dangerous }) {
  if (!open) return null;
  return (
    <Modal open={open} onClose={onClose} title={title} width={400}
      footer={<><Btn onClick={onClose}>取消</Btn><Btn v={dangerous?"danger":"primary"} onClick={()=>{onConfirm();onClose();}}>{dangerous?"确认删除":"确认"}</Btn></>}>
      <p style={{fontSize:14,color:D.t2,lineHeight:1.75,margin:0}}>{body}</p>
    </Modal>
  );
}

/* Recharts custom tooltip — white card */
const CTip = ({ active, payload, label }) => {
  if (!active||!payload?.length) return null;
  return (
    <div style={{background:D.bgCard,border:`1px solid ${D.border}`,borderRadius:8,padding:"10px 14px",boxShadow:D.s2,fontSize:12}}>
      <div style={{color:D.t4,marginBottom:6,fontWeight:500}}>{label}</div>
      {payload.map((p,i)=>(
        <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:2}}>
          <span style={{width:8,height:8,borderRadius:2,background:p.color,display:"inline-block"}}/>
          <span style={{color:D.t3}}>{p.name}：</span>
          <strong style={{color:D.t1}}>{p.value?.toLocaleString()}</strong>
        </div>
      ))}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE: DASHBOARD
═══════════════════════════════════════════════════════════════════════════ */
function Dashboard({ toast }) {
  const [aiQuery, setAiQ] = useState("");
  const [aiAns, setAiAns]   = useState(null);
  const [aiLoad, setAiLoad] = useState(false);
  const [alertsDone, setAlertsDone] = useState({});
  const [alertTab, setAlertTab] = useState("open");
  const [chartRange, setChartRange] = useState("today");

  const QUICK = ["今日有什么运营异常？","AI 覆盖率最低的场景是？","退款趋势本周如何？","本月 ROI 情况？"];
  const askAI = (q=aiQuery) => {
    if (!q.trim()) return;
    setAiLoad(true); setAiAns(null);
    setTimeout(()=>{
      setAiAns(`针对「${q}」的分析：\n\n📊 本周 AI 独立解决率 87.3%，较上周提升 2.1pp，整体运营稳健。\n\n⚠️ 需关注：「取消订单」场景 AI 解决率仅 52%，低于行业均值 19pp。建议完善对应 Skill 的退款边界配置。\n\n✅ 建议行动：① 更新泰语退款话术 ② 检查 Shopee PH 授权状态 ③ 开启「主动关怀」Skill，可减少约 30% 物流投诉`);
      setAiLoad(false);
    }, 1500);
  };

  const KPI = [
    { l:"AI 处理量",     v:"2,847",  delta:"+12.6%", up:true,  Icon:MessageCircle },
    { l:"AI 独立解决率", v:"87.3%",  delta:"+2.1pp", up:true,  Icon:CheckCheck    },
    { l:"AI 成交转化",   v:"23.7%",  delta:"+1.8pp", up:true,  Icon:Zap           },
    { l:"异常会话",      v:"38",     delta:"+5",     up:false, Icon:AlertTriangle  },
  ];
  const KPI2 = [
    { l:"待人工处理",   v:"17",    delta:"+3",    up:false, Icon:Inbox    },
    { l:"平均处理时长", v:"4.2m",  delta:"-0.8m", up:true,  Icon:Clock    },
    { l:"超时未处理",   v:"3",     delta:"+1",    up:false, Icon:AlertCircle },
    { l:"订单纠纷率",   v:"2.1%",  delta:"+0.3pp",up:false, Icon:Flag     },
  ];
  const ALERTS = [
    { id:1, sev:"danger",  tag:"紧急", cat:"会话监控",  time:"3分钟前",  text:"Shopee SG 客诉升级，买家等待已超 47 分钟，请立即介入" },
    { id:2, sev:"warning", tag:"关注", cat:"AI 效果",   time:"1小时前",  text:"TikTok TH「取消订单」场景本周解决率下降 15%，影响 38 条会话" },
    { id:3, sev:"brand",   tag:"提醒", cat:"授权管理",  time:"2小时前",  text:"Shopee PH 店铺 OAuth Token 将在 3 天后到期，请及时续期" },
  ];

  const openAlerts = ALERTS.filter(a=>!alertsDone[a.id]);
  const doneAlerts = ALERTS.filter(a=>alertsDone[a.id]);
  const shown = alertTab==="open" ? openAlerts : doneAlerts;

  return (
    <div style={{display:"flex",flexDirection:"column",gap:28}}>
      {/* AI Ask */}
      <Card pad={24} style={{background:`linear-gradient(160deg,#FFFFFF 50%,${D.brandPale} 150%)`}}>
        <div style={{maxWidth:640,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:20}}>
            <p style={{fontSize:22,fontWeight:700,color:D.t1,margin:0,letterSpacing:"-0.5px"}}>
              向 AI 询问今日运营情况
            </p>
            <p style={{fontSize:13,color:D.t3,marginTop:6}}>基于实时数据，获取业务分析与行动建议</p>
          </div>
          <div style={{border:`1.5px solid ${aiLoad?D.brand:D.border}`,borderRadius:9,overflow:"hidden",transition:"border-color .2s",background:D.bgCard,boxShadow:aiLoad?`0 0 0 3px ${D.brandPale}`:D.s0}}>
            <textarea value={aiQuery} onChange={e=>setAiQ(e.target.value)}
              onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();askAI();}}}
              placeholder="输入任何运营问题，例如：今天有哪些最重要的事项需要处理？" rows={2}
              style={{width:"100%",border:"none",padding:"13px 14px",fontSize:13,color:D.t2,resize:"none",outline:"none",lineHeight:1.7,background:"transparent",boxSizing:"border-box",fontFamily:"inherit"}}/>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 12px",borderTop:`1px solid ${D.divider}`,background:D.bgSub}}>
              <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                {QUICK.map((q,i)=>(
                  <button key={i} onClick={()=>{setAiQ(q);askAI(q);}} style={{padding:"3px 10px",borderRadius:20,border:`1px solid ${D.border}`,background:D.bgCard,color:D.t3,fontSize:11,cursor:"pointer",fontFamily:"inherit",transition:"all .13s"}}>
                    {q}
                  </button>
                ))}
              </div>
              <Btn v="primary" sz="sm" onClick={()=>askAI()} disabled={!aiQuery.trim()}>
                {aiLoad ? <><RefreshCcw size={11} style={{animation:"spin .8s linear infinite"}}/>分析中</> : <><Send size={11}/>发送</>}
              </Btn>
            </div>
          </div>
          {aiAns&&(
            <div style={{marginTop:12,background:D.brandPale,border:`1px solid ${D.brandEdge}`,borderRadius:9,padding:"14px 16px"}}>
              <div style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:D.brand,fontWeight:600,marginBottom:8}}>
                <Bot size={12}/>AI 运营洞察
              </div>
              <p style={{fontSize:13,color:D.t2,lineHeight:1.85,margin:0,whiteSpace:"pre-line"}}>{aiAns}</p>
            </div>
          )}
        </div>
      </Card>

      {/* KPI Row 1 */}
      <div>
        <SLabel action={<Chip type="success"><Activity size={9}/>实时</Chip>}>AI Agent 核心指标</SLabel>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
          {KPI.map((k,i)=>(
            <Card key={i} pad={18}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
                <span style={{fontSize:12,color:D.t3,fontWeight:500,lineHeight:1.4}}>{k.l}</span>
                <div style={{width:34,height:34,borderRadius:8,background:i===0?D.brandPale:D.bgSub,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <k.Icon size={15} color={i===0?D.brand:D.t3}/>
                </div>
              </div>
              <div style={{fontSize:28,fontWeight:700,color:D.t1,lineHeight:1,marginBottom:8,letterSpacing:"-0.6px"}}>{k.v}</div>
              <div style={{display:"flex",alignItems:"center",gap:3,fontSize:12}}>
                {k.up ? <ArrowUpRight size={12} color={D.green}/> : <ArrowDownRight size={12} color={D.red}/>}
                <span style={{color:k.up?D.green:D.red,fontWeight:600}}>{k.delta}</span>
                <span style={{color:D.t4,marginLeft:2}}>vs 昨日</span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* KPI Row 2 */}
      <div>
        <SLabel>人工客服核心指标</SLabel>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
          {KPI2.map((k,i)=>(
            <Card key={i} pad={18}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
                <span style={{fontSize:12,color:D.t3,fontWeight:500}}>{k.l}</span>
                <div style={{width:34,height:34,borderRadius:8,background:D.bgSub,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <k.Icon size={15} color={D.t4}/>
                </div>
              </div>
              <div style={{fontSize:28,fontWeight:700,color:D.t1,lineHeight:1,marginBottom:8,letterSpacing:"-0.6px"}}>{k.v}</div>
              <div style={{display:"flex",alignItems:"center",gap:3,fontSize:12}}>
                {k.up ? <ArrowUpRight size={12} color={D.green}/> : <ArrowDownRight size={12} color={D.red}/>}
                <span style={{color:k.up?D.green:D.red,fontWeight:600}}>{k.delta}</span>
                <span style={{color:D.t4,marginLeft:2}}>vs 昨日</span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Charts + Alerts */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 360px",gap:16}}>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {/* Trend chart */}
          <Card>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <div>
                <p style={{fontSize:14,fontWeight:600,color:D.t1,margin:0}}>会话量趋势</p>
                <p style={{fontSize:12,color:D.t3,margin:"3px 0 0"}}>今日 24 小时</p>
              </div>
              <div style={{display:"flex",gap:5}}>
                {["today","week","month"].map((r,i)=>(
                  <Btn key={r} v={chartRange===r?"ghost":"sub"} sz="sm" onClick={()=>setChartRange(r)}>
                    {["今日","本周","本月"][i]}
                  </Btn>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={168}>
              <AreaChart data={DATA.trend} margin={{top:4,right:4,left:-20,bottom:0}}>
                <defs>
                  <linearGradient id="gAI" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={D.brand} stopOpacity={0.15}/>
                    <stop offset="100%" stopColor={D.brand} stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="gHuman" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={D.brandDim} stopOpacity={0.15}/>
                    <stop offset="100%" stopColor={D.brandDim} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={D.divider} vertical={false}/>
                <XAxis dataKey="t" tick={{fontSize:11,fill:D.t4}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:11,fill:D.t4}} axisLine={false} tickLine={false}/>
                <Tooltip content={<CTip/>}/>
                <Area type="monotone" dataKey="ai" name="AI处理" stroke={D.brand} fill="url(#gAI)" strokeWidth={2} dot={false}/>
                <Area type="monotone" dataKey="h" name="人工处理" stroke={D.brandDim} fill="url(#gHuman)" strokeWidth={2} dot={false}/>
              </AreaChart>
            </ResponsiveContainer>
            <div style={{display:"flex",gap:20,justifyContent:"center",marginTop:12}}>
              {[[D.brand,"AI处理"],[D.brandDim,"人工处理"]].map(([c,l])=>(
                <span key={l} style={{display:"flex",alignItems:"center",gap:5,fontSize:12,color:D.t4}}>
                  <span style={{width:20,height:2.5,borderRadius:2,background:c,display:"inline-block"}}/>{l}
                </span>
              ))}
            </div>
          </Card>

          {/* Bar + Donut */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 200px",gap:14}}>
            <Card>
              <p style={{fontSize:13,fontWeight:600,color:D.t1,margin:"0 0 14px"}}>近 7 天 AI vs 人工</p>
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={DATA.week} barGap={2} barSize={9} margin={{top:0,right:0,left:-28,bottom:0}}>
                  <CartesianGrid strokeDasharray="3 3" stroke={D.divider} vertical={false}/>
                  <XAxis dataKey="d" tick={{fontSize:11,fill:D.t4}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fontSize:11,fill:D.t4}} axisLine={false} tickLine={false}/>
                  <Tooltip content={<CTip/>}/>
                  <Bar dataKey="ai" name="AI处理" fill={D.brand} radius={[3,3,0,0]}/>
                  <Bar dataKey="h"  name="人工处理" fill={D.brandDim} radius={[3,3,0,0]}/>
                </BarChart>
              </ResponsiveContainer>
            </Card>
            <Card>
              <p style={{fontSize:13,fontWeight:600,color:D.t1,margin:"0 0 6px"}}>平台分布</p>
              <ResponsiveContainer width="100%" height={90}>
                <PieChart>
                  <Pie data={DATA.platform} cx="50%" cy="50%" innerRadius={24} outerRadius={42} dataKey="value" paddingAngle={2}>
                    {DATA.platform.map((e,i)=><Cell key={i} fill={e.color} stroke="transparent"/>)}
                  </Pie>
                  <Tooltip content={<CTip/>}/>
                </PieChart>
              </ResponsiveContainer>
              <div style={{display:"flex",flexDirection:"column",gap:5,marginTop:6}}>
                {DATA.platform.map((p,i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",fontSize:11}}>
                    <span style={{display:"flex",alignItems:"center",gap:4,color:D.t3}}>
                      <span style={{width:6,height:6,borderRadius:2,background:p.color,display:"inline-block"}}/>{p.name}
                    </span>
                    <span style={{fontWeight:600,color:D.t2}}>{p.value}%</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Alerts Panel */}
        <Card pad={0} style={{display:"flex",flexDirection:"column"}}>
          <div style={{padding:"16px 20px 0",flexShrink:0}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:14,fontWeight:600,color:D.t1}}>重要提醒</span>
                {openAlerts.length>0&&<span style={{width:18,height:18,borderRadius:9,background:D.red,color:"#fff",fontSize:10,fontWeight:700,display:"inline-flex",alignItems:"center",justifyContent:"center"}}>{openAlerts.length}</span>}
              </div>
              <Btn v="text" sz="sm" onClick={()=>toast.show("已全部标记完成","info")}>全部完成</Btn>
            </div>
            <TabBar tabs={[{k:"open",l:"未处理",n:openAlerts.length},{k:"done",l:"已处理",n:doneAlerts.length}]} active={alertTab} onChange={setAlertTab} style={{marginBottom:0}}/>
          </div>
          <div style={{flex:1,overflowY:"auto",padding:"14px 16px",display:"flex",flexDirection:"column",gap:10}}>
            {shown.map(a=>(
              <div key={a.id} style={{border:`1px solid ${a.sev==="danger"?D.redEdge:D.border}`,borderRadius:9,padding:"12px 14px",background:a.sev==="danger"?D.redPale:D.bgCard}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                  <div style={{display:"flex",gap:5,alignItems:"center"}}>
                    <Chip type={a.sev==="danger"?"danger":a.sev==="warning"?"warning":"brand"}>{a.tag}</Chip>
                    <span style={{fontSize:11,color:D.t4}}>{a.cat} · {a.time}</span>
                  </div>
                  {alertTab==="open"&&<button onClick={()=>{setAlertsDone(p=>({...p,[a.id]:true}));toast.show("已标记处理完成");}} style={{background:"none",border:"none",cursor:"pointer",color:D.t4,display:"flex",padding:2}}><CheckCheck size={13}/></button>}
                </div>
                <p style={{fontSize:12,color:D.t2,lineHeight:1.65,margin:"0 0 8px"}}>{a.text}</p>
                <Btn v="text" sz="sm">查看详情 <ChevronRight size={11}/></Btn>
              </div>
            ))}
            {shown.length===0&&(
              <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8,padding:"40px 0",textAlign:"center"}}>
                <CheckCircle2 size={32} color={D.t5} strokeWidth={1.5}/>
                <span style={{fontSize:12,color:D.t4}}>暂无{alertTab==="open"?"待处理":"已处理"}提醒</span>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE: AI AGENTS (Agent 管理 + 技能市场 + 演练场)
═══════════════════════════════════════════════════════════════════════════ */
function AIAgents({ toast }) {
  const [tab, setTab]       = useState("agents");
  const [agents, setAgents] = useState(DATA.agents);
  const [skills, setSkills] = useState(DATA.skills);
  const [onboarding, setOnboarding] = useState(false);
  const [obStep, setObStep] = useState(1);
  const [obData, setObData] = useState({ scene:"", cat:"", style:"专业礼貌", platforms:[], lang:"auto" });
  const [skillFilter, setSkillFilter] = useState("全部");
  const [playMsgs, setPlayMsgs] = useState([{role:"ai",text:"您好！我是 DuoKe 客服助手，请问有什么可以帮您？"}]);
  const [playInput, setPlayInput] = useState("");
  const [playLoading, setPlayLoading] = useState(false);
  const addModal = useModal(); const editModal = useModal();
  const managerModal = useModal(); const delConf = useModal();
  const [editTarget, setEditTarget] = useState(null);
  const [delTarget, setDelTarget]   = useState(null);
  const [mgr, setMgr] = useState({ refund:100, coupon:20, escalateScore:40, escalateCount:3, wechat:true, system:true });

  const doPlay = () => {
    if (!playInput.trim()) return;
    const u = {role:"user",text:playInput};
    setPlayMsgs(p=>[...p,u]); setPlayInput(""); setPlayLoading(true);
    setTimeout(()=>{
      setPlayMsgs(p=>[...p,{role:"ai",text:`收到您的问题「${u.text}」。\n\n根据当前配置的技能和知识库：订单状态正常，预计 1-2 个工作日发出。如有其他问题请随时告知！\n\n💡 行为解析：已正确触发「订单查询」Skill，语气符合「专业礼貌」设置。`}]);
      setPlayLoading(false);
    }, 1200);
  };

  const SCENE_OPTS = [
    {k:"order",  l:"📦 买家一直问订单/物流", hot:true },
    {k:"refund", l:"💸 退款退货处理太耗时"           },
    {k:"review", l:"⭐ 差评太多没时间回复"            },
    {k:"welcome",l:"👋 新买家没人及时回复"            },
    {k:"urge",   l:"⏰ 催付催评全靠手动"             },
  ];

  /* ── Onboarding ── */
  if (onboarding) return (
    <div style={{maxWidth:600,margin:"0 auto",paddingTop:32}}>
      {/* Steps */}
      <div style={{display:"flex",alignItems:"center",gap:0,marginBottom:36}}>
        {[1,2,3].map((s,i)=>(
          <div key={s} style={{display:"flex",alignItems:"center",flex:i<2?1:0}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:28,height:28,borderRadius:"50%",background:obStep>=s?D.brand:D.bgSub,color:obStep>=s?"#fff":D.t4,fontSize:12,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",border:`2px solid ${obStep>=s?D.brand:D.border}`,transition:"all .2s",flexShrink:0}}>{obStep>s?<Check size={12}/>:s}</div>
              <span style={{fontSize:12,color:obStep>=s?D.t1:D.t4,fontWeight:obStep>=s?500:400,whiteSpace:"nowrap"}}>{{1:"选择场景",2:"配置信息",3:"上线预览"}[s]}</span>
            </div>
            {i<2&&<div style={{flex:1,height:1,background:obStep>s?D.brand:D.border,margin:"0 12px",minWidth:40,transition:"background .2s"}}/>}
          </div>
        ))}
      </div>

      {obStep===1&&(
        <Card>
          <p style={{fontSize:17,fontWeight:700,color:D.t1,margin:"0 0 4px",letterSpacing:"-0.3px"}}>你想先解决哪个最头疼的问题？</p>
          <p style={{fontSize:13,color:D.t3,margin:"0 0 20px"}}>选择后 Agent 会自动预配置对应的技能组合</p>
          <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:24}}>
            {SCENE_OPTS.map(s=>(
              <div key={s.k} onClick={()=>setObData(p=>({...p,scene:s.k}))} style={{padding:"13px 16px",border:`1.5px solid ${obData.scene===s.k?D.brand:D.border}`,borderRadius:9,cursor:"pointer",background:obData.scene===s.k?D.brandPale:D.bgCard,transition:"all .15s",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:13,fontWeight:obData.scene===s.k?600:400,color:D.t2}}>{s.l}</span>
                <div style={{display:"flex",gap:5,alignItems:"center"}}>
                  {s.hot&&<Chip type="brand">最受欢迎</Chip>}
                  {obData.scene===s.k&&<Check size={14} color={D.brand}/>}
                </div>
              </div>
            ))}
          </div>
          <div style={{display:"flex",justifyContent:"flex-end"}}><Btn v="primary" disabled={!obData.scene} onClick={()=>setObStep(2)}>下一步 <ChevronRight size={13}/></Btn></div>
        </Card>
      )}

      {obStep===2&&(
        <Card>
          <p style={{fontSize:17,fontWeight:700,color:D.t1,margin:"0 0 20px",letterSpacing:"-0.3px"}}>告诉 Agent 你的店铺情况</p>
          <Field label="你卖什么类目？" req>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {["女装","3C数码","美妆","食品","家居","运动","其他"].map(c=>(
                <button key={c} onClick={()=>setObData(p=>({...p,cat:c}))} style={{padding:"6px 14px",borderRadius:7,border:`1.5px solid ${obData.cat===c?D.brand:D.border}`,background:obData.cat===c?D.brandPale:D.bgCard,color:obData.cat===c?D.brand:D.t2,fontSize:12,cursor:"pointer",fontFamily:"inherit",fontWeight:obData.cat===c?600:400,transition:"all .13s"}}>{c}</button>
              ))}
            </div>
          </Field>
          <Field label="主要服务平台" req>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {["Shopee","Lazada","TikTok Shop","Tokopedia"].map(p=>{
                const sel=obData.platforms.includes(p);
                return <button key={p} onClick={()=>setObData(prev=>({...prev,platforms:sel?prev.platforms.filter(x=>x!==p):[...prev.platforms,p]}))} style={{padding:"6px 14px",borderRadius:7,border:`1.5px solid ${sel?D.brand:D.border}`,background:sel?D.brandPale:D.bgCard,color:sel?D.brand:D.t2,fontSize:12,cursor:"pointer",fontFamily:"inherit",fontWeight:sel?600:400,transition:"all .13s"}}>{p}</button>;
              })}
            </div>
          </Field>
          <Field label="回复风格">
            <div style={{display:"flex",gap:16}}>
              {["亲切活泼","专业礼貌","简洁高效"].map(s=>(
                <label key={s} style={{display:"flex",alignItems:"center",gap:5,cursor:"pointer",fontSize:13,color:D.t2}}>
                  <input type="radio" checked={obData.style===s} onChange={()=>setObData(p=>({...p,style:s}))} style={{accentColor:D.brand}}/>{s}
                </label>
              ))}
            </div>
          </Field>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:8}}>
            <Btn v="sub" onClick={()=>setObStep(1)}><ArrowLeft size={13}/>上一步</Btn>
            <Btn v="primary" disabled={!obData.cat||obData.platforms.length===0} onClick={()=>setObStep(3)}>下一步 <ChevronRight size={13}/></Btn>
          </div>
        </Card>
      )}

      {obStep===3&&(
        <Card>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
            <div style={{width:44,height:44,borderRadius:11,background:D.brandPale,display:"flex",alignItems:"center",justifyContent:"center"}}><Bot size={20} color={D.brand}/></div>
            <div><p style={{fontSize:15,fontWeight:700,color:D.t1,margin:0}}>你的第一个 Agent 已就绪！</p><p style={{fontSize:12,color:D.t3,margin:"3px 0 0"}}>智能接待员 · {obData.platforms.join(" / ")}</p></div>
          </div>
          <div style={{background:D.bgSub,borderRadius:9,padding:"14px 16px",marginBottom:18}}>
            <p style={{fontSize:11,fontWeight:600,color:D.t4,margin:"0 0 10px",textTransform:"uppercase",letterSpacing:"0.5px"}}>已自动配置</p>
            {[["📦 订单查询","接入 "+obData.platforms.join(" / ")+" 订单系统"],["🚚 物流追踪","支持主流物流商，自动处理异常"],["🎉 欢迎接待","根据「"+obData.cat+"」类目生成欢迎语"],["😊 情感分析","4级情绪识别，高风险自动升级"],["🌐 多语言","自动识别买家语言，支持7种东南亚语言"]].map(([k,v])=>(
              <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${D.divider}`}}>
                <span style={{fontSize:12,color:D.t2}}>{k}</span>
                <span style={{fontSize:11,color:D.t4}}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{display:"flex",justifyContent:"space-between"}}>
            <Btn v="ghost" sz="md">
              <FlaskConical size={13}/>预览对话效果
            </Btn>
            <Btn v="primary" onClick={()=>{setAgents(p=>[...p,{id:Date.now(),name:"智能接待员",sub:"欢迎接待 · 订单查询 · 物流追踪",platform:obData.platforms[0]||"Shopee",status:"running",sessions:0,rate:0,skills:["欢迎接待","订单查询","物流追踪","情感分析"]}]);setOnboarding(false);toast.show("Agent 已上线，开始接待买家！");}}>
              <Zap size={13}/>立即上线
            </Btn>
          </div>
        </Card>
      )}
      <button onClick={()=>setOnboarding(false)} style={{background:"none",border:"none",cursor:"pointer",color:D.t4,fontSize:12,marginTop:16,display:"flex",alignItems:"center",gap:4,fontFamily:"inherit"}}><ArrowLeft size={12}/>返回 Agent 列表</button>
    </div>
  );

  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <PHeader title="AI 客服中心" sub="Agent 管理 · 技能市场 · 演练场">
        <Btn v="sub" onClick={managerModal.show}><Shield size={13}/>Manager 配置</Btn>
        <Btn v="ghost" onClick={()=>{setOnboarding(true);setObStep(1);setObData({scene:"",cat:"",style:"专业礼貌",platforms:[],lang:"auto"});}}><Sparkles size={13}/>5 分钟快速接入</Btn>
        <Btn v="primary" onClick={addModal.show}><Plus size={13}/>新建 Agent</Btn>
      </PHeader>

      <TabBar tabs={[{k:"agents",l:"我的 Agent",n:agents.length},{k:"skills",l:"技能市场",n:skills.filter(s=>s.installed).length+"/"+skills.length},{k:"playground",l:"演练场"}]} active={tab} onChange={setTab} style={{marginBottom:20}}/>

      {/* ── My Agents ── */}
      {tab==="agents"&&(
        <>
          {/* Manager Banner */}
          <div style={{background:D.brand,borderRadius:10,padding:"16px 22px",display:"flex",justifyContent:"space-between",alignItems:"center",boxShadow:D.sBlue,marginBottom:4}}>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <div style={{width:42,height:42,borderRadius:10,background:"rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center"}}><Shield size={20} color="#fff"/></div>
              <div>
                <p style={{fontSize:14,fontWeight:600,color:"#fff",margin:0}}>客服主管 Agent（Manager Layer）</p>
                <p style={{fontSize:12,color:"rgba(255,255,255,0.72)",margin:"3px 0 0"}}>统一协调子 Agent · 退款审批 $100 · 情绪熔断 40分 · 智能软着陆转人工</p>
              </div>
            </div>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <span style={{fontSize:11,background:"rgba(255,255,255,0.18)",border:"1px solid rgba(255,255,255,0.3)",borderRadius:6,padding:"3px 10px",color:"#fff",display:"flex",alignItems:"center",gap:4}}><Activity size={10}/>运行中</span>
              <Btn style={{background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.35)",color:"#fff"}} sz="sm" onClick={managerModal.show}><Edit3 size={11}/>配置</Btn>
            </div>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:14}}>
            {agents.map(a=>(
              <Card key={a.id} pad={20}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
                  <div style={{display:"flex",alignItems:"center",gap:11}}>
                    <div style={{width:42,height:42,borderRadius:10,background:a.status==="running"?D.brandPale:D.bgSub,display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <Bot size={18} color={a.status==="running"?D.brand:D.t4}/>
                    </div>
                    <div>
                      <p style={{fontSize:14,fontWeight:600,color:D.t1,margin:0}}>{a.name}</p>
                      <p style={{fontSize:11,color:D.t4,margin:"3px 0 0"}}>{a.platform}</p>
                    </div>
                  </div>
                  <Chip type={a.status==="running"?"success":a.status==="paused"?"warning":"slate"}>{a.status==="running"?"运行中":a.status==="paused"?"已暂停":"草稿"}</Chip>
                </div>
                <p style={{fontSize:12,color:D.t3,margin:"0 0 12px",lineHeight:1.55}}>{a.sub}</p>
                <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:14}}>
                  {a.skills.map(s=><span key={s} style={{padding:"2px 8px",borderRadius:4,background:D.bgSub,border:`1px solid ${D.border}`,fontSize:11,color:D.t3}}>{s}</span>)}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:14}}>
                  {[["今日会话",a.sessions],["解决率",a.sessions>0?`${a.rate}%`:"—"],["状态",a.status==="running"?"正常":a.status==="paused"?"暂停":"未启动"]].map(([l,v],i)=>(
                    <div key={i} style={{background:D.bgSub,borderRadius:7,padding:"8px 10px"}}>
                      <p style={{fontSize:11,color:D.t4,margin:"0 0 3px"}}>{l}</p>
                      <p style={{fontSize:15,fontWeight:600,color:D.t1,margin:0}}>{v}</p>
                    </div>
                  ))}
                </div>
                <div style={{display:"flex",gap:6}}>
                  <Btn v={a.status==="running"?"default":"ghost"} sz="sm" onClick={()=>{setAgents(p=>p.map(x=>x.id===a.id?{...x,status:x.status==="running"?"paused":"running"}:x));toast.show(`Agent 已${a.status==="running"?"暂停":"启动"}`,"info");}}>
                    {a.status==="running"?<><Pause size={11}/>暂停</>:<><Play size={11}/>启动</>}
                  </Btn>
                  <Btn v="sub" sz="sm" onClick={()=>{setTab("playground");}}><FlaskConical size={11}/>演练</Btn>
                  <Btn v="sub" sz="sm" onClick={()=>{setEditTarget({...a});editModal.show();}}><Edit3 size={11}/>配置</Btn>
                  <Btn v="danger" sz="sm" onClick={()=>{setDelTarget(a);delConf.show();}}><Trash2 size={11}/></Btn>
                </div>
              </Card>
            ))}
            {/* Add card */}
            <div onClick={()=>{setOnboarding(true);setObStep(1);}} style={{border:`1.5px dashed ${D.border}`,borderRadius:10,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:9,minHeight:220,cursor:"pointer",transition:"all .2s",color:D.t4}} onMouseEnter={e=>{e.currentTarget.style.borderColor=D.brand;e.currentTarget.style.background=D.brandPale;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=D.border;e.currentTarget.style.background="transparent";}}>
              <div style={{width:40,height:40,borderRadius:10,background:D.bgSub,display:"flex",alignItems:"center",justifyContent:"center"}}><Plus size={18}/></div>
              <p style={{fontSize:13,fontWeight:500,margin:0}}>新建 Agent</p>
              <p style={{fontSize:11,color:D.t5,margin:0}}>5 分钟快速上线</p>
            </div>
          </div>
        </>
      )}

      {/* ── Skill Market ── */}
      {tab==="skills"&&(
        <>
          <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:4}}>
            {["全部","基础","售后","营销","智能"].map(f=>(
              <button key={f} onClick={()=>setSkillFilter(f)} style={{padding:"5px 13px",borderRadius:6,border:`1px solid ${skillFilter===f?D.brand:D.border}`,background:skillFilter===f?D.brandPale:D.bgCard,color:skillFilter===f?D.brand:D.t3,fontSize:12,cursor:"pointer",fontFamily:"inherit",fontWeight:skillFilter===f?600:400,transition:"all .13s"}}>{f}</button>
            ))}
            <span style={{marginLeft:"auto",fontSize:12,color:D.t4}}>{skills.filter(s=>s.installed).length} 个已安装 / 共 {skills.length} 个</span>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
            {skills.filter(s=>skillFilter==="全部"||s.cat===skillFilter).map(sk=>(
              <Card key={sk.id} pad={18}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <span style={{fontSize:22,lineHeight:1}}>{sk.icon}</span>
                    <div>
                      <p style={{fontSize:13,fontWeight:600,color:D.t1,margin:0}}>{sk.name}</p>
                      <span style={{fontSize:11,color:D.t4}}>{sk.cat}</span>
                    </div>
                  </div>
                  {sk.installed&&<Chip type="success"><Check size={9}/>已安装</Chip>}
                </div>
                <p style={{fontSize:12,color:D.t3,lineHeight:1.6,margin:"0 0 12px"}}>{sk.desc}</p>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontSize:11,color:D.t5}}>{sk.hits.toLocaleString()} 次调用</span>
                  <div style={{display:"flex",gap:5}}>
                    {sk.installed
                      ? <><Btn v="sub" sz="sm"><Edit3 size={11}/>配置</Btn><Btn v="danger" sz="sm" onClick={()=>{setSkills(p=>p.map(s=>s.id===sk.id?{...s,installed:false}:s));toast.show(`${sk.name} 已卸载`,"info");}}><Minus size={11}/></Btn></>
                      : <Btn v="ghost" sz="sm" onClick={()=>{setSkills(p=>p.map(s=>s.id===sk.id?{...s,installed:true}:s));toast.show(`${sk.name} 安装成功`);}}><Plus size={11}/>安装</Btn>
                    }
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* ── Playground ── */}
      {tab==="playground"&&(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,height:"calc(100vh - 300px)",minHeight:480}}>
          <Card pad={0} style={{display:"flex",flexDirection:"column"}}>
            <div style={{padding:"12px 16px",borderBottom:`1px solid ${D.divider}`,display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <span style={{fontSize:13,fontWeight:600,color:D.t1}}>对话预览</span>
                <select style={{padding:"4px 8px",border:`1px solid ${D.border}`,borderRadius:6,fontSize:12,color:D.t2,background:D.bgCard,outline:"none",fontFamily:"inherit"}}>
                  <option>接待专员</option><option>售后主管</option>
                </select>
              </div>
              <Chip type="success"><Activity size={9}/>模拟中</Chip>
            </div>
            <div style={{flex:1,overflowY:"auto",padding:"16px",display:"flex",flexDirection:"column",gap:12,background:D.bgSub}}>
              {playMsgs.map((m,i)=>(
                <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",gap:8}}>
                  {m.role==="ai"&&<div style={{width:26,height:26,borderRadius:"50%",background:D.brandPale,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Bot size={13} color={D.brand}/></div>}
                  <div style={{maxWidth:"80%",padding:"9px 13px",borderRadius:m.role==="user"?"11px 11px 3px 11px":"3px 11px 11px 11px",background:m.role==="user"?D.brand:D.bgCard,border:m.role==="user"?"none":`1px solid ${D.border}`,color:m.role==="user"?"#fff":D.t2,fontSize:12,lineHeight:1.7,whiteSpace:"pre-line"}}>{m.text}</div>
                </div>
              ))}
              {playLoading&&<div style={{display:"flex",gap:8}}><div style={{width:26,height:26,borderRadius:"50%",background:D.brandPale,display:"flex",alignItems:"center",justifyContent:"center"}}><Bot size={13} color={D.brand}/></div><div style={{padding:"9px 13px",background:D.bgCard,border:`1px solid ${D.border}`,borderRadius:"3px 11px 11px 11px",display:"flex",gap:3,alignItems:"center"}}>{[0,1,2].map(i=><span key={i} style={{width:5,height:5,borderRadius:"50%",background:D.brand,display:"inline-block",animation:`bounce .7s ${i*.15}s infinite`}}/>)}</div></div>}
            </div>
            <div style={{padding:"10px 14px",borderTop:`1px solid ${D.divider}`,flexShrink:0,background:D.bgCard}}>
              <div style={{display:"flex",gap:6}}>
                <input value={playInput} onChange={e=>setPlayInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")doPlay();}} placeholder="模拟买家消息，回车发送…" style={{flex:1,padding:"8px 11px",background:D.bgSub,border:`1px solid ${D.border}`,borderRadius:7,color:D.t2,fontSize:12,outline:"none",fontFamily:"inherit"}}/>
                <Btn v="primary" sz="sm" onClick={doPlay}><Send size={12}/></Btn>
                <Btn v="sub" sz="sm" onClick={()=>setPlayMsgs([{role:"ai",text:"您好！我是 DuoKe 客服助手，请问有什么可以帮您？"}])}><RotateCcw size={12}/></Btn>
              </div>
            </div>
          </Card>
          <Card pad={0} style={{display:"flex",flexDirection:"column"}}>
            <div style={{padding:"12px 16px",borderBottom:`1px solid ${D.divider}`,flexShrink:0}}>
              <p style={{fontSize:13,fontWeight:600,color:D.t1,margin:0}}>行为解析 <span style={{fontSize:11,color:D.t4,fontWeight:400}}>· 演练模式专属</span></p>
            </div>
            <div style={{flex:1,overflowY:"auto",padding:16,display:"flex",flexDirection:"column",gap:10}}>
              {[
                {Icon:CheckCircle2,c:D.green, t:"技能触发正确",  d:"检测到「订单查询」意图，触发对应 Skill，调用平台订单 API"},
                {Icon:CheckCircle2,c:D.green, t:"语气符合设置",  d:"使用「专业礼貌」风格，语句完整，无过度口语化表达"},
                {Icon:AlertTriangle,c:D.amber,t:"优化建议",       d:"可主动提供物流单号和预计到达时间，进一步提升买家体验"},
                {Icon:Info,        c:D.brand, t:"情感状态",       d:"买家情绪评分：72分（正常），无需触发升级机制"},
              ].map((item,i)=>(
                <div key={i} style={{background:D.bgSub,borderRadius:9,padding:"11px 14px",display:"flex",gap:10}}>
                  <item.Icon size={14} color={item.c} style={{flexShrink:0,marginTop:1}}/>
                  <div>
                    <p style={{fontSize:12,fontWeight:600,color:D.t1,margin:"0 0 3px"}}>{item.t}</p>
                    <p style={{fontSize:12,color:D.t3,margin:0,lineHeight:1.6}}>{item.d}</p>
                  </div>
                </div>
              ))}
              <div style={{padding:"12px 14px",background:D.brandPale,border:`1px solid ${D.brandEdge}`,borderRadius:9}}>
                <p style={{fontSize:11,color:D.brand,fontWeight:600,margin:"0 0 6px"}}>💡 推荐测试场景</p>
                {["发送一个退款申请，查看 Manager 是否介入","用激烈情绪抱怨，测试情感分析级别","询问库存，测试商品数据同步效果"].map((s,i)=>(
                  <div key={i} onClick={()=>setPlayInput(s)} style={{fontSize:12,color:D.t3,padding:"5px 0",borderTop:i>0?`1px solid ${D.brandEdge}`:"none",cursor:"pointer"}}>{s}</div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Modals */}
      <Modal open={managerModal.open} onClose={managerModal.hide} title="客服主管 Agent（Manager）配置" width={560}
        footer={<><Btn onClick={managerModal.hide}>取消</Btn><Btn v="primary" onClick={()=>{managerModal.hide();toast.show("Manager 配置已保存");}}>保存</Btn></>}>
        <div style={{background:D.brandPale,border:`1px solid ${D.brandEdge}`,borderRadius:9,padding:"12px 14px",marginBottom:20,fontSize:12,color:D.t2,lineHeight:1.7}}>
          <strong style={{color:D.brand}}>Manager Agent</strong> 是子 Agent 的上层协调者，拦截无法自动处理的情况，有退款审批和情感熔断权限，仅在必要时才转人工，并提供完整分析摘要。
        </div>
        {[{section:"自主审批权限",Icon:Award,fields:[{l:"退款自动审批上限",k:"refund",suf:"美元"},{l:"优惠券发放上限",k:"coupon",suf:"美元"}]},{section:"主管介入阈值",Icon:Workflow,fields:[{l:"买家情绪评分低于",k:"escalateScore",suf:"分"},{l:"子 Agent 连续失败次数",k:"escalateCount",suf:"次"}]}].map(({section,Icon,fields})=>(
          <div key={section} style={{marginBottom:20}}>
            <div style={{fontSize:12,fontWeight:600,color:D.t3,marginBottom:12,display:"flex",alignItems:"center",gap:5,textTransform:"uppercase",letterSpacing:"0.5px"}}><Icon size={12}/>{section}</div>
            {fields.map(f=>(
              <div key={f.k} style={{display:"grid",gridTemplateColumns:"1fr 160px",gap:12,alignItems:"center",marginBottom:10}}>
                <span style={{fontSize:13,color:D.t2}}>{f.l}</span>
                <Input value={mgr[f.k]} onChange={e=>setMgr(p=>({...p,[f.k]:e.target.value}))} style={{}} placeholder="" />
              </div>
            ))}
          </div>
        ))}
        <div style={{marginBottom:20}}>
          <div style={{fontSize:12,fontWeight:600,color:D.t3,marginBottom:12,textTransform:"uppercase",letterSpacing:"0.5px"}}>告警通知</div>
          {[{l:"微信 / 钉钉推送",k:"wechat"},{l:"系统弹窗通知",k:"system"}].map(item=>(
            <div key={item.k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${D.divider}`}}>
              <span style={{fontSize:13,color:D.t2}}>{item.l}</span>
              <Toggle on={mgr[item.k]} onChange={v=>setMgr(p=>({...p,[item.k]:v}))}/>
            </div>
          ))}
        </div>
        <div style={{background:D.redPale,border:`1px solid ${D.redEdge}`,borderRadius:9,padding:"12px 14px"}}>
          <p style={{fontSize:11,fontWeight:600,color:D.red,margin:"0 0 6px"}}>以下情况直接转人工（不可关闭）</p>
          {["买家明确强烈要求人工","涉及法律纠纷（律师 / 法院 / 起诉）","平台已启动官方纠纷流程","退款金额超过最高授权上限"].map((s,i)=>(
            <div key={i} style={{fontSize:12,color:D.t3,display:"flex",gap:6,marginBottom:3}}><Lock size={10} color={D.red} style={{marginTop:1,flexShrink:0}}/>{s}</div>
          ))}
        </div>
      </Modal>

      <Modal open={addModal.open} onClose={addModal.hide} title="新建 Agent" width={500}
        footer={<><Btn onClick={addModal.hide}>取消</Btn><Btn v="primary" onClick={()=>{addModal.hide();toast.show("Agent 创建成功，当前为草稿状态");}}>创建</Btn></>}>
        <Field label="Agent 名称" req><Input placeholder="例：售后专员"/></Field>
        <Field label="服务平台" req><Sel value="" onChange={()=>{}} opts={[{v:"",l:"请选择平台"},{v:"1",l:"Shopee VN"},{v:"2",l:"Lazada MY"},{v:"3",l:"TikTok Shop"},{v:"4",l:"全平台"}]}/></Field>
        <Field label="回复风格"><Sel value="" onChange={()=>{}} opts={[{v:"专业",l:"专业礼貌（推荐）"},{v:"活泼",l:"亲切活泼"},{v:"简洁",l:"简洁高效"}]}/></Field>
        <Field label="已安装技能（可在技能市场修改）">
          <div style={{display:"flex",flexDirection:"column",gap:5}}>
            {DATA.skills.filter(s=>s.installed).map(s=>(
              <label key={s.id} style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:13,color:D.t2,padding:"7px 10px",background:D.bgSub,borderRadius:7}}>
                <input type="checkbox" defaultChecked style={{accentColor:D.brand}}/>{s.icon} {s.name}
                <span style={{marginLeft:"auto",fontSize:11,color:D.t4}}>{s.cat}</span>
              </label>
            ))}
          </div>
        </Field>
      </Modal>

      <Modal open={editModal.open} onClose={editModal.hide} title="Agent 配置" width={500}
        footer={<><Btn onClick={editModal.hide}>取消</Btn><Btn v="primary" onClick={()=>{editModal.hide();toast.show("配置已保存");}}>保存</Btn></>}>
        {editTarget&&(
          <>
            <Field label="Agent 名称"><Input value={editTarget.name} onChange={e=>setEditTarget(p=>({...p,name:e.target.value}))}/></Field>
            <Field label="服务平台"><Input value={editTarget.platform} onChange={e=>setEditTarget(p=>({...p,platform:e.target.value}))}/></Field>
            <div style={{fontSize:12,fontWeight:600,color:D.t3,marginBottom:12,textTransform:"uppercase",letterSpacing:"0.5px"}}>功能开关</div>
            {[["主动关怀","收货后自动关怀消息",true],["情感升级","高风险情绪自动转 Manager",true],["知识库同步","从知识库检索回答依据",true],["营销触达","合适时机推送优惠",false]].map(([l,d,def])=>{
              const [on,setOn]=useState(def);
              return <div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 0",borderBottom:`1px solid ${D.divider}`}}><div><p style={{fontSize:13,fontWeight:500,color:D.t1,margin:0}}>{l}</p><p style={{fontSize:12,color:D.t4,margin:"2px 0 0"}}>{d}</p></div><Toggle on={on} onChange={v=>{setOn(v);toast.show(`${l}已${v?"开启":"关闭"}`,"info");}}/></div>;
            })}
          </>
        )}
      </Modal>

      <Confirm open={delConf.open} onClose={delConf.hide} onConfirm={()=>{setAgents(p=>p.filter(a=>a.id!==delTarget?.id));toast.show("Agent 已删除","info");}} title="删除 Agent" body={`确认删除「${delTarget?.name}」？该 Agent 将停止服务，历史数据保留 30 天。`} dangerous/>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE: CONSOLE
═══════════════════════════════════════════════════════════════════════════ */
function Console({ toast }) {
  const [activeS, setActiveS] = useState(DATA.sessions[0]);
  const [msgs, setMsgs]       = useState(DATA.chat);
  const [input, setInput]     = useState("");
  const [filter, setFilter]   = useState("all");
  const [takeover, setTakeover] = useState(false);
  const [showRP, setShowRP]   = useState(true);
  const [toolExpanded, setToolExp] = useState({});
  const takeoverM = useModal(); const qrM = useModal(); const transM = useModal();
  const [selQR, setSelQR] = useState("");
  const endRef = useRef(null);
  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:"smooth"}); },[msgs]);

  const QR = ["感谢您的耐心等待，我来为您查询。","非常抱歉给您带来不便，我会立即处理。","您的订单已发货，请耐心等待。","请问您方便提供一下订单号吗？","如需帮助，请随时联系我们。"];
  const filtered = filter==="all" ? DATA.sessions : DATA.sessions.filter(s=>s.status===filter);

  const send = () => {
    if (!input.trim()) return;
    setMsgs(p=>[...p,{id:Date.now(),role:takeover?"human":"buyer",text:input,time:new Date().toLocaleTimeString("zh-CN",{hour:"2-digit",minute:"2-digit"})}]);
    setInput("");
  };

  return (
    <div style={{display:"flex",height:"calc(100vh - 110px)",background:D.bgCard,borderRadius:10,border:`1px solid ${D.border}`,boxShadow:D.s1,overflow:"hidden"}}>

      {/* Session list */}
      <div style={{width:260,borderRight:`1px solid ${D.border}`,display:"flex",flexDirection:"column",flexShrink:0}}>
        <div style={{padding:"12px 12px 10px",borderBottom:`1px solid ${D.divider}`}}>
          <div style={{position:"relative",marginBottom:8}}>
            <Search size={12} style={{position:"absolute",left:9,top:"50%",transform:"translateY(-50%)",color:D.t4}}/>
            <input placeholder="搜索会话…" style={{width:"100%",padding:"7px 9px 7px 28px",background:D.bgSub,border:`1px solid ${D.border}`,borderRadius:7,color:D.t2,fontSize:12,outline:"none",boxSizing:"border-box",fontFamily:"inherit"}}/>
          </div>
          <div style={{display:"flex",gap:3}}>
            {[{k:"all",l:"全部"},{k:"ai",l:"AI"},{k:"human",l:"人工"},{k:"pending",l:"待处理"}].map(f=>(
              <button key={f.k} onClick={()=>setFilter(f.k)} style={{flex:1,padding:"5px 2px",borderRadius:5,fontSize:11,cursor:"pointer",background:filter===f.k?D.brand:"transparent",color:filter===f.k?"#fff":D.t4,border:`1px solid ${filter===f.k?D.brand:D.border}`,fontWeight:filter===f.k?600:400,transition:"all .13s",fontFamily:"inherit"}}>{f.l}</button>
            ))}
          </div>
        </div>
        <div style={{flex:1,overflowY:"auto"}}>
          {filtered.map(s=>(
            <div key={s.id} onClick={()=>setActiveS(s)} style={{padding:"10px 12px",cursor:"pointer",borderBottom:`1px solid ${D.divider}`,background:activeS?.id===s.id?D.brandPale:"transparent",borderLeft:`2.5px solid ${activeS?.id===s.id?D.brand:"transparent"}`,transition:"all .13s"}}>
              <div style={{display:"flex",gap:8}}>
                <div style={{position:"relative",flexShrink:0}}>
                  <div style={{width:34,height:34,borderRadius:"50%",background:D.bgSub,color:D.t3,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:600}}>{s.avatar}</div>
                  {s.urgent&&<span style={{position:"absolute",top:-1,right:-1,width:9,height:9,borderRadius:"50%",background:D.red,border:`2px solid ${D.bgCard}`}}/>}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
                    <span style={{fontSize:12,fontWeight:600,color:D.t1}}>{s.buyer}</span>
                    <span style={{fontSize:10,color:D.t4}}>{s.time}</span>
                  </div>
                  <div style={{fontSize:10,color:D.t4,marginBottom:2}}>{s.flag} {s.platform}</div>
                  <div style={{fontSize:11,color:D.t3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.msg}</div>
                </div>
                {s.unread>0&&<div style={{width:16,height:16,borderRadius:8,background:D.red,color:"#fff",fontSize:10,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2}}>{s.unread}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div style={{flex:1,display:"flex",flexDirection:"column",background:D.bgSub,minWidth:0}}>
        {/* Chat header */}
        <div style={{padding:"0 18px",height:52,borderBottom:`1px solid ${D.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",background:D.bgCard,flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:32,height:32,borderRadius:"50%",background:D.bgSub,color:D.t3,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:600,fontSize:12}}>{activeS?.avatar}</div>
            <div>
              <p style={{fontSize:13,fontWeight:600,color:D.t1,margin:0}}>{activeS?.buyer}</p>
              <p style={{fontSize:11,color:D.t4,margin:0}}>{activeS?.flag} · {activeS?.platform} · {activeS?.order}</p>
            </div>
          </div>
          <div style={{display:"flex",gap:6,alignItems:"center"}}>
            <Chip type={takeover?"warning":"brand"}>{takeover?"人工模式":"AI 处理中"}</Chip>
            {takeover
              ? <Btn v="ghost" sz="sm" onClick={()=>{setTakeover(false);toast.show("已移交 AI","info");}}><Bot size={11}/>移交 AI</Btn>
              : <Btn v="danger" sz="sm" onClick={takeoverM.show}><User size={11}/>人工接管</Btn>
            }
            <Btn v="sub" sz="sm" onClick={transM.show}><ChevronRight size={11}/>转接</Btn>
            <button onClick={()=>setShowRP(p=>!p)} style={{width:28,height:28,border:`1px solid ${D.border}`,borderRadius:6,background:showRP?D.brandPale:D.bgCard,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:showRP?D.brand:D.t4}}>
              <Activity size={13}/>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div style={{flex:1,overflowY:"auto",padding:"16px 20px",display:"flex",flexDirection:"column",gap:12}}>
          {msgs.map(m=>(
            <div key={m.id}>
              {m.role==="tool"&&(
                <div style={{display:"flex",justifyContent:"center",marginBottom:4}}>
                  <div onClick={()=>setToolExp(p=>({...p,[m.id]:!p[m.id]}))} style={{background:D.bgCard,border:`1px solid ${D.border}`,borderRadius:7,padding:"5px 12px",fontSize:11,color:D.t4,display:"flex",alignItems:"center",gap:5,cursor:"pointer"}}>
                    <Cpu size={10} color={D.amber}/><span style={{color:D.amber,fontWeight:600}}>工具调用：</span>{m.fn}
                    {toolExpanded[m.id]?<ChevronUp size={10}/>:<ChevronDown size={10}/>}
                  </div>
                </div>
              )}
              {m.role==="tool"&&toolExpanded[m.id]&&(
                <div style={{display:"flex",justifyContent:"center",marginBottom:8}}>
                  <div style={{background:D.bgSub,border:`1px solid ${D.border}`,borderRadius:7,padding:"7px 13px",fontSize:11,fontFamily:"monospace",color:D.t3,maxWidth:480}}>{m.result}</div>
                </div>
              )}
              {m.role!=="tool"&&(
                <div style={{display:"flex",justifyContent:m.role==="buyer"?"flex-end":"flex-start",gap:8}}>
                  {m.role!=="buyer"&&<div style={{width:26,height:26,borderRadius:"50%",background:m.role==="ai"?D.brandPale:D.greenPale,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{m.role==="ai"?<Bot size={12} color={D.brand}/>:<User size={12} color={D.green}/>}</div>}
                  <div style={{maxWidth:"72%"}}>
                    {m.role==="ai"&&<p style={{fontSize:10,color:D.t4,margin:"0 0 3px",display:"flex",alignItems:"center",gap:3}}><Zap size={9} color={D.brand}/>AI Agent · {m.time}</p>}
                    {m.role==="human"&&<p style={{fontSize:10,color:D.t4,margin:"0 0 3px"}}>人工客服 · {m.time}</p>}
                    <div style={{padding:"9px 13px",borderRadius:m.role==="buyer"?"11px 11px 3px 11px":"3px 11px 11px 11px",background:m.role==="buyer"?D.brand:D.bgCard,border:m.role==="buyer"?"none":`1px solid ${D.border}`,color:m.role==="buyer"?"#fff":D.t2,fontSize:12,lineHeight:1.7,whiteSpace:"pre-line",boxShadow:m.role==="ai"?D.s0:"none"}}>{m.text}</div>
                    {m.role==="buyer"&&<p style={{fontSize:10,color:D.t4,margin:"3px 0 0",textAlign:"right"}}>{m.time}</p>}
                  </div>
                </div>
              )}
            </div>
          ))}
          <div ref={endRef}/>
        </div>

        {/* Input */}
        <div style={{padding:"10px 16px",borderTop:`1px solid ${D.border}`,background:D.bgCard,flexShrink:0}}>
          <div style={{border:`1px solid ${D.border}`,borderRadius:8,overflow:"hidden"}}>
            <textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}} placeholder={takeover?"以人工身份回复…":"输入消息…"} rows={3} style={{width:"100%",border:"none",padding:"10px 13px",color:D.t2,fontSize:12,resize:"none",outline:"none",lineHeight:1.6,background:"transparent",boxSizing:"border-box",fontFamily:"inherit"}}/>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 11px",borderTop:`1px solid ${D.divider}`,background:D.bgSub}}>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                {[Paperclip,Image,Smile].map((Icon,i)=><button key={i} style={{background:"none",border:"none",cursor:"pointer",color:D.t4,display:"flex",padding:2}}><Icon size={14}/></button>)}
                <span style={{width:1,height:13,background:D.border,display:"inline-block"}}/>
                <Btn v="text" sz="sm" onClick={qrM.show}>快捷回复</Btn>
              </div>
              <div style={{display:"flex",gap:5,alignItems:"center"}}>
                <span style={{fontSize:11,color:D.t5}}>⏎ 发送</span>
                <Btn v="primary" sz="sm" onClick={send}><Send size={12}/>发送</Btn>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      {showRP&&(
        <div style={{width:248,borderLeft:`1px solid ${D.border}`,background:D.bgCard,overflowY:"auto",flexShrink:0}}>
          <div style={{padding:"0 14px",borderBottom:`1px solid ${D.border}`}}>
            <TabBar tabs={[{k:"buyer",l:"买家"},{k:"ai",l:"AI 建议"}]} active="buyer" onChange={()=>{}} style={{marginBottom:0}}/>
          </div>
          <div style={{padding:14,display:"flex",flexDirection:"column",gap:0}}>
            {[["姓名","Nguyen Van A"],["国家","🇻🇳 越南"],["等级",<Chip type="warning">VIP</Chip>],["历史订单","23 单"],["消费总额","$1,847"],["首次购买","2022-08-14"]].map(([k,v],i,arr)=>(
              <div key={String(k)} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:i<arr.length-1?`1px solid ${D.divider}`:"none"}}>
                <span style={{fontSize:12,color:D.t4}}>{k}</span>
                <span style={{fontSize:12,color:D.t2,fontWeight:500}}>{v}</span>
              </div>
            ))}
            <div style={{marginTop:14}}>
              <p style={{fontSize:11,fontWeight:600,color:D.t3,margin:"0 0 8px",textTransform:"uppercase",letterSpacing:"0.4px"}}>AI 建议</p>
              <div style={{background:D.brandPale,border:`1px solid ${D.brandEdge}`,borderRadius:8,padding:10,marginBottom:8}}>
                <p style={{fontSize:11,color:D.brand,fontWeight:600,margin:"0 0 4px",display:"flex",alignItems:"center",gap:3}}><Zap size={10}/>推荐策略</p>
                <p style={{fontSize:11,color:D.t2,margin:0,lineHeight:1.6}}>该买家偏好简洁直接，建议主动提供快递单号及预计到达时间。</p>
              </div>
              <div style={{background:D.amberPale,border:`1px solid ${D.amberEdge}`,borderRadius:8,padding:10}}>
                <p style={{fontSize:11,color:D.amber,fontWeight:600,margin:"0 0 4px"}}>营销机会</p>
                <p style={{fontSize:11,color:D.t2,margin:"0 0 8px",lineHeight:1.6}}>买家近期浏览同类产品，可推荐新品（满$50减$8）。</p>
                <Btn v="sub" sz="sm" onClick={()=>toast.show("优惠券已发送")}>发送优惠券</Btn>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <Modal open={takeoverM.open} onClose={takeoverM.hide} title="确认人工接管" width={420}
        footer={<><Btn onClick={takeoverM.hide}>取消</Btn><Btn v="primary" onClick={()=>{setTakeover(true);takeoverM.hide();toast.show("已切换为人工模式","info");}}>确认接管</Btn></>}>
        <div style={{background:D.brandPale,border:`1px solid ${D.brandEdge}`,borderRadius:9,padding:"12px 14px",marginBottom:14,fontSize:12,color:D.t2,lineHeight:1.7}}>
          <strong style={{color:D.brand}}>💡 Manager 工作摘要</strong><br/>买家询问物流延误，AI 已查询显示包裹滞留清关，情绪评分 68 分（正常）。建议先告知原因再视情况补偿。
        </div>
        <p style={{fontSize:13,color:D.t2,margin:"0 0 14px"}}>接管后 AI 将暂停自动回复，所有消息由您手动处理。</p>
        <Field label="接管原因"><Sel value="" onChange={()=>{}} opts={[{v:"",l:"请选择原因"},{v:"1",l:"买家要求人工"},{v:"2",l:"问题较复杂"},{v:"3",l:"AI 回复有误"},{v:"4",l:"其他"}]}/></Field>
      </Modal>

      <Modal open={qrM.open} onClose={qrM.hide} title="快捷回复模板" width={440}
        footer={<><Btn onClick={qrM.hide}>取消</Btn><Btn v="primary" onClick={()=>{setInput(selQR);qrM.hide();}}>使用</Btn></>}>
        <div style={{display:"flex",flexDirection:"column",gap:7}}>
          {QR.map((r,i)=>(
            <div key={i} onClick={()=>setSelQR(r)} style={{padding:"10px 13px",border:`1.5px solid ${selQR===r?D.brand:D.border}`,borderRadius:8,cursor:"pointer",background:selQR===r?D.brandPale:D.bgCard,transition:"all .13s",fontSize:12,color:D.t2}}>{r}</div>
          ))}
        </div>
      </Modal>

      <Modal open={transM.open} onClose={transM.hide} title="转接会话" width={400}
        footer={<><Btn onClick={transM.hide}>取消</Btn><Btn v="primary" onClick={()=>{transM.hide();toast.show("会话已转接");}}>确认转接</Btn></>}>
        <Field label="转接给" req><Sel value="" onChange={()=>{}} opts={[{v:"",l:"请选择客服"},{v:"1",l:"李美玲（在线）"},{v:"2",l:"陈大伟（离线）"},{v:"3",l:"林俊杰（繁忙）"}]}/></Field>
        <Field label="转接备注"><Textarea placeholder="说明转接原因和当前处理进展…" rows={3}/></Field>
      </Modal>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE: KNOWLEDGE BASE
═══════════════════════════════════════════════════════════════════════════ */
function Knowledge({ toast }) {
  const [items, setItems] = useState(DATA.knowledge);
  const [search, setSearch] = useState("");
  const [detail, setDetail] = useState(null);
  const addM = useModal(); const importM = useModal(); const syncM = useModal(); const editM = useModal();
  const delConf = useModal();
  const [editItem, setEditItem] = useState(null);
  const [delTarget, setDelTarget] = useState(null);
  const [newItem, setNewItem] = useState({title:"",cat:"售后",content:""});
  const [syncTab, setSyncTab] = useState("product");

  const filtered = items.filter(i=>i.title.includes(search));
  const avgHealth = Math.round(items.reduce((s,k)=>s+k.health,0)/items.length);
  const CAT_TYPE = {售后:"danger",物流:"brand",促销:"warning",产品:"success",账号:"slate"};

  const COV = [
    {scene:"订单查询",rate:96},{scene:"物流追踪",rate:91},{scene:"退款处理",rate:72},
    {scene:"商品咨询",rate:45},{scene:"取消订单",rate:52},{scene:"促销活动",rate:22},
  ];

  if (detail) return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <PHeader title={detail.title} back onBack={()=>setDetail(null)}>
        <Btn v="sub" onClick={()=>{setEditItem({...detail});editM.show();}}><Edit3 size={13}/>编辑</Btn>
        <Btn v="danger" onClick={()=>{setDelTarget(detail);delConf.show();}}><Trash2 size={13}/>删除</Btn>
      </PHeader>
      <div style={{display:"grid",gridTemplateColumns:"1fr 264px",gap:20}}>
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          <Card>
            <p style={{fontSize:13,fontWeight:600,color:D.t1,margin:"0 0 12px"}}>知识内容（中文）</p>
            <div style={{fontSize:13,color:D.t2,lineHeight:1.9,padding:14,background:D.bgSub,borderRadius:8}}>本店支持 7 天无理由退换货政策。退货商品需保持原包装完整，标签未剪除。申请退货请在订单详情页点击「申请退款/退货」，填写退货原因并上传相关凭证。退款将在确认收货后的 3–5 个工作日内原路返回。</div>
          </Card>
          <Card>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <p style={{fontSize:13,fontWeight:600,color:D.t1,margin:0}}>多语种版本</p>
              <Btn v="ghost" sz="sm"><Plus size={11}/>添加语言</Btn>
            </div>
            {detail.langs.map(l=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 12px",background:D.bgSub,borderRadius:8,border:`1px solid ${D.border}`,marginBottom:7}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:18}}>{LANG_FLAG[l]}</span><span style={{fontSize:13,fontWeight:500,color:D.t2}}>{{zh:"中文",vi:"越南语",th:"泰语",id:"印尼语",ms:"马来语",en:"英语",fil:"菲律宾语"}[l]}</span><Chip type="success"><Check size={9}/>已翻译</Chip></div>
                <div style={{display:"flex",gap:5}}><Btn v="sub" sz="sm"><Eye size={11}/>预览</Btn><Btn v="sub" sz="sm"><Edit3 size={11}/>编辑</Btn></div>
              </div>
            ))}
          </Card>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <Card>
            <p style={{fontSize:12,fontWeight:600,color:D.t3,margin:"0 0 12px",textTransform:"uppercase",letterSpacing:"0.4px"}}>条目信息</p>
            {[["分类",<Chip type={CAT_TYPE[detail.cat]}>{detail.cat}</Chip>],["健康度",<HealthBar v={detail.health}/>],["语言数",`${detail.langs.length} 种`],["命中次数",`${detail.hits} 次`],["最后更新",detail.updated]].map(([k,v],i,arr)=>(
              <div key={String(k)} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:i<arr.length-1?`1px solid ${D.divider}`:"none"}}>
                <span style={{fontSize:12,color:D.t4}}>{k}</span><span style={{fontSize:12,color:D.t2}}>{v}</span>
              </div>
            ))}
          </Card>
          <Card>
            <p style={{fontSize:12,fontWeight:600,color:D.t3,margin:"0 0 10px",textTransform:"uppercase",letterSpacing:"0.4px"}}>关联 Agent</p>
            {["接待专员","售后主管"].map(a=>(
              <div key={a} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 0",borderBottom:`1px solid ${D.divider}`}}><Bot size={13} color={D.brand}/><span style={{fontSize:12,color:D.t2}}>{a}</span></div>
            ))}
          </Card>
        </div>
      </div>
      <Confirm open={delConf.open} onClose={delConf.hide} onConfirm={()=>{setItems(p=>p.filter(i=>i.id!==delTarget?.id));setDetail(null);toast.show("条目已删除","info");}} title="删除知识条目" body={`确认删除「${delTarget?.title}」？此操作不可撤销。`} dangerous/>
    </div>
  );

  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <PHeader title="知识库" sub="知识管理 · 商品数据同步 · 场景健康度">
        <Btn v="sub" onClick={syncM.show}><RefreshCw size={13}/>数据同步</Btn>
        <Btn v="sub" onClick={importM.show}><Upload size={13}/>批量导入</Btn>
        <Btn v="primary" onClick={addM.show}><Plus size={13}/>新建条目</Btn>
      </PHeader>

      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
        {[{l:"总条目数",v:items.length,c:D.t1},{l:"平均健康度",v:`${avgHealth}%`,c:avgHealth>=80?D.green:D.amber},{l:"需更新",v:items.filter(k=>k.health<70).length,c:D.red},{l:"语言覆盖",v:"7 种",c:D.t1}].map((s,i)=>(
          <Card key={i} pad={16}><p style={{fontSize:12,color:D.t3,margin:"0 0 8px",fontWeight:500}}>{s.l}</p><p style={{fontSize:24,fontWeight:700,color:s.c,margin:0,letterSpacing:"-0.4px"}}>{s.v}</p></Card>
        ))}
      </div>

      {/* Coverage map */}
      <Card>
        <SLabel action={<Chip type="warning"><AlertTriangle size={9}/>2 个场景需改善</Chip>}>场景知识覆盖率</SLabel>
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10}}>
          {COV.map(c=>(
            <div key={c.scene} style={{padding:"11px 13px",background:D.bgSub,borderRadius:9,border:`1px solid ${D.border}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <span style={{fontSize:12,fontWeight:600,color:D.t1}}>{c.scene}</span>
                {c.rate<60&&<Btn v="ghost" sz="sm" onClick={()=>toast.show(`正在跳转「${c.scene}」知识补充`,"info")}><Plus size={10}/>补充</Btn>}
              </div>
              <HealthBar v={c.rate}/>
            </div>
          ))}
        </div>
      </Card>

      {/* Table */}
      <Card pad={0}>
        <div style={{padding:"12px 20px",borderBottom:`1px solid ${D.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",gap:7}}>
            <div style={{position:"relative"}}>
              <Search size={12} style={{position:"absolute",left:9,top:"50%",transform:"translateY(-50%)",color:D.t4}}/>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="搜索条目…" style={{padding:"7px 9px 7px 27px",background:D.bgSub,border:`1px solid ${D.border}`,borderRadius:7,color:D.t2,fontSize:12,outline:"none",fontFamily:"inherit",width:196}}/>
            </div>
            <Btn v="sub" sz="sm"><Filter size={11}/>筛选</Btn>
          </div>
          <span style={{fontSize:12,color:D.t4}}>共 {filtered.length} 条</span>
        </div>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead>
            <tr style={{background:D.bgSub}}>
              {["标题","分类","语言覆盖","健康度","命中次数","更新时间","操作"].map(h=>(
                <th key={h} style={{padding:"9px 20px",textAlign:"left",fontSize:11,color:D.t4,fontWeight:600,letterSpacing:"0.2px"}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(item=>(
              <tr key={item.id} style={{borderTop:`1px solid ${D.divider}`}}>
                <td style={{padding:"12px 20px"}}><button onClick={()=>setDetail(item)} style={{background:"none",border:"none",cursor:"pointer",fontSize:13,color:D.brand,fontWeight:500,fontFamily:"inherit",padding:0,textDecoration:"underline",textDecorationColor:D.brandEdge}}>{item.title}</button></td>
                <td style={{padding:"12px 20px"}}><Chip type={CAT_TYPE[item.cat]||"slate"}>{item.cat}</Chip></td>
                <td style={{padding:"12px 20px"}}><div style={{display:"flex",gap:2}}>{item.langs.map(l=><span key={l} style={{fontSize:15}}>{LANG_FLAG[l]}</span>)}</div></td>
                <td style={{padding:"12px 20px",minWidth:140}}><HealthBar v={item.health}/></td>
                <td style={{padding:"12px 20px",fontSize:12,color:D.t3}}>{item.hits}</td>
                <td style={{padding:"12px 20px",fontSize:12,color:D.t4}}>{item.updated}</td>
                <td style={{padding:"12px 20px"}}>
                  <div style={{display:"flex",gap:5}}>
                    <Btn v="sub" sz="sm" onClick={()=>setDetail(item)}><Eye size={11}/></Btn>
                    <Btn v="sub" sz="sm" onClick={()=>{setEditItem({...item});editM.show();}}><Edit3 size={11}/></Btn>
                    <Btn v="danger" sz="sm" onClick={()=>{setDelTarget(item);delConf.show();}}><Trash2 size={11}/></Btn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Add Modal */}
      <Modal open={addM.open} onClose={addM.hide} title="新建知识条目" width={540}
        footer={<><Btn onClick={addM.hide}>取消</Btn><Btn v="primary" onClick={()=>{setItems(p=>[...p,{id:Date.now(),...newItem,langs:["zh"],health:100,updated:"刚刚",hits:0}]);addM.hide();toast.show("条目创建成功");setNewItem({title:"",cat:"售后",content:""});}}>创建</Btn></>}>
        <Field label="条目标题" req><Input value={newItem.title} onChange={e=>setNewItem(p=>({...p,title:e.target.value}))} placeholder="请输入知识条目标题"/></Field>
        <Field label="分类" req><Sel value={newItem.cat} onChange={v=>setNewItem(p=>({...p,cat:v}))} opts={["售后","物流","促销","产品","账号"].map(v=>({v,l:v}))}/></Field>
        <Field label="知识内容（中文）" req><Textarea value={newItem.content} onChange={e=>setNewItem(p=>({...p,content:e.target.value}))} placeholder="AI 将自动翻译为其他语言…" rows={5}/></Field>
        <Field label="自动翻译至">
          <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
            {["vi","th","id","ms","en","fil"].map(l=>(
              <label key={l} style={{display:"flex",alignItems:"center",gap:5,cursor:"pointer",fontSize:12,color:D.t2}}>
                <input type="checkbox" defaultChecked style={{accentColor:D.brand}}/>{LANG_FLAG[l]} {{vi:"越南语",th:"泰语",id:"印尼语",ms:"马来语",en:"英语",fil:"菲律宾语"}[l]}
              </label>
            ))}
          </div>
        </Field>
      </Modal>

      {/* Sync Modal */}
      <Modal open={syncM.open} onClose={syncM.hide} title="商品数据同步" width={560}
        footer={<><Btn onClick={syncM.hide}>取消</Btn><Btn v="primary" onClick={()=>{syncM.hide();toast.show("同步任务已启动，约 3 分钟完成");}}>开始同步</Btn></>}>
        <TabBar tabs={[{k:"product",l:"商品数据"},{k:"policy",l:"政策文档"},{k:"auto",l:"自动学习"}]} active={syncTab} onChange={setSyncTab} style={{marginBottom:20}}/>
        {syncTab==="product"&&(
          <>
            <p style={{fontSize:13,color:D.t2,margin:"0 0 14px",lineHeight:1.7}}>同步后 Agent 可实时查询商品信息、库存、价格，大幅提升导购和咨询能力。</p>
            {[{p:"Shopee VN",f:"🇻🇳",n:1284,s:"success",last:"1小时前"},{p:"Lazada MY",f:"🇲🇾",n:867,s:"success",last:"3小时前"},{p:"TikTok Shop TH",f:"🇹🇭",n:0,s:"slate",last:"—"}].map((x,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"13px 15px",background:D.bgSub,borderRadius:9,border:`1px solid ${D.border}`,marginBottom:9}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontSize:22}}>{x.f}</span>
                  <div><p style={{fontSize:13,fontWeight:600,color:D.t1,margin:0}}>{x.p}</p><p style={{fontSize:11,color:D.t4,margin:"2px 0 0"}}>{x.n>0?`${x.n} 件 · ${x.last}`:"尚未接入"}</p></div>
                </div>
                <div style={{display:"flex",gap:7,alignItems:"center"}}>
                  <Chip type={x.s}>{x.s==="success"?"已同步":"未接入"}</Chip>
                  {x.n>0?<Btn v="sub" sz="sm"><RefreshCw size={11}/>同步</Btn>:<Btn v="ghost" sz="sm"><Plus size={11}/>接入</Btn>}
                </div>
              </div>
            ))}
          </>
        )}
        {syncTab==="policy"&&(
          <div style={{border:`1.5px dashed ${D.border}`,borderRadius:9,padding:32,textAlign:"center",cursor:"pointer",background:D.bgSub}}>
            <Upload size={24} color={D.t4} style={{margin:"0 auto 8px",display:"block"}}/>
            <p style={{fontSize:13,fontWeight:500,color:D.t2,margin:"0 0 4px"}}>点击或拖拽文件至此处</p>
            <p style={{fontSize:11,color:D.t4,margin:0}}>支持 PDF、Word、Excel、TXT，单次最大 10MB</p>
          </div>
        )}
        {syncTab==="auto"&&(
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            <div style={{background:D.greenPale,border:`1px solid ${D.greenEdge}`,borderRadius:9,padding:"11px 13px",fontSize:12,color:D.t2,lineHeight:1.7,marginBottom:4}}>
              <strong style={{color:D.green}}>自动学习已开启</strong>：人工客服回答了 Agent 不了解的问题时，系统自动记录并提示确认加入知识库。
            </div>
            {[{q:"买家问：你们支持货到付款吗？",by:"李美玲",ans:"暂不支持货到付款，目前仅支持在线支付。"},{q:"买家问：商品可以开发票吗？",by:"陈大伟",ans:"可以，请在订单备注填写开票信息，随包裹寄出。"}].map((item,i)=>(
              <div key={i} style={{padding:"12px 14px",background:D.bgSub,borderRadius:9,border:`1px solid ${D.border}`}}>
                <p style={{fontSize:11,color:D.t4,margin:"0 0 4px"}}>{item.by} 回答</p>
                <p style={{fontSize:12,color:D.t1,fontWeight:500,margin:"0 0 6px"}}>{item.q}</p>
                <p style={{fontSize:12,color:D.t2,margin:"0 0 10px",padding:"7px 10px",background:D.bgCard,borderRadius:7,border:`1px solid ${D.border}`}}>{item.ans}</p>
                <div style={{display:"flex",gap:6}}><Btn v="ghost" sz="sm" onClick={()=>toast.show("已添加到知识库")}><Check size={11}/>加入知识库</Btn><Btn v="sub" sz="sm">忽略</Btn></div>
              </div>
            ))}
          </div>
        )}
      </Modal>

      <Modal open={importM.open} onClose={importM.hide} title="批量导入" width={440}
        footer={<><Btn onClick={importM.hide}>取消</Btn><Btn v="primary" onClick={()=>{importM.hide();toast.show("正在解析文件…");}}>开始导入</Btn></>}>
        <div style={{border:`1.5px dashed ${D.border}`,borderRadius:9,padding:32,textAlign:"center",cursor:"pointer",background:D.bgSub}}>
          <Upload size={24} color={D.t4} style={{margin:"0 auto 8px",display:"block"}}/>
          <p style={{fontSize:13,fontWeight:500,color:D.t2,margin:"0 0 4px"}}>点击或拖拽文件至此处</p>
          <p style={{fontSize:11,color:D.t4,margin:0}}>支持 .xlsx / .csv / .json，单次最大 10MB</p>
        </div>
        <div style={{marginTop:12}}><Btn v="ghost" sz="sm"><Download size={11}/>下载导入模板</Btn></div>
      </Modal>

      <Modal open={editM.open} onClose={editM.hide} title="编辑条目" width={460}
        footer={<><Btn onClick={editM.hide}>取消</Btn><Btn v="primary" onClick={()=>{setItems(p=>p.map(i=>i.id===editItem?.id?{...i,...editItem}:i));editM.hide();toast.show("保存成功");}}>保存</Btn></>}>
        {editItem&&<><Field label="标题"><Input value={editItem.title} onChange={e=>setEditItem(p=>({...p,title:e.target.value}))}/></Field><Field label="分类"><Sel value={editItem.cat} onChange={v=>setEditItem(p=>({...p,cat:v}))} opts={["售后","物流","促销","产品","账号"].map(v=>({v,l:v}))}/></Field></>}
      </Modal>

      <Confirm open={delConf.open} onClose={delConf.hide} onConfirm={()=>{setItems(p=>p.filter(i=>i.id!==delTarget?.id));toast.show("已删除","info");}} title="删除知识条目" body={`确认删除「${delTarget?.title}」？`} dangerous/>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE: ANALYTICS
═══════════════════════════════════════════════════════════════════════════ */
function Analytics({ toast }) {
  const [tab, setTab]     = useState("overview");
  const [range, setRange] = useState("month");

  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <PHeader title="数据洞察" sub="运营总览 · AI 效果分析 · 客服绩效">
        <div style={{display:"flex",gap:5}}>
          {[{k:"week",l:"近7天"},{k:"month",l:"近30天"},{k:"quarter",l:"近6月"}].map(r=>(
            <Btn key={r.k} v={range===r.k?"primary":"sub"} sz="sm" onClick={()=>setRange(r.k)}>{r.l}</Btn>
          ))}
        </div>
        <Btn v="sub" onClick={()=>toast.show("导出中…","info")}><Download size={13}/>导出</Btn>
      </PHeader>

      <TabBar tabs={[{k:"overview",l:"运营总览"},{k:"ai",l:"AI 效果"},{k:"cs",l:"客服绩效"}]} active={tab} onChange={setTab} style={{marginBottom:4}}/>

      {tab==="overview"&&(
        <>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
            {[{l:"总会话量",v:"164,900",d:"+22.4%",up:true},{l:"AI 解决率",v:"87.3%",d:"+3.2pp",up:true},{l:"平均满意度",v:"4.7 / 5",d:"+0.3",up:true},{l:"节省成本",v:"$24,820",d:"+18.5%",up:true}].map((k,i)=>(
              <Card key={i} pad={18}><p style={{fontSize:12,color:D.t3,margin:"0 0 10px",fontWeight:500}}>{k.l}</p><p style={{fontSize:24,fontWeight:700,color:D.t1,margin:"0 0 6px",letterSpacing:"-0.4px"}}>{k.v}</p><div style={{display:"flex",alignItems:"center",gap:3,fontSize:12}}>{k.up?<ArrowUpRight size={11} color={D.green}/>:<ArrowDownRight size={11} color={D.red}/>}<span style={{color:k.up?D.green:D.red,fontWeight:600}}>{k.d}</span><span style={{color:D.t5,marginLeft:2}}>较上期</span></div></Card>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:14}}>
            <Card>
              <p style={{fontSize:13,fontWeight:600,color:D.t1,margin:"0 0 16px"}}>月度会话趋势</p>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={DATA.monthly} margin={{top:4,right:4,left:-20,bottom:0}}>
                  <defs>
                    <linearGradient id="gM1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={D.brand} stopOpacity={0.15}/><stop offset="100%" stopColor={D.brand} stopOpacity={0}/></linearGradient>
                    <linearGradient id="gM2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={D.brandDim} stopOpacity={0.15}/><stop offset="100%" stopColor={D.brandDim} stopOpacity={0}/></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={D.divider} vertical={false}/>
                  <XAxis dataKey="m" tick={{fontSize:11,fill:D.t4}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fontSize:11,fill:D.t4}} axisLine={false} tickLine={false}/>
                  <Tooltip content={<CTip/>}/>
                  <Area type="monotone" dataKey="s" name="总会话" stroke={D.brand} fill="url(#gM1)" strokeWidth={2} dot={false}/>
                  <Area type="monotone" dataKey="r" name="AI解决" stroke={D.brandDim} fill="url(#gM2)" strokeWidth={2} dot={false}/>
                </AreaChart>
              </ResponsiveContainer>
            </Card>
            <Card>
              <p style={{fontSize:13,fontWeight:600,color:D.t1,margin:"0 0 8px"}}>平台分布</p>
              <ResponsiveContainer width="100%" height={150}>
                <PieChart><Pie data={DATA.platform} cx="50%" cy="50%" outerRadius={62} dataKey="value" paddingAngle={2}>{DATA.platform.map((e,i)=><Cell key={i} fill={e.color} stroke="transparent"/>)}</Pie><Tooltip content={<CTip/>}/></PieChart>
              </ResponsiveContainer>
              <div style={{display:"flex",flexDirection:"column",gap:5,marginTop:8}}>
                {DATA.platform.map((p,i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",fontSize:11}}>
                    <span style={{display:"flex",alignItems:"center",gap:5,color:D.t3}}><span style={{width:7,height:7,borderRadius:2,background:p.color,display:"inline-block"}}/>{p.name}</span>
                    <span style={{fontWeight:600,color:D.t2}}>{p.value}%</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </>
      )}

      {tab==="ai"&&(
        <>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
            {[{l:"AI 独立解决率",v:"87.3%"},{l:"平均首次响应",v:"1.2s"},{l:"知识命中率",v:"91.5%"}].map((s,i)=>(
              <Card key={i} pad={18}><p style={{fontSize:12,color:D.t3,margin:"0 0 8px",fontWeight:500}}>{s.l}</p><p style={{fontSize:24,fontWeight:700,color:D.brand,margin:"0 0 10px",letterSpacing:"-0.4px"}}>{s.v}</p><HealthBar v={parseInt(s.v)}/></Card>
            ))}
          </div>
          <Card>
            <SLabel action={<span style={{fontSize:12,color:D.t4,display:"flex",alignItems:"center",gap:5}}><span style={{width:20,height:2,background:D.t4,display:"inline-block"}}/>行业均值基准</span>}>场景解决率</SLabel>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {DATA.coverage.map(d=>(
                <div key={d.scene} style={{display:"flex",alignItems:"center",gap:12}}>
                  <span style={{width:80,fontSize:12,color:D.t3,textAlign:"right",flexShrink:0}}>{d.scene}</span>
                  <div style={{flex:1,position:"relative"}}>
                    <div style={{height:7,background:D.bgSub,borderRadius:4,overflow:"hidden"}}>
                      <div style={{width:`${d.rate}%`,height:"100%",background:d.rate>=80?D.brand:d.rate>=60?D.amber:D.red,borderRadius:4,transition:"width .5s"}}/>
                    </div>
                    <div style={{position:"absolute",top:0,left:`${d.avg}%`,width:1.5,height:7,background:D.t4}}/>
                  </div>
                  <div style={{minWidth:90,display:"flex",gap:6,alignItems:"center"}}>
                    <span style={{fontSize:12,fontWeight:700,color:d.rate>=80?D.brand:d.rate>=60?D.amber:D.red,minWidth:30}}>{d.rate}%</span>
                    <span style={{fontSize:11,color:D.t5}}>均值{d.avg}%</span>
                  </div>
                  {d.rate<d.avg&&<Btn v="ghost" sz="sm" onClick={()=>toast.show(`「${d.scene}」优化建议`,"info")}>优化</Btn>}
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <SLabel>人工接管分析</SLabel>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
              {[{n:47,l:"可由 AI 处理",sub:"接管阈值过于保守",c:D.amber},{n:23,l:"知识库无答案",sub:"5 类高频盲点待补充",c:D.red},{n:86,l:"确实需要人工",sub:"投诉升级 / 复杂退款",c:D.green}].map((s,i)=>(
                <div key={i} style={{background:D.bgSub,borderRadius:9,padding:"13px 16px",border:`1px solid ${D.border}`}}>
                  <p style={{fontSize:24,fontWeight:700,color:s.c,margin:"0 0 4px",letterSpacing:"-0.4px"}}>{s.n}</p>
                  <p style={{fontSize:12,fontWeight:600,color:D.t1,margin:"0 0 3px"}}>{s.l}</p>
                  <p style={{fontSize:11,color:D.t4,margin:0}}>{s.sub}</p>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}

      {tab==="cs"&&(
        <Card pad={0}>
          <div style={{padding:"14px 20px",borderBottom:`1px solid ${D.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontSize:14,fontWeight:600,color:D.t1}}>客服绩效排行</span>
            <Btn v="sub" sz="sm" onClick={()=>toast.show("导出中…","info")}><Download size={11}/>导出</Btn>
          </div>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr style={{background:D.bgSub}}>{["排名","客服","处理量","解决率","平均响应","满意度"].map(h=><th key={h} style={{padding:"9px 20px",textAlign:"left",fontSize:11,color:D.t4,fontWeight:600,letterSpacing:"0.2px"}}>{h}</th>)}</tr></thead>
            <tbody>
              {[{r:1,n:"张晓明",v:284,rate:"94.5%",resp:"45s",score:4.9},{r:2,n:"李美玲",v:261,rate:"91.2%",resp:"52s",score:4.8},{r:3,n:"陈大伟",v:238,rate:"88.7%",resp:"68s",score:4.7},{r:4,n:"王小雨",v:195,rate:"85.3%",resp:"74s",score:4.5},{r:5,n:"林俊杰",v:178,rate:"82.1%",resp:"81s",score:4.3}].map(row=>(
                <tr key={row.r} style={{borderTop:`1px solid ${D.divider}`}}>
                  <td style={{padding:"12px 20px"}}><span style={{width:24,height:24,borderRadius:"50%",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,background:row.r===1?"#FEF3C7":row.r===2?"#F3F4F6":row.r===3?"#FFF7ED":D.bgSub,color:row.r===1?"#D97706":row.r===2?"#6B7280":row.r===3?"#B45309":D.t4}}>{row.r}</span></td>
                  <td style={{padding:"12px 20px",fontSize:13,color:D.t1,fontWeight:500}}>{row.n}</td>
                  <td style={{padding:"12px 20px",fontSize:13,color:D.t2}}>{row.v}</td>
                  <td style={{padding:"12px 20px"}}><Chip type="success">{row.rate}</Chip></td>
                  <td style={{padding:"12px 20px",fontSize:12,color:D.t3}}>{row.resp}</td>
                  <td style={{padding:"12px 20px"}}><div style={{display:"flex",alignItems:"center",gap:4}}><Star size={12} fill={D.amber} color={D.amber}/><span style={{fontSize:13,fontWeight:600,color:D.t1}}>{row.score}</span></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE: SYSTEM
═══════════════════════════════════════════════════════════════════════════ */
function System({ toast }) {
  const [sec, setSec] = useState("stores");
  const addStoreM = useModal(); const addMemberM = useModal(); const delConf = useModal();
  const [delTarget, setDelTarget] = useState(null);
  const [stores, setStores] = useState([
    {id:1,name:"DuoKe Official VN",platform:"Shopee Vietnam",   status:"active",   expires:"2025-06-30",sessions:142,flag:"🇻🇳"},
    {id:2,name:"DuoKe MY Store",    platform:"Lazada Malaysia",  status:"active",   expires:"2025-08-15",sessions:89, flag:"🇲🇾"},
    {id:3,name:"DuoKe TH Shop",    platform:"TikTok Shop TH",   status:"expiring", expires:"2025-03-20",sessions:34, flag:"🇹🇭"},
    {id:4,name:"DuoKe PH Market",  platform:"Shopee Philippines",status:"inactive", expires:"—",         sessions:0,  flag:"🇵🇭"},
  ]);

  const SIDE = [
    {id:"stores",  Icon:Zap,        l:"店铺授权"},
    {id:"members", Icon:UserPlus,   l:"团队成员"},
    {id:"rbac",    Icon:Shield,     l:"权限管理"},
    {id:"audit",   Icon:FileText,   l:"审计日志"},
    {id:"compliance",Icon:ShieldCheck,l:"合规风控"},
  ];

  return (
    <div style={{display:"flex",gap:20}}>
      <div style={{width:176,flexShrink:0}}>
        <Card pad={8}>
          {SIDE.map(s=>(
            <button key={s.id} onClick={()=>setSec(s.id)} style={{width:"100%",display:"flex",alignItems:"center",gap:8,padding:"8px 11px",borderRadius:8,background:sec===s.id?D.brandPale:"transparent",border:"none",cursor:"pointer",color:sec===s.id?D.brand:D.t3,fontSize:13,fontWeight:sec===s.id?600:400,transition:"all .13s",fontFamily:"inherit",marginBottom:1}}>
              <s.Icon size={13}/>{s.l}
            </button>
          ))}
        </Card>
      </div>
      <div style={{flex:1}}>

        {sec==="stores"&&(
          <>
            <PHeader title="店铺 OAuth 授权" sub={`共 ${stores.length} 家店铺`}>
              <Btn v="primary" onClick={addStoreM.show}><Plus size={13}/>添加店铺</Btn>
            </PHeader>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {stores.map(s=>(
                <Card key={s.id} pad={18}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div style={{display:"flex",alignItems:"center",gap:12}}>
                      <span style={{fontSize:26}}>{s.flag}</span>
                      <div>
                        <p style={{fontSize:14,fontWeight:600,color:D.t1,margin:0}}>{s.name}</p>
                        <p style={{fontSize:12,color:D.t4,margin:"3px 0 0"}}>{s.platform} · 到期：{s.expires}{s.sessions>0&&` · 今日 ${s.sessions} 条会话`}</p>
                      </div>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <Chip type={s.status==="active"?"success":s.status==="expiring"?"warning":"slate"}>{s.status==="active"?"授权正常":s.status==="expiring"?"即将过期":"未授权"}</Chip>
                      {s.status==="inactive"?<Btn v="primary" sz="sm"><Key size={11}/>立即授权</Btn>:s.status==="expiring"?<Btn v="ghost" sz="sm"><RefreshCw size={11}/>续期</Btn>:<Btn v="sub" sz="sm"><Eye size={11}/>查看</Btn>}
                      <Btn v="danger" sz="sm" onClick={()=>{setDelTarget(s);delConf.show();}}><Trash2 size={11}/></Btn>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        {sec==="members"&&(
          <>
            <PHeader title="团队成员" sub={`共 ${DATA.members.length} 名`}>
              <Btn v="primary" onClick={addMemberM.show}><UserPlus size={13}/>邀请成员</Btn>
            </PHeader>
            <Card pad={0}>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead><tr style={{background:D.bgSub}}>{["成员","角色","状态","最后活跃","操作"].map(h=><th key={h} style={{padding:"9px 20px",textAlign:"left",fontSize:11,color:D.t4,fontWeight:600,letterSpacing:"0.2px"}}>{h}</th>)}</tr></thead>
                <tbody>
                  {DATA.members.map(m=>(
                    <tr key={m.id} style={{borderTop:`1px solid ${D.divider}`}}>
                      <td style={{padding:"12px 20px"}}>
                        <div style={{display:"flex",alignItems:"center",gap:10}}>
                          <div style={{width:32,height:32,borderRadius:"50%",background:D.bgSub,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:600,color:D.t3,flexShrink:0}}>{m.a}</div>
                          <div><p style={{fontSize:13,fontWeight:500,color:D.t1,margin:0}}>{m.name}</p><p style={{fontSize:11,color:D.t4,margin:"1px 0 0"}}>{m.email}</p></div>
                        </div>
                      </td>
                      <td style={{padding:"12px 20px"}}><Chip type={{超级管理员:"brand",客服主管:"brand",高级客服:"success",客服专员:"slate",数据分析师:"warning"}[m.role]||"slate"}>{m.role}</Chip></td>
                      <td style={{padding:"12px 20px"}}>
                        <div style={{display:"flex",alignItems:"center",gap:5}}>
                          <span style={{width:6,height:6,borderRadius:"50%",background:m.status==="online"?D.green:m.status==="busy"?D.amber:D.t5,display:"inline-block"}}/>
                          <span style={{fontSize:12,color:D.t3}}>{m.status==="online"?"在线":m.status==="busy"?"繁忙":"离线"}</span>
                        </div>
                      </td>
                      <td style={{padding:"12px 20px",fontSize:12,color:D.t4}}>{m.last}</td>
                      <td style={{padding:"12px 20px"}}><div style={{display:"flex",gap:5}}><Btn v="sub" sz="sm"><Edit3 size={11}/></Btn><Btn v="sub" sz="sm" onClick={()=>toast.show("重置密码邮件已发送")}><Key size={11}/></Btn><Btn v="danger" sz="sm"><Trash2 size={11}/></Btn></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </>
        )}

        {sec==="rbac"&&(
          <>
            <PHeader title="权限管理" sub="基于 RBAC 的精细化权限控制"/>
            <Card>
              <p style={{fontSize:13,fontWeight:600,color:D.t1,margin:"0 0 14px"}}>角色权限矩阵</p>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",minWidth:560}}>
                  <thead><tr style={{background:D.bgSub}}><th style={{padding:"9px 16px",textAlign:"left",fontSize:11,color:D.t4,fontWeight:600}}>功能模块</th>{["超级管理员","客服主管","高级客服","客服专员","数据分析师"].map(r=><th key={r} style={{padding:"9px 16px",textAlign:"center",fontSize:11,color:D.t4,fontWeight:600}}>{r}</th>)}</tr></thead>
                  <tbody>
                    {[["首页总览",1,1,1,1,1],["客服工作台",1,1,1,1,0],["人工接管",1,1,1,0,0],["知识库编辑",1,1,0,0,0],["Agent 配置",1,1,0,0,0],["数据分析",1,1,0,0,1],["系统管理",1,0,0,0,0]].map(([f,...p])=>(
                      <tr key={f} style={{borderTop:`1px solid ${D.divider}`}}>
                        <td style={{padding:"10px 16px",fontSize:12,color:D.t2}}>{f}</td>
                        {p.map((v,i)=><td key={i} style={{padding:"10px 16px",textAlign:"center"}}>{v?<Check size={14} color={D.brand}/>:<Minus size={14} color={D.t5}/>}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        )}

        {sec==="audit"&&(
          <>
            <PHeader title="审计日志" sub="记录所有用户操作与系统事件">
              <Btn v="sub" sz="sm" onClick={()=>toast.show("导出中…","info")}><Download size={13}/>导出</Btn>
            </PHeader>
            <Card pad={0}>
              <div style={{padding:"11px 20px",borderBottom:`1px solid ${D.border}`}}>
                <div style={{position:"relative",display:"inline-block"}}><Search size={12} style={{position:"absolute",left:9,top:"50%",transform:"translateY(-50%)",color:D.t4}}/><input placeholder="搜索…" style={{padding:"7px 9px 7px 27px",background:D.bgSub,border:`1px solid ${D.border}`,borderRadius:7,fontSize:12,outline:"none",fontFamily:"inherit",color:D.t2}}/></div>
              </div>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead><tr style={{background:D.bgSub}}>{["操作人","操作","对象","IP","时间","级别"].map(h=><th key={h} style={{padding:"9px 20px",textAlign:"left",fontSize:11,color:D.t4,fontWeight:600}}>{h}</th>)}</tr></thead>
                <tbody>
                  {[{u:"张晓明",a:"修改 Agent 配置",t:"接待专员",ip:"192.168.1.1",time:"14:32",l:"brand"},{u:"李美玲",a:"人工接管会话",t:"Session #28471",ip:"192.168.1.2",time:"14:28",l:"slate"},{u:"系统",a:"AI 异常降级",t:"Shopee VN 渠道",ip:"—",time:"13:55",l:"warning"},{u:"张晓明",a:"删除知识条目",t:"旧版退款说明",ip:"192.168.1.1",time:"11:20",l:"danger"},{u:"王小雨",a:"导出数据报告",t:"2月运营月报",ip:"192.168.1.4",time:"10:15",l:"slate"}].map((log,i)=>(
                    <tr key={i} style={{borderTop:`1px solid ${D.divider}`}}>
                      <td style={{padding:"11px 20px",fontSize:12,color:D.t1,fontWeight:500}}>{log.u}</td>
                      <td style={{padding:"11px 20px",fontSize:12,color:D.t2}}>{log.a}</td>
                      <td style={{padding:"11px 20px",fontSize:11,color:D.t3}}>{log.t}</td>
                      <td style={{padding:"11px 20px",fontSize:11,color:D.t4,fontFamily:"monospace"}}>{log.ip}</td>
                      <td style={{padding:"11px 20px",fontSize:11,color:D.t4}}>{log.time}</td>
                      <td style={{padding:"11px 20px"}}><Chip type={log.l}>{log.l==="brand"?"普通":log.l==="warning"?"警告":log.l==="danger"?"危险":"系统"}</Chip></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </>
        )}

        {sec==="compliance"&&(
          <>
            <PHeader title="合规风控" sub="东南亚各市场本地合规规则"/>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {[{m:"越南（VN）",f:"🇻🇳",r:["禁止发送未经同意的促销信息","个人数据存储不超过2年","退款需在7天内处理"]},{m:"印度尼西亚（ID）",f:"🇮🇩",r:["遵守 UU PDP 个人数据保护法","禁止收集未成年人数据","跨境数据传输需获批准"]},{m:"泰国（TH）",f:"🇹🇭",r:["遵守 PDPA 个人数据法","数据删除请求需48小时内响应","需提供泰语版隐私政策"]}].map((x,i)=>(
                <Card key={i} pad={18}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                    <div>
                      <p style={{fontSize:14,fontWeight:600,color:D.t1,margin:"0 0 12px",display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:20}}>{x.f}</span>{x.m}</p>
                      {x.r.map((r,j)=>(
                        <div key={j} style={{display:"flex",alignItems:"flex-start",gap:8,marginBottom:6}}><CheckCircle2 size={13} color={D.green} style={{marginTop:1,flexShrink:0}}/><span style={{fontSize:12,color:D.t2}}>{r}</span></div>
                      ))}
                    </div>
                    <Btn v="sub" sz="sm"><Edit3 size={11}/>编辑</Btn>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>

      <Modal open={addStoreM.open} onClose={addStoreM.hide} title="添加店铺授权" width={480}
        footer={<><Btn onClick={addStoreM.hide}>取消</Btn><Btn v="primary" onClick={()=>{addStoreM.hide();toast.show("已跳转至 OAuth 授权页");}}>前往授权</Btn></>}>
        <Field label="电商平台" req><Sel value="" onChange={()=>{}} opts={[{v:"",l:"请选择平台"},{v:"1",l:"Shopee"},{v:"2",l:"Lazada"},{v:"3",l:"TikTok Shop"},{v:"4",l:"Tokopedia"}]}/></Field>
        <Field label="店铺名称" req><Input placeholder="输入店铺名称（内部识别用）"/></Field>
        <Field label="运营市场"><Sel value="" onChange={()=>{}} opts={[{v:"",l:"请选择市场"},{v:"vn",l:"越南"},{v:"my",l:"马来西亚"},{v:"th",l:"泰国"},{v:"id",l:"印度尼西亚"},{v:"ph",l:"菲律宾"}]}/></Field>
        <div style={{background:D.brandPale,border:`1px solid ${D.brandEdge}`,borderRadius:8,padding:"11px 13px",fontSize:12,color:D.t2,display:"flex",gap:8}}><Info size={13} color={D.brand} style={{flexShrink:0,marginTop:1}}/>点击「前往授权」将跳转至对应平台的 OAuth 页面，授权完成后自动返回。</div>
      </Modal>

      <Modal open={addMemberM.open} onClose={addMemberM.hide} title="邀请团队成员" width={440}
        footer={<><Btn onClick={addMemberM.hide}>取消</Btn><Btn v="primary" onClick={()=>{addMemberM.hide();toast.show("邀请邮件已发送");}}>发送邀请</Btn></>}>
        <Field label="邮箱地址" req><Input type="email" placeholder="输入成员邮箱地址"/></Field>
        <Field label="分配角色" req><Sel value="" onChange={()=>{}} opts={[{v:"",l:"请选择角色"},{v:"1",l:"超级管理员"},{v:"2",l:"客服主管"},{v:"3",l:"高级客服"},{v:"4",l:"客服专员"},{v:"5",l:"数据分析师"}]}/></Field>
        <Field label="备注"><Input placeholder="可选，例如：负责越南市场"/></Field>
      </Modal>

      <Confirm open={delConf.open} onClose={delConf.hide} onConfirm={()=>{setStores(p=>p.filter(s=>s.id!==delTarget?.id));toast.show("已删除","info");}} title="确认删除" body={`确认删除「${delTarget?.name}」？此操作不可恢复。`} dangerous/>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   APP SHELL
═══════════════════════════════════════════════════════════════════════════ */
export default function App() {
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

  const Marketing = ({toast}) => (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <PHeader title="智能营销" sub="主动触达 · 优惠券管理 · 评价运营"/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
        {[{icon:"🎯",t:"主动触达规则",n:8,a:5},{icon:"🎁",t:"活跃优惠券",n:24,a:12},{icon:"⭐",t:"待回复评价",n:142,a:18}].map((c,i)=>(
          <Card key={i} pad={20} style={{cursor:"pointer"}}>
            <div style={{fontSize:26,marginBottom:12}}>{c.icon}</div>
            <div style={{fontSize:26,fontWeight:700,color:D.t1,marginBottom:4,letterSpacing:"-0.4px"}}>{c.n}</div>
            <p style={{fontSize:13,color:D.t2,margin:"0 0 8px"}}>{c.t}</p>
            <Chip type="slate">{c.a} 活跃</Chip>
          </Card>
        ))}
      </div>
      <Card><p style={{fontSize:13,color:D.t3,textAlign:"center",padding:"32px 0",margin:0}}>购后关怀时间线、催付催评、评价运营等完整功能，详见产品设计文档</p></Card>
    </div>
  );

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
      <aside style={{width:collapsed?52:196,flexShrink:0,background:D.bgCard,borderRight:`1px solid ${D.border}`,display:"flex",flexDirection:"column",transition:"width .2s ease",overflow:"hidden",boxShadow:"1px 0 4px rgba(0,0,0,0.04)"}}>
        {/* Logo */}
        <div style={{height:54,display:"flex",alignItems:"center",justifyContent:collapsed?"center":"space-between",padding:collapsed?"0 10px":"0 14px 0 16px",borderBottom:`1px solid ${D.border}`,flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:9}}>
            <div style={{width:28,height:28,borderRadius:8,background:D.brand,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <MessageCircle size={14} color="#fff"/>
            </div>
            {!collapsed&&<div><p style={{fontSize:13,fontWeight:700,color:D.t1,margin:0,letterSpacing:"-0.2px"}}>DUOKE</p><p style={{fontSize:10,color:D.t4,margin:0,letterSpacing:"0.4px"}}>AI 客服平台</p></div>}
          </div>
          {!collapsed&&<button onClick={()=>setCollapsed(true)} style={{background:"none",border:"none",cursor:"pointer",color:D.t4,display:"flex",padding:3}}><ChevronLeft size={14}/></button>}
        </div>

        {/* Nav items */}
        <nav style={{flex:1,padding:"10px 7px",overflowY:"auto"}}>
          {NAV.map(item=>{
            const active = page===item.id;
            return (
              <button key={item.id} onClick={()=>setPage(item.id)} title={collapsed?item.l:""} style={{width:"100%",display:"flex",alignItems:"center",gap:collapsed?0:8,padding:collapsed?"9px 0":"8px 10px",justifyContent:collapsed?"center":"flex-start",borderRadius:8,marginBottom:1,cursor:"pointer",background:active?D.brandPale:"transparent",border:active?`1px solid ${D.brandEdge}`:"1px solid transparent",color:active?D.brand:D.t3,fontSize:12,fontWeight:active?600:400,transition:"all .13s",fontFamily:"inherit",position:"relative"}}>
                <item.Icon size={15} style={{flexShrink:0}}/>
                {!collapsed&&<span style={{flex:1,textAlign:"left"}}>{item.l}</span>}
                {!collapsed&&item.badge!=null&&<span style={{minWidth:18,height:18,borderRadius:9,background:D.red,color:"#fff",fontSize:10,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 4px"}}>{item.badge}</span>}
                {!collapsed&&item.highlight&&!active&&<span style={{fontSize:10,padding:"1px 5px",borderRadius:3,background:D.brand,color:"#fff",fontWeight:700}}>NEW</span>}
                {collapsed&&item.badge&&<span style={{position:"absolute",top:6,right:6,width:6,height:6,borderRadius:"50%",background:D.red}}/>}
              </button>
            );
          })}
        </nav>

        {/* User */}
        <div style={{padding:"8px 7px",borderTop:`1px solid ${D.border}`}}>
          {collapsed&&<button onClick={()=>setCollapsed(false)} style={{width:"100%",display:"flex",justifyContent:"center",padding:"7px 0",background:"none",border:"none",cursor:"pointer",color:D.t4,marginBottom:4}}><ChevronRight size={14}/></button>}
          <div style={{display:"flex",alignItems:"center",gap:8,padding:"7px 8px",borderRadius:8}}>
            <div style={{width:28,height:28,borderRadius:"50%",background:D.bgSub,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:D.t3,flexShrink:0}}>管</div>
            {!collapsed&&<div style={{flex:1,minWidth:0}}><p style={{fontSize:12,fontWeight:500,color:D.t1,margin:0}}>超级管理员</p><p style={{fontSize:11,color:D.t4,margin:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>admin@joyserve.ai</p></div>}
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        {/* Topbar */}
        <header style={{height:54,background:D.bgCard,borderBottom:`1px solid ${D.border}`,display:"flex",alignItems:"center",padding:"0 24px",gap:16,flexShrink:0}}>
          <div style={{flex:1}}>
            <div style={{position:"relative",display:"inline-block"}}>
              <Search size={12} style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:D.t4}}/>
              <input placeholder="全局搜索 ⌘K" style={{padding:"7px 14px 7px 30px",background:D.bgSub,border:`1px solid ${D.border}`,borderRadius:7,color:D.t2,fontSize:12,outline:"none",width:220,fontFamily:"inherit"}}/>
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
