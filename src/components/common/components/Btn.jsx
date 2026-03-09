/* 统一按钮组件，封装尺寸与视觉变体。 */
import { D } from "../../../constants/data";

export default function Btn({ v="default", sz="md", onClick, disabled, children, full=false, style:ex={} }) {
  const S = { sm:{h:34,px:14,fs:12,r:D.radiusBtn}, md:{h:42,px:18,fs:13,r:D.radiusBtn}, lg:{h:48,px:22,fs:14,r:D.radiusBtn} }[sz];
  const V = {
    primary : { bg:D.brand,     c:"#fff",  brd:"transparent", sh:D.sBlue  },
    default : { bg:D.bgCard,    c:D.t2,    brd:D.border,      sh:"none"   },
    ghost   : { bg:D.brandPale, c:D.brand, brd:D.brandEdge,   sh:"none"   },
    danger  : { bg:D.redPale,   c:D.red,   brd:D.redEdge,     sh:"none"   },
    sub     : { bg:D.bgSub,     c:D.t3,    brd:D.border,      sh:"none"   },
    text    : { bg:"transparent",c:D.brand,brd:"transparent", sh:"none"   },
  }[v]||{bg:D.bgCard,c:D.t2,brd:D.border,sh:"none"};
  return (
    <button onClick={onClick} disabled={disabled} style={{display:"inline-flex",alignItems:"center",justifyContent:"center",gap:6,height:S.h,padding:`0 ${S.px}px`,borderRadius:S.r,fontSize:S.fs,fontWeight:700,cursor:disabled?"not-allowed":"pointer",border:`1px solid ${V.brd}`,background:V.bg,color:V.c,boxShadow:V.sh,opacity:disabled?.6:1,transition:"transform .18s ease, box-shadow .18s ease, background .18s ease, border-color .18s ease",outline:"none",fontFamily:D.fontDisplay,width:full?"100%":"auto",whiteSpace:"nowrap",letterSpacing:"0.01em",...ex}}>
      {children}
    </button>
  );
}
