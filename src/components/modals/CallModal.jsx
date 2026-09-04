import { Phone, MessageCircle, X } from "lucide-react";
import { useWoko } from '../../WokoContext.jsx';

export const CallModal = () => {
  const { T, callModal, setCallModal, findV } = useWoko();
  if(!callModal) return null;
  const v = findV(callModal);
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={()=>setCallModal(null)}>
      <div style={{background:T.card,borderRadius:"16px 16px 0 0",padding:"24px 20px 40px",width:"100%",maxWidth:500}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <span style={{fontSize:18,fontWeight:700,color:T.text}}>Contacter</span>
          <button style={{background:"none",border:"none",cursor:"pointer",color:T.sub}} onClick={()=>setCallModal(null)}><X size={20}/></button>
        </div>
        <div style={{display:"flex",gap:12,marginBottom:12}}>
          <a href={`tel:${v?.phone}`} style={{flex:1,background:T.orange,color:"#fff",border:"none",borderRadius:25,padding:"13px",fontSize:14,fontWeight:700,textDecoration:"none",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            <Phone size={16}/> Appeler
          </a>
          <a href={`https://wa.me/${v?.phone?.replace(/[^0-9]/g,"")}`} target="_blank" rel="noreferrer"
            style={{flex:1,background:"#25D366",color:"#fff",border:"none",borderRadius:25,padding:"13px",fontSize:14,fontWeight:700,textDecoration:"none",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            <MessageCircle size={16}/> WhatsApp
          </a>
        </div>
        <div style={{textAlign:"center",color:T.sub,fontSize:13}}>{v?.phone}</div>
      </div>
    </div>
  );
};
