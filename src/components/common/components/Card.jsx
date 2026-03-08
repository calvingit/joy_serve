/* 卡片容器组件，用于承载分组内容。 */
import { D } from "../../../constants/data";

export default function Card({ children, pad=24, style:ex={}, onClick }) {
  return <div onClick={onClick} style={{background:D.bgCard,borderRadius:D.radiusCard,boxShadow:D.s1,padding:pad,overflow:"hidden",...ex}}>{children}</div>;
}
