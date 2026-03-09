/* 区块标题组件，支持右侧操作区。 */
import { D } from "../../../constants/data";

export default function SLabel({ children, action }) {
  return (
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,gap:12}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <span style={{display:"inline-block",width:8,height:8,borderRadius:"50%",background:D.brand}}/>
        <span style={{fontSize:14,fontWeight:700,color:D.t1,letterSpacing:"-0.02em",fontFamily:D.fontDisplay}}>{children}</span>
      </div>
      {action}
    </div>
  );
}
