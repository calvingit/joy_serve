/* 多行文本输入组件。 */
import { D } from "../../../constants/data";

export default function Textarea({ value, onChange, placeholder, rows=4 }) {
  return <textarea value={value||""} onChange={onChange} placeholder={placeholder} rows={rows} style={{width:"100%",padding:"9px 11px",border:`1px solid ${D.border}`,borderRadius:7,fontSize:13,color:D.t2,background:D.bgCard,outline:"none",resize:"vertical",fontFamily:"inherit",lineHeight:1.7,boxSizing:"border-box"}}/>;
}
