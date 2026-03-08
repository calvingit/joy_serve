/* 页面头部组件，支持返回与操作按钮。 */
import { ArrowLeft } from "lucide-react";
import { D } from "../../../constants/data";
import Btn from "./Btn";

export default function PHeader({ title, sub, back, onBack, children }) {
  return (
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        {back&&<Btn v="sub" sz="sm" onClick={onBack}><ArrowLeft size={14}/></Btn>}
        <div>
          <h2 style={{fontSize:20,fontWeight:700,color:D.t1,margin:0,letterSpacing:"-0.4px"}}>{title}</h2>
          {sub&&<p style={{fontSize:13,color:D.t3,margin:"4px 0 0",lineHeight:1.4}}>{sub}</p>}
        </div>
      </div>
      {children&&<div style={{display:"flex",gap:8,alignItems:"center"}}>{children}</div>}
    </div>
  );
}
