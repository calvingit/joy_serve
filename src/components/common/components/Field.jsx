/* 表单项包装组件，统一标签与帮助文案布局。 */
import { D } from "../../../constants/data";

export default function Field({ label, req, help, children }) {
  return (
    <div style={{marginBottom:18}}>
      {label&&<label style={{display:"block",fontSize:12,fontWeight:500,color:D.t3,marginBottom:6,letterSpacing:"0.2px",textTransform:"uppercase"}}>
        {req&&<span style={{color:D.red,marginRight:2}}>*</span>}{label}
      </label>}
      {children}
      {help&&<div style={{fontSize:12,color:D.t4,marginTop:5,lineHeight:1.5}}>{help}</div>}
    </div>
  );
}
