/* 页签切换组件，支持计数徽标。 */
import { D } from "../../../constants/data";

export default function TabBar({ tabs, active, onChange, style:ex={} }) {
  return (
    <div style={{display:"flex",gap:10,padding:6,border:`1px solid ${D.border}`,background:D.bgCard,borderRadius:18,boxShadow:D.s0,width:"fit-content",maxWidth:"100%",overflowX:"auto",...ex}}>
      {tabs.map(t=>(
        <button key={t.k} onClick={()=>onChange(t.k)} style={{padding:"10px 14px",background:active===t.k?D.brandPale:"transparent",border:`1px solid ${active===t.k?D.brandEdge:"transparent"}`,cursor:"pointer",color:active===t.k?D.brand:D.textSecondary,fontWeight:active===t.k?700:500,borderRadius:14,fontSize:13,transition:"all .2s",fontFamily:D.fontDisplay,display:"flex",alignItems:"center",gap:6,whiteSpace:"nowrap"}}>
          {t.l}
          {t.n!=null&&<span style={{padding:"2px 8px",borderRadius:99,background:active===t.k?D.bgCard:D.bgSub,color:active===t.k?D.brand:D.textTertiary,fontSize:11,fontWeight:700}}>{t.n}</span>}
        </button>
      ))}
    </div>
  );
}
