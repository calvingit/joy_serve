/* 客服工作台页面：处理会话、人工接管与转接。 */
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

export default function Console({ toast }) {
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
    <div style={{display:"flex",height:"calc(100vh - 116px)",background:D.bgCard,borderRadius:24,border:`1px solid ${D.border}`,boxShadow:D.s1,overflow:"hidden"}}>

      {/* Session list */}
      <div style={{width:280,borderRight:`1px solid ${D.border}`,display:"flex",flexDirection:"column",flexShrink:0,background:D.bgCard}}>
        <div style={{padding:"16px 16px 12px",borderBottom:`1px solid ${D.divider}`}}>
          <div style={{position:"relative",marginBottom:8}}>
            <Search size={13} style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:D.t4}}/>
            <input name="console-search-sessions" placeholder="搜索会话…" style={{width:"100%",padding:"10px 12px 10px 34px",background:D.bgInput,border:`1px solid ${D.border}`,borderRadius:14,color:D.t2,fontSize:12,outline:"none",boxSizing:"border-box",fontFamily:D.fontBody,boxShadow:D.s0}}/>
          </div>
          <div style={{display:"flex",gap:6,padding:4,background:D.bgSub,borderRadius:14,border:`1px solid ${D.border}`}}>
            {[{k:"all",l:"全部"},{k:"ai",l:"AI"},{k:"human",l:"人工"},{k:"pending",l:"待处理"}].map(f=>(
              <button key={f.k} onClick={()=>setFilter(f.k)} style={{flex:1,padding:"8px 2px",borderRadius:10,fontSize:11,cursor:"pointer",background:filter===f.k?D.bgCard:"transparent",color:filter===f.k?D.brand:D.t4,border:`1px solid ${filter===f.k?D.brandEdge:"transparent"}`,fontWeight:filter===f.k?700:500,transition:"all .13s",fontFamily:D.fontDisplay,boxShadow:filter===f.k?D.s0:"none"}}>{f.l}</button>
            ))}
          </div>
        </div>
        <div style={{flex:1,overflowY:"auto"}}>
          {filtered.map(s=>(
            <div key={s.id} onClick={()=>setActiveS(s)} style={{padding:"14px 16px",cursor:"pointer",borderBottom:`1px solid ${D.divider}`,background:activeS?.id===s.id?D.brandPale:"transparent",transition:"all .13s"}}>
              <div style={{display:"flex",gap:8}}>
                <div style={{position:"relative",flexShrink:0}}>
                  <div style={{width:38,height:38,borderRadius:"50%",background:D.bgSub,color:D.t3,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,border:`1px solid ${D.border}`,fontFamily:D.fontDisplay}}>{s.avatar}</div>
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
      <div style={{flex:1,display:"flex",flexDirection:"column",background:D.bgPanel,minWidth:0}}>
        {/* Chat header */}
        <div style={{padding:"0 20px",height:68,borderBottom:`1px solid ${D.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",background:D.bgCard,flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:38,height:38,borderRadius:"50%",background:D.bgSub,color:D.t3,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:12,border:`1px solid ${D.border}`,fontFamily:D.fontDisplay}}>{activeS?.avatar}</div>
            <div>
              <p style={{fontSize:14,fontWeight:700,color:D.t1,margin:0,fontFamily:D.fontDisplay}}>{activeS?.buyer}</p>
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
        <div style={{flex:1,overflowY:"auto",padding:"24px",display:"flex",flexDirection:"column",gap:14}}>
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
                    <div style={{padding:"12px 15px",borderRadius:m.role==="buyer"?"18px 18px 6px 18px":"6px 18px 18px 18px",background:m.role==="buyer"?D.brand:D.bgCard,border:m.role==="buyer"?"none":`1px solid ${D.border}`,color:m.role==="buyer"?"#fff":D.t2,fontSize:12,lineHeight:1.75,whiteSpace:"pre-line",boxShadow:m.role==="ai"?D.s0:"none"}}>{m.text}</div>
                    {m.role==="buyer"&&<p style={{fontSize:10,color:D.t4,margin:"3px 0 0",textAlign:"right"}}>{m.time}</p>}
                  </div>
                </div>
              )}
            </div>
          ))}
          <div ref={endRef}/>
        </div>

        {/* Input */}
        <div style={{padding:"16px 18px",borderTop:`1px solid ${D.border}`,background:D.bgCard,flexShrink:0}}>
          <div style={{border:`1px solid ${D.border}`,borderRadius:18,overflow:"hidden",boxShadow:D.s0,background:D.bgInput}}>
            <textarea name="console-reply-input" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}} placeholder={takeover?"以人工身份回复…":"输入消息…"} rows={3} style={{width:"100%",border:"none",padding:"14px 16px",color:D.t2,fontSize:13,resize:"none",outline:"none",lineHeight:1.7,background:"transparent",boxSizing:"border-box",fontFamily:D.fontBody}}/>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 12px",borderTop:`1px solid ${D.divider}`,background:D.bgCard}}>
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
