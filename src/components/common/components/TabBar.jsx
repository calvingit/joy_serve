/* 页签切换组件，支持计数徽标。 */
import { D } from "../../../constants/data";

export default function TabBar({ tabs, active, onChange, style:ex={} }) {
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
