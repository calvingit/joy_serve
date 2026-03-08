/* 统一按钮组件，封装尺寸与视觉变体。 */
import { D } from "../../../constants/data";

export default function Btn({ v="default", sz="md", onClick, disabled, children, full=false, style:ex={} }) {
  const S = { sm:{h:32,px:12,fs:12,r:D.radiusBtn}, md:{h:40,px:20,fs:14,r:D.radiusBtn}, lg:{h:48,px:24,fs:15,r:D.radiusBtn} }[sz];
  const V = {
    primary : { bg:D.brand,     c:"#fff",  brd:"transparent", sh:D.sBlue  },
    default : { bg:D.bgCard,    c:D.t2,    brd:D.border,      sh:D.s0     },
    ghost   : { bg:D.brandPale, c:D.brand, brd:"transparent", sh:"none"   },
    danger  : { bg:D.redPale,   c:D.red,   brd:"transparent", sh:"none"   },
    sub     : { bg:D.bgSub,     c:D.t3,    brd:"transparent", sh:"none"   },
    text    : { bg:"transparent",c:D.brand,brd:"transparent", sh:"none"   },
  }[v]||{bg:D.bgCard,c:D.t2,brd:D.border,sh:"none"};
  return (
    <button onClick={onClick} disabled={disabled} style={{display:"inline-flex",alignItems:"center",justifyContent:"center",gap:6,height:S.h,padding:`0 ${S.px}px`,borderRadius:S.r,fontSize:S.fs,fontWeight:600,cursor:disabled?"not-allowed":"pointer",border:`1px solid ${V.brd}`,background:V.bg,color:V.c,boxShadow:V.sh,opacity:disabled?.6:1,transition:"all .2s ease",outline:"none",fontFamily:"inherit",width:full?"100%":"auto",whiteSpace:"nowrap",letterSpacing:"0.01em",...ex}}>
      {children}
    </button>
  );
}
