/* AI 客服中心页面：管理 Agent、技能市场与演练场。 */
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

export default function AIAgents({ toast }) {
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
                  <input name="agent-reply-style" type="radio" checked={obData.style===s} onChange={()=>setObData(p=>({...p,style:s}))} style={{accentColor:D.brand}}/>{s}
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
          <div style={{background:"linear-gradient(135deg, rgba(72,128,255,0.18) 0%, rgba(72,128,255,0.08) 100%)",border:`1px solid ${D.brandEdge}`,borderRadius:20,padding:"18px 22px",display:"flex",justifyContent:"space-between",alignItems:"center",boxShadow:D.s1,marginBottom:4}}>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <div style={{width:44,height:44,borderRadius:14,background:D.bgCard,display:"flex",alignItems:"center",justifyContent:"center",border:`1px solid ${D.brandEdge}`}}><Shield size={20} color={D.brand}/></div>
              <div>
                <p style={{fontSize:15,fontWeight:700,color:D.t1,margin:0,fontFamily:D.fontDisplay}}>客服主管 Agent（Manager Layer）</p>
                <p style={{fontSize:12,color:D.t3,margin:"4px 0 0"}}>统一协调子 Agent · 退款审批 $100 · 情绪熔断 40分 · 智能软着陆转人工</p>
              </div>
            </div>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <span style={{fontSize:11,background:D.bgCard,border:`1px solid ${D.greenEdge}`,borderRadius:999,padding:"5px 10px",color:D.green,display:"flex",alignItems:"center",gap:4,fontWeight:700,fontFamily:D.fontDisplay}}><Activity size={10}/>运行中</span>
              <Btn v="ghost" sz="sm" onClick={managerModal.show}><Edit3 size={11}/>配置</Btn>
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
                <select name="agent-playground-selector" style={{padding:"8px 10px",border:`1px solid ${D.border}`,borderRadius:12,fontSize:12,color:D.t2,background:D.bgInput,outline:"none",fontFamily:D.fontBody,boxShadow:D.s0}}>
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
                <input name="agent-playground-input" value={playInput} onChange={e=>setPlayInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")doPlay();}} placeholder="模拟买家消息，回车发送…" style={{flex:1,padding:"10px 12px",background:D.bgInput,border:`1px solid ${D.border}`,borderRadius:14,color:D.t2,fontSize:12,outline:"none",fontFamily:D.fontBody,boxShadow:D.s0}}/>
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
                <input name={`installed-skill-${s.id}`} type="checkbox" defaultChecked style={{accentColor:D.brand}}/>{s.icon} {s.name}
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
