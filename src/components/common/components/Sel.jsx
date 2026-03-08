/* 通用下拉选择组件。 */
import { D } from "../../../constants/data";

export default function Sel({ value, onChange, opts }) {
  return <div style={{position:"relative"}}>
    <select value={value||""} onChange={e=>onChange(e.target.value)} style={{width:"100%",padding:"10px 14px",border:`1px solid ${D.border}`,borderRadius:12,fontSize:14,color:D.t2,background:D.bgInput,outline:"none",fontFamily:"inherit",cursor:"pointer",appearance:"none"}}>
      {opts.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}
    </select>
    <div style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",pointerEvents:"none",color:D.textTertiary}}>▼</div>
  </div>;
}
