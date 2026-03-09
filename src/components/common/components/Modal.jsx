/* 通用弹窗容器组件，提供遮罩、标题与底部操作区。 */
import { X } from "lucide-react";
import { D } from "../../../constants/data";

export default function Modal({ open, onClose, title, width=520, children, footer }) {
  if (!open) return null;
  return (
    <div style={{position:"fixed",inset:0,zIndex:900,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div onClick={onClose} style={{position:"absolute",inset:0,background:D.overlay,backdropFilter:"blur(10px)"}}/>
      <div style={{position:"relative",width,maxWidth:"92vw",maxHeight:"90vh",background:D.bgCard,borderRadius:24,boxShadow:D.s3,display:"flex",flexDirection:"column",overflow:"hidden",border:`1px solid ${D.border}`}}>
        <div style={{padding:"24px 24px 18px",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
          <span style={{fontSize:20,fontWeight:800,color:D.textPrimary,letterSpacing:"-0.03em",fontFamily:D.fontDisplay}}>{title}</span>
          <button onClick={onClose} style={{background:D.bgSub,border:"none",cursor:"pointer",color:D.textSecondary,display:"flex",padding:6,borderRadius:99,transition:"all .2s",hover:{background:D.border}}}
            onMouseEnter={e=>e.currentTarget.style.color=D.t2} onMouseLeave={e=>e.currentTarget.style.color=D.textSecondary}><X size={18}/></button>
        </div>
        <div style={{padding:"0 24px 24px",overflowY:"auto",flex:1}}>{children}</div>
        {footer&&<div style={{padding:"18px 24px",borderTop:`1px solid ${D.divider}`,display:"flex",justifyContent:"flex-end",gap:12,flexShrink:0,background:D.bgSub}}>{footer}</div>}
      </div>
    </div>
  );
}
