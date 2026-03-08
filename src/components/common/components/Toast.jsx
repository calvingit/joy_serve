/* 全局轻提示组件，支持 success/error/info 三种状态。 */
import { useEffect } from "react";
import { X } from "lucide-react";
import { D } from "../../../constants/data";

export default function Toast({ msg, onClose }) {
  useEffect(()=>{if(msg){const id=setTimeout(onClose,3200);return()=>clearTimeout(id);}},[msg]);
  if (!msg) return null;
  const c = { success:{bg:"#F0FDF4",border:D.greenEdge,dot:D.green}, error:{bg:D.redPale,border:D.redEdge,dot:D.red}, info:{bg:D.brandPale,border:D.brandEdge,dot:D.brand} }[msg.type]||{bg:D.brandPale,border:D.brandEdge,dot:D.brand};
  return (
    <div style={{position:"fixed",top:64,right:20,zIndex:9999,minWidth:268,background:c.bg,border:`1px solid ${c.border}`,borderRadius:10,padding:"11px 16px",boxShadow:D.s2,display:"flex",alignItems:"center",gap:10,animation:"tsIn .18s ease"}}>
      <span style={{width:7,height:7,borderRadius:"50%",background:c.dot,display:"inline-block",flexShrink:0}}/>
      <span style={{fontSize:13,color:D.t2,flex:1,lineHeight:1.5}}>{msg.text}</span>
      <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:D.t4,display:"flex"}}><X size={13}/></button>
    </div>
  );
}
