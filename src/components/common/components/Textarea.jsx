/* 多行文本输入组件。 */
import { D } from "../../../constants/data";

export default function Textarea({ id, name, value, onChange, placeholder, rows=4, ...rest }) {
  return <textarea id={id} name={name} value={value||""} onChange={onChange} placeholder={placeholder} rows={rows} style={{width:"100%",padding:"12px 14px",border:`1px solid ${D.border}`,borderRadius:D.radiusInput,fontSize:13,color:D.t2,background:D.bgInput,outline:"none",resize:"vertical",fontFamily:D.fontBody,lineHeight:1.7,boxSizing:"border-box",boxShadow:D.s0}} {...rest}/>;
}
