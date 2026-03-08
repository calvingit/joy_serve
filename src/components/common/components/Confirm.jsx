/* 确认弹窗组件，封装确认/取消流程。 */
import { D } from "../../../constants/data";
import Modal from "./Modal";
import Btn from "./Btn";

export default function Confirm({ open, onClose, onConfirm, title, body, dangerous }) {
  if (!open) return null;
  return (
    <Modal open={open} onClose={onClose} title={title} width={400}
      footer={<><Btn onClick={onClose}>取消</Btn><Btn v={dangerous?"danger":"primary"} onClick={()=>{onConfirm();onClose();}}>{dangerous?"确认删除":"确认"}</Btn></>}>
      <p style={{fontSize:14,color:D.t2,lineHeight:1.75,margin:0}}>{body}</p>
    </Modal>
  );
}
