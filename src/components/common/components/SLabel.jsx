/* 区块标题组件，支持右侧操作区。 */
import { D } from "../../../constants/data";

export default function SLabel({ children, action }) {
  return (
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
      <div style={{display:"flex",alignItems:"center",gap:9}}>
        <span style={{display:"inline-block",width:3,height:14,borderRadius:2,background:D.brand}}/>
        <span style={{fontSize:13,fontWeight:600,color:D.t1,letterSpacing:"-0.1px"}}>{children}</span>
      </div>
      {action}
    </div>
  );
}
