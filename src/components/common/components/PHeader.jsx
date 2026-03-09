/* 页面头部组件，支持返回与操作按钮。 */
import { ArrowLeft } from "lucide-react";
import { D } from "../../../constants/data";
import Btn from "./Btn";

export default function PHeader({ title, sub, back, onBack, children }) {
  return (
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:28,gap:20}}>
      <div style={{display:"flex",alignItems:"flex-start",gap:14}}>
        {back&&<Btn v="sub" sz="sm" onClick={onBack} style={{borderRadius:99}}><ArrowLeft size={16}/></Btn>}
        <div>
          <h2 style={{fontSize:32,fontWeight:800,color:D.textPrimary,margin:0,letterSpacing:"-0.04em",fontFamily:D.fontDisplay,lineHeight:1.05}}>{title}</h2>
          {sub&&<p style={{fontSize:14,color:D.textSecondary,margin:"8px 0 0",lineHeight:1.6,maxWidth:680}}>{sub}</p>}
        </div>
      </div>
      {children&&<div style={{display:"flex",gap:12,alignItems:"center",flexWrap:"wrap",justifyContent:"flex-end"}}>{children}</div>}
    </div>
  );
}
