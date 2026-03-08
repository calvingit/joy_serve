/* 状态标签组件，用于展示轻量状态信息。 */
import { D } from "../../../constants/data";

export default function Chip({ type="slate", children }) {
  const C = {
    success : { bg:D.greenPale, c:D.green, brd:"transparent" },
    warning : { bg:D.amberPale, c:D.amber, brd:"transparent" },
    danger  : { bg:D.redPale,   c:D.red,   brd:"transparent" },
    brand   : { bg:D.brandPale, c:D.brand, brd:"transparent" },
    slate   : { bg:D.slatePale, c:D.slate, brd:"transparent" },
  }[type]||{bg:D.slatePale,c:D.slate,brd:"transparent"};
  return <span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"4px 10px",borderRadius:99,fontSize:12,fontWeight:600,background:C.bg,color:C.c,border:`1px solid ${C.brd}`,letterSpacing:"0.02em",whiteSpace:"nowrap"}}>{children}</span>;
}
