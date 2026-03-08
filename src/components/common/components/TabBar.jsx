/* 页签切换组件，支持计数徽标。 */
import { D } from "../../../constants/data";

export default function TabBar({ tabs, active, onChange, style:ex={} }) {
  return (
    <div style={{display:"flex",borderBottom:`1px solid ${D.divider}`,gap:16,...ex}}>
      {tabs.map(t=>(
        <button key={t.k} onClick={()=>onChange(t.k)} style={{padding:"12px 4px",background:"none",border:"none",cursor:"pointer",color:active===t.k?D.brand:D.textSecondary,fontWeight:active===t.k?600:500,borderBottom:`2px solid ${active===t.k?D.brand:"transparent"}`,fontSize:14,transition:"all .2s",marginBottom:-1,fontFamily:"inherit",display:"flex",alignItems:"center",gap:6,whiteSpace:"nowrap"}}>
          {t.l}
          {t.n!=null&&<span style={{padding:"2px 8px",borderRadius:99,background:active===t.k?D.brandPale:D.bgSub,color:active===t.k?D.brand:D.textTertiary,fontSize:11,fontWeight:700}}>{t.n}</span>}
        </button>
      ))}
    </div>
  );
}
