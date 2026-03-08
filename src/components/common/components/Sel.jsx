/* 通用下拉选择组件。 */
import { D } from "../../../constants/data";

export default function Sel({ value, onChange, opts }) {
  return <select value={value||""} onChange={e=>onChange(e.target.value)} style={{width:"100%",padding:"9px 11px",border:`1px solid ${D.border}`,borderRadius:7,fontSize:13,color:D.t2,background:D.bgCard,outline:"none",fontFamily:"inherit",cursor:"pointer"}}>{opts.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}</select>;
}
