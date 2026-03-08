/* 通用输入框组件，支持前缀与样式扩展。 */
import { D } from "../../../constants/data";

export default function Input({ value, onChange, placeholder, type="text", prefix, style:ex={} }) {
  return (
    <div style={{display:"flex",alignItems:"center",border:`1px solid ${D.border}`,borderRadius:7,overflow:"hidden",background:D.bgCard,...ex}}>
      {prefix&&<span style={{padding:"0 10px",color:D.t4,borderRight:`1px solid ${D.border}`,background:D.bgSub,fontSize:13,display:"flex",alignItems:"center",alignSelf:"stretch"}}>{prefix}</span>}
      <input type={type} value={value||""} onChange={onChange} placeholder={placeholder} style={{flex:1,border:"none",outline:"none",padding:"9px 11px",fontSize:13,color:D.t2,fontFamily:"inherit",background:"transparent"}}/>
    </div>
  );
}
