/* 知识库页面：管理知识条目、覆盖率与同步任务。 */
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

export default function Knowledge({ toast }) {
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
              <input name="knowledge-search" value={search} onChange={e=>setSearch(e.target.value)} placeholder="搜索条目…" style={{padding:"10px 12px 10px 30px",background:D.bgInput,border:`1px solid ${D.border}`,borderRadius:14,color:D.t2,fontSize:12,outline:"none",fontFamily:D.fontBody,width:196,boxShadow:D.s0}}/>
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
                <input name={`knowledge-lang-${l}`} type="checkbox" defaultChecked style={{accentColor:D.brand}}/>{LANG_FLAG[l]} {{vi:"越南语",th:"泰语",id:"印尼语",ms:"马来语",en:"英语",fil:"菲律宾语"}[l]}
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
