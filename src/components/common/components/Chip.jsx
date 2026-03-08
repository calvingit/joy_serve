/* 状态标签组件，用于展示轻量状态信息。 */
import { D } from "../../../constants/data";

export default function Chip({ type="slate", children }) {
  const C = {
    success : { bg:D.greenPale, c:D.green, brd:D.greenEdge },
    warning : { bg:D.amberPale, c:D.amber, brd:D.amberEdge },
    danger  : { bg:D.redPale,   c:D.red,   brd:D.redEdge   },
    brand   : { bg:D.brandPale, c:D.brand, brd:D.brandEdge },
    slate   : { bg:D.slatePale, c:D.slate, brd:D.slateEdge },
  }[type]||{bg:D.slatePale,c:D.slate,brd:D.slateEdge};
  return <span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"2px 8px",borderRadius:5,fontSize:11,fontWeight:600,background:C.bg,color:C.c,border:`1px solid ${C.brd}`,letterSpacing:"0.1px",whiteSpace:"nowrap"}}>{children}</span>;
}
