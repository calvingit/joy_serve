/* 通用弹窗容器组件，提供遮罩、标题与底部操作区。 */
import { X } from "lucide-react";
import { D } from "../../../constants/data";

export default function Modal({ open, onClose, title, width=520, children, footer }) {
  if (!open) return null;
  return (
    <div style={{position:"fixed",inset:0,zIndex:900,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div onClick={onClose} style={{position:"absolute",inset:0,background:"rgba(17,24,39,0.45)",backdropFilter:"blur(2px)"}}/>
      <div style={{position:"relative",width,maxWidth:"92vw",maxHeight:"90vh",background:D.bgCard,borderRadius:12,boxShadow:D.s3,display:"flex",flexDirection:"column",overflow:"hidden",border:`1px solid ${D.border}`}}>
        <div style={{padding:"20px 24px 18px",borderBottom:`1px solid ${D.divider}`,display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
          <span style={{fontSize:15,fontWeight:600,color:D.t1,letterSpacing:"-0.15px"}}>{title}</span>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:D.t4,display:"flex",padding:4,borderRadius:6,transition:"color .15s"}}
            onMouseEnter={e=>e.currentTarget.style.color=D.t3} onMouseLeave={e=>e.currentTarget.style.color=D.t4}><X size={16}/></button>
        </div>
        <div style={{padding:24,overflowY:"auto",flex:1}}>{children}</div>
        {footer&&<div style={{padding:"16px 24px",borderTop:`1px solid ${D.divider}`,display:"flex",justifyContent:"flex-end",gap:8,flexShrink:0,background:D.bgSub}}>{footer}</div>}
      </div>
    </div>
  );
}
