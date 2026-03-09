/* 开关组件，用于布尔状态切换。 */
import { D } from "../../../constants/data";

export default function Toggle({ on, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      aria-pressed={on}
      aria-label="切换开关"
      style={{width:42,height:24,borderRadius:999,border:"none",padding:0,background:on?D.brand:D.t5,cursor:"pointer",position:"relative",transition:"background .2s",flexShrink:0}}
    >
      <div style={{position:"absolute",top:3,left:on?21:3,width:18,height:18,borderRadius:"50%",background:"#fff",transition:"left .2s",boxShadow:"0 4px 10px rgba(17, 24, 39, 0.16)"}}/>
    </button>
  );
}
