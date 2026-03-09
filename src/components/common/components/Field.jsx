/* 表单项包装组件，统一标签与帮助文案布局。 */
import { D } from "../../../constants/data";

export default function Field({ label, req, help, children }) {
  return (
    <div style={{marginBottom:20}}>
      {label&&<label style={{display:"block",fontSize:11,fontWeight:700,color:D.t3,marginBottom:8,letterSpacing:"0.08em",textTransform:"uppercase",fontFamily:D.fontDisplay}}>
        {req&&<span style={{color:D.red,marginRight:2}}>*</span>}{label}
      </label>}
      {children}
      {help&&<div style={{fontSize:12,color:D.t4,marginTop:6,lineHeight:1.6}}>{help}</div>}
    </div>
  );
}
