/* 开关组件，用于布尔状态切换。 */
import { D } from "../../../constants/data";

export default function Toggle({ on, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      aria-pressed={on}
      aria-label="切换开关"
      style={{width:40,height:22,borderRadius:11,border:"none",padding:0,background:on?D.brand:D.t5,cursor:"pointer",position:"relative",transition:"background .2s",flexShrink:0}}
    >
      <div style={{position:"absolute",top:3,left:on?20:3,width:16,height:16,borderRadius:"50%",background:"#fff",transition:"left .2s",boxShadow:"0 1px 3px rgba(0,0,0,0.18)"}}/>
    </button>
  );
}
