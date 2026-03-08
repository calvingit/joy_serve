/* 卡片容器组件，用于承载分组内容。 */
import { D } from "../../../constants/data";

export default function Card({ children, pad=20, style:ex={}, onClick }) {
  return <div onClick={onClick} style={{background:D.bgCard,borderRadius:10,border:`1px solid ${D.border}`,boxShadow:D.s1,padding:pad,overflow:"hidden",...ex}}>{children}</div>;
}
