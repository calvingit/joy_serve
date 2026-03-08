/* 健康度进度条组件。 */
import { D } from "../../../constants/data";

export default function HealthBar({ v }) {
  const color = v>=80 ? D.brand : v>=60 ? D.amber : D.red;
  return (
    <div style={{display:"flex",alignItems:"center",gap:8}}>
      <div style={{flex:1,height:5,background:D.bgSub,borderRadius:3,overflow:"hidden"}}>
        <div style={{width:`${v}%`,height:"100%",background:color,borderRadius:3,transition:"width .5s ease"}}/>
      </div>
      <span style={{fontSize:12,color,fontWeight:600,minWidth:30,textAlign:"right"}}>{v}%</span>
    </div>
  );
}
