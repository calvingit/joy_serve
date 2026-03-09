/* 通用下拉选择组件。 */
import { D } from "../../../constants/data";

export default function Sel({ id, name, value, onChange, opts, ...rest }) {
  return <div style={{position:"relative"}}>
    <select id={id} name={name} value={value||""} onChange={e=>onChange(e.target.value)} style={{width:"100%",padding:"11px 38px 11px 14px",border:`1px solid ${D.border}`,borderRadius:D.radiusInput,fontSize:13,color:D.t2,background:D.bgInput,outline:"none",fontFamily:D.fontBody,cursor:"pointer",appearance:"none",boxShadow:D.s0}} {...rest}>
      {opts.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}
    </select>
    <div style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",pointerEvents:"none",color:D.textTertiary,fontSize:10}}>▼</div>
  </div>;
}
