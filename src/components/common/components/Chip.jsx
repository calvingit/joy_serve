/* 状态标签组件，用于展示轻量状态信息。 */
import { D } from "../../../constants/data";

export default function Chip({ type="slate", children }) {
  const C = {
    success : { bg:D.greenPale, c:D.green, brd:D.greenEdge },
    warning : { bg:D.amberPale, c:D.amber, brd:D.amberEdge },
    danger  : { bg:D.redPale,   c:D.red,   brd:D.redEdge },
    brand   : { bg:D.brandPale, c:D.brand, brd:D.brandEdge },
    slate   : { bg:D.slatePale, c:D.slate, brd:D.slateEdge },
  }[type]||{bg:D.slatePale,c:D.slate,brd:"transparent"};
  return <span style={{display:"inline-flex",alignItems:"center",gap:5,padding:"5px 10px",borderRadius:99,fontSize:11,fontWeight:700,background:C.bg,color:C.c,border:`1px solid ${C.brd}`,letterSpacing:"0.01em",whiteSpace:"nowrap",fontFamily:D.fontDisplay}}>{children}</span>;
}
