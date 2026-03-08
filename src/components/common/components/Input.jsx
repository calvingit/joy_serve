/* 通用输入框组件，支持前缀与样式扩展。 */
import { D } from "../../../constants/data";

export default function Input({ value, onChange, placeholder, type="text", prefix, style:ex={} }) {
  return (
    <div style={{display:"flex",alignItems:"center",border:`1px solid ${D.border}`,borderRadius:D.radiusInput,overflow:"hidden",background:D.bgInput,transition:"all .2s ease",...ex}}>
      {prefix&&<span style={{padding:"0 12px",color:D.t3,borderRight:`1px solid ${D.border}`,background:"transparent",fontSize:13,display:"flex",alignItems:"center",alignSelf:"stretch",fontWeight:500}}>{prefix}</span>}
      <input type={type} value={value||""} onChange={onChange} placeholder={placeholder} style={{flex:1,border:"none",outline:"none",padding:"10px 14px",fontSize:14,color:D.t2,fontFamily:"inherit",background:"transparent"}}/>
    </div>
  );
}
