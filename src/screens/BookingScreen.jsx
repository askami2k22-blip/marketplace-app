import { useState } from "react";
import { ArrowLeft, CheckCircle2, CalendarDays } from "lucide-react";
import { useWoko } from '../WokoContext.jsx';
import { CalendarPicker } from '../components/CalendarPicker.jsx';
import { supabase } from '../supabase.js';

const SLOTS = ["09:00","10:00","11:00","14:00","15:00","16:00"];
const SLOT_TAKEN = {};

export const BookingScreen = () => {
  const { T, screenId, findP, getProductVendor, user, setLoginModal, go } = useWoko();
  const p = findP(screenId);
  const [confirmed, setConfirmed] = useState(false);
  const [bookDay, setBookDay] = useState(null);
  const [bookSlot, setBookSlot] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if(!p) return null;
  const v = getProductVendor(p) || {name:"Vendeur",zone:"",phone:""};

  if(confirmed) return (
    <div style={{padding:"60px 20px",textAlign:"center"}}>
      <div style={{width:64,height:64,borderRadius:"50%",background:"#E8F5E9",color:"#2E7D32",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}><CheckCircle2 size={32}/></div>
      <div style={{fontSize:20,fontWeight:700,color:T.text,marginBottom:8}}>Rendez-vous confirmé !</div>
      <div style={{color:T.orange,fontWeight:600,marginBottom:4}}>{bookDay} à {bookSlot}</div>
      <div style={{color:T.sub,fontSize:14,marginBottom:24}}>{p.title} avec {v.name}</div>
      <button style={{background:T.orange,color:"#fff",border:"none",borderRadius:10,padding:"13px 24px",fontSize:15,fontWeight:700,cursor:"pointer"}} onClick={()=>go("home")}>Retour à l'accueil</button>
    </div>
  );

  return (
    <div style={{paddingBottom:70}}>
      <div style={{background:T.headerTop,padding:"12px 14px",display:"flex",alignItems:"center",gap:12}}>
        <button style={{background:"none",border:"none",color:"#fff",cursor:"pointer"}} onClick={()=>go("product",p.id)}><ArrowLeft size={20}/></button>
        <span style={{color:"#fff",fontWeight:700,fontSize:17}}>Prendre rendez-vous</span>
      </div>
      <div style={{padding:14}}>
        <div style={{background:T.card,borderRadius:10,padding:14,marginBottom:14}}>
          <div style={{fontSize:16,fontWeight:700,color:T.text}}>{p.title}</div>
          <div style={{fontSize:14,color:T.sub}}>{v.name} · {v.zone||v.city||""}</div>
          <div style={{fontSize:20,fontWeight:800,color:T.orange,marginTop:6}}>{Number(p.price).toLocaleString("fr-FR")} FCFA</div>
        </div>

        <div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:10}}>Choisir une date</div>
        <CalendarPicker selectedDay={bookDay} onSelect={(d)=>{setBookDay(d);setBookSlot(null);}} T={T}/>

        {bookDay&&<>
          <div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:10}}>Choisir un créneau</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:20}}>
            {SLOTS.map(sl=>{
              const taken=SLOT_TAKEN[`${bookDay}-${sl}`];
              return (
                <button key={sl} disabled={taken}
                  style={{background:taken?T.tag:(bookSlot===sl?T.orange:T.card),color:taken?T.muted:(bookSlot===sl?"#fff":T.text),border:`1px solid ${taken?T.border:(bookSlot===sl?T.orange:T.border)}`,borderRadius:8,padding:"10px 4px",cursor:taken?"not-allowed":"pointer",fontSize:13,fontWeight:600,opacity:taken?0.5:1}}
                  onClick={()=>!taken&&setBookSlot(sl)}>
                  {taken?"Complet":sl}
                </button>
              );
            })}
          </div>
        </>}

        <button
          disabled={submitting||!(bookDay&&bookSlot)}
          style={{width:"100%",background:bookDay&&bookSlot?T.orange:T.muted,color:"#fff",border:"none",borderRadius:10,padding:14,fontSize:16,fontWeight:700,cursor:bookDay&&bookSlot&&!submitting?"pointer":"not-allowed"}}
          onClick={async()=>{
            if(!bookDay||!bookSlot||submitting) return;
            if(!user){setLoginModal(true);return;}
            setSubmitting(true);
            try {
              const parts=bookDay.split('/');
              const dateStr=parts.length===3?`${parts[2]}-${parts[1]}-${parts[0]}`:bookDay;
              await supabase.from('appointments').insert({
                vendor_id:v?.id,
                product_id:p.id,
                buyer_id:user.id,
                buyer_name:user.user_metadata?.full_name||user.email?.split('@')[0],
                buyer_phone:'',
                appointment_date:dateStr,
                appointment_time:bookSlot+':00',
                status:'pending'
              });
              setConfirmed(true);
            } catch(e){
              if(e.message?.includes('one_rdv')||e.message?.includes('unique')){
                alert("Vous avez déjà un rendez-vous avec ce vendeur ce jour-là.");
              } else {
                alert("Erreur: "+e.message);
              }
            }
            setSubmitting(false);
          }}>
          {submitting?"Confirmation...":bookDay&&bookSlot?"Confirmer le rendez-vous":"Sélectionnez date et créneau"}
        </button>
      </div>
    </div>
  );
};
