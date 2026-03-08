/* 统一按钮组件，封装尺寸与视觉变体。 */
import { D } from "../../../constants/data";

export default function Btn({ v="default", sz="md", onClick, disabled, children, full=false, style:ex={} }) {
  const S = { sm:{h:30,px:10,fs:12,r:6}, md:{h:34,px:14,fs:13,r:7}, lg:{h:40,px:18,fs:14,r:8} }[sz];
  const V = {
    primary : { bg:D.brand,     c:"#fff",  brd:D.brand,     sh:D.sBlue  },
    default : { bg:D.bgCard,    c:D.t2,    brd:D.border,    sh:"none"   },
    ghost   : { bg:D.brandPale, c:D.brand, brd:D.brandEdge, sh:"none"   },
    danger  : { bg:D.redPale,   c:D.red,   brd:D.redEdge,   sh:"none"   },
    sub     : { bg:D.bgSub,     c:D.t3,    brd:D.border,    sh:"none"   },
    text    : { bg:"transparent",c:D.brand,brd:"transparent",sh:"none"  },
  }[v]||{bg:D.bgCard,c:D.t2,brd:D.border,sh:"none"};
  return (
    <button onClick={onClick} disabled={disabled} style={{display:"inline-flex",alignItems:"center",justifyContent:"center",gap:5,height:S.h,padding:`0 ${S.px}px`,borderRadius:S.r,fontSize:S.fs,fontWeight:500,cursor:disabled?"not-allowed":"pointer",border:`1px solid ${V.brd}`,background:V.bg,color:V.c,boxShadow:V.sh,opacity:disabled?.45:1,transition:"all .13s",outline:"none",fontFamily:"inherit",width:full?"100%":"auto",whiteSpace:"nowrap",letterSpacing:"-0.1px",...ex}}>
      {children}
    </button>
  );
}
