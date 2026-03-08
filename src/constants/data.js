export const D = {
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
export const DATA = {
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
export const LANG_FLAG = { zh:"🇨🇳", vi:"🇻🇳", th:"🇹🇭", id:"🇮🇩", ms:"🇲🇾", en:"🇺🇸", fil:"🇵🇭" };
