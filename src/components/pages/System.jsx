/* 系统管理页面：店铺授权、成员权限与合规设置。 */
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

export default function System({ toast }) {
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
                <div style={{position:"relative",display:"inline-block"}}><Search size={12} style={{position:"absolute",left:11,top:"50%",transform:"translateY(-50%)",color:D.t4}}/><input name="audit-search" placeholder="搜索…" style={{padding:"10px 12px 10px 31px",background:D.bgInput,border:`1px solid ${D.border}`,borderRadius:14,fontSize:12,outline:"none",fontFamily:D.fontBody,color:D.t2,boxShadow:D.s0}}/></div>
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
