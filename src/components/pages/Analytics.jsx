/* 数据洞察页面：展示运营总览、AI 效果与绩效分析。 */
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

export default function Analytics({ toast }) {
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
