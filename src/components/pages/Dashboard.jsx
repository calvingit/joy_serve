/* 首页总览页面：展示 AI 与人工客服核心指标与提醒。 */
import { useEffect, useRef, useState } from "react";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowDownRight,
  ArrowLeft,
  ArrowUpRight,
  Award,
  BarChart3,
  Bell,
  BookOpen,
  Bot,
  Check,
  CheckCheck,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Clock,
  Cpu,
  Download,
  Edit3,
  Eye,
  FileText,
  Filter,
  Flag,
  FlaskConical,
  Home,
  Image,
  Inbox,
  Info,
  Key,
  Lock,
  Megaphone,
  MessageCircle,
  MessageSquare,
  Minus,
  Pause,
  Paperclip,
  Play,
  Plus,
  RefreshCcw,
  RefreshCw,
  RotateCcw,
  Search,
  Send,
  Settings,
  Shield,
  ShieldCheck,
  Smile,
  Sparkles,
  Star,
  Trash2,
  Upload,
  User,
  UserPlus,
  Workflow,
  X,
  Zap,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { D, DATA, LANG_FLAG } from "../../constants/data";
import { useModal } from "../../hooks/useModal";
import {
  Btn,
  Card,
  CTip,
  Chip,
  Confirm,
  Field,
  HealthBar,
  Input,
  Modal,
  PHeader,
  SLabel,
  Sel,
  TabBar,
  Textarea,
  Toggle,
} from "../common/components";

export default function Dashboard({ toast }) {
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
