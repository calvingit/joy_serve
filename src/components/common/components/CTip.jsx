/* Recharts 自定义提示组件。 */
import { D } from "../../../constants/data";

const CTip = ({ active, payload, label }) => {
  if (!active||!payload?.length) return null;
  return (
    <div style={{background:D.bgCard,border:`1px solid ${D.border}`,borderRadius:16,padding:"12px 14px",boxShadow:D.s2,fontSize:12}}>
      <div style={{color:D.t4,marginBottom:6,fontWeight:700,fontFamily:D.fontDisplay}}>{label}</div>
      {payload.map((p,i)=>(
        <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:2}}>
          <span style={{width:8,height:8,borderRadius:2,background:p.color,display:"inline-block"}}/>
          <span style={{color:D.t3}}>{p.name}：</span>
          <strong style={{color:D.t1,fontFamily:D.fontDisplay}}>{p.value?.toLocaleString()}</strong>
        </div>
      ))}
    </div>
  );
};

export default CTip;
