/* 通用输入框组件，支持前缀与样式扩展。 */
import { D } from "../../../constants/data";

export default function Input({
  id,
  name,
  value,
  onChange,
  placeholder,
  type="text",
  prefix,
  style:ex={},
  ...rest
}) {
  return (
    <div style={{display:"flex",alignItems:"center",border:`1px solid ${D.border}`,borderRadius:D.radiusInput,overflow:"hidden",background:D.bgInput,boxShadow:D.s0,transition:"all .2s ease",...ex}}>
      {prefix&&<span style={{padding:"0 12px",color:D.t3,borderRight:`1px solid ${D.border}`,background:D.bgSub,fontSize:12,display:"flex",alignItems:"center",alignSelf:"stretch",fontWeight:700,fontFamily:D.fontDisplay}}>{prefix}</span>}
      <input id={id} name={name} type={type} value={value||""} onChange={onChange} placeholder={placeholder} style={{flex:1,border:"none",outline:"none",padding:"11px 14px",fontSize:13,color:D.t2,fontFamily:D.fontBody,background:"transparent"}} {...rest}/>
    </div>
  );
}
