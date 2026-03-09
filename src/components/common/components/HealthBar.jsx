/* 健康度进度条组件。 */
import { D } from "../../../constants/data";

export default function HealthBar({ v }) {
  const color = v>=80 ? D.brand : v>=60 ? D.amber : D.red;
  return (
    <div style={{display:"flex",alignItems:"center",gap:8}}>
      <div style={{flex:1,height:8,background:D.bgPanel,borderRadius:999,overflow:"hidden"}}>
        <div style={{width:`${v}%`,height:"100%",background:color,borderRadius:999,transition:"width .5s ease"}}/>
      </div>
      <span style={{fontSize:12,color,fontWeight:700,minWidth:32,textAlign:"right",fontFamily:D.fontDisplay}}>{v}%</span>
    </div>
  );
}
