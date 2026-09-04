import { useState, useEffect } from "react";
import { ArrowLeft, CalendarDays, MessageCircle } from "lucide-react";
import { useWoko } from '../WokoContext.jsx';
import { supabase } from '../supabase.js';

export const MyAppointmentsScreen = () => {
  const { T, user, go } = useWoko();
  const [myAppts, setMyAppts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    const load = async () => {
      if(!user) return;
      try {
        const {data} = await supabase
          .from('appointments')
          .select('*, vendors(name,phone,city), products(title,type)')
          .eq('buyer_id', user.id)
          .order('appointment_date', {ascending:false});
        setMyAppts(data||[]);
      } catch(e){console.error(e);}
      setLoading(false);
    };
    load();
  },[user?.id]);

  const cancelAppt = async (id) => {
    if(!window.confirm("Annuler ce rendez-vous ?")) return;
    await supabase.from('appointments').update({status:'cancelled'}).eq('id',id);
    setMyAppts(prev=>prev.map(a=>a.id===id?{...a,status:'cancelled'}:a));
  };

  return (
    <div style={{paddingBottom:70}}>
      <div style={{background:T.headerTop,padding:"12px 14px",display:"flex",alignItems:"center",gap:12}}>
        <button style={{background:"none",border:"none",color:"#fff",cursor:"pointer"}} onClick={()=>go("profile")}><ArrowLeft size={20}/></button>
        <span style={{color:"#fff",fontWeight:700,fontSize:17}}>Mes rendez-vous</span>
      </div>
      <div style={{padding:"12px 16px"}}>
        {loading
          ?<div style={{textAlign:"center",padding:40,color:T.sub}}>Chargement...</div>
          :myAppts.length===0
          ?<div style={{textAlign:"center",padding:"60px 20px"}}>
            <CalendarDays size={48} color={T.border} style={{margin:"0 auto 16px",display:"block"}}/>
            <div style={{fontSize:16,fontWeight:700,color:T.text,marginBottom:8}}>Aucun rendez-vous</div>
            <button style={{background:T.orange,color:"#fff",border:"none",borderRadius:10,padding:"12px 24px",fontSize:14,fontWeight:700,cursor:"pointer"}} onClick={()=>go("home")}>Explorer le marché</button>
          </div>
          :myAppts.map(a=>(
            <div key={a.id} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:14,marginBottom:10}}>
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:8}}>
                <div>
                  <div style={{fontSize:15,fontWeight:700,color:T.text}}>{a.products?.title||"Service"}</div>
                  <div style={{fontSize:13,color:T.sub}}>{a.vendors?.name}</div>
                </div>
                <span style={{background:a.status==="confirmed"?"#E8F5E9":a.status==="cancelled"?"#FFEBEE":"#FFF3E0",color:a.status==="confirmed"?"#2E7D32":a.status==="cancelled"?"#E53935":"#E65100",borderRadius:20,padding:"4px 10px",fontSize:11,fontWeight:700,whiteSpace:"nowrap",marginLeft:8}}>
                  {a.status==="confirmed"?"✅ Confirmé":a.status==="cancelled"?"❌ Annulé":"⏳ En attente"}
                </span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:16,fontSize:13,color:T.sub,marginBottom:a.status==="pending"?10:0}}>
                <span>📅 {new Date(a.appointment_date).toLocaleDateString('fr-FR',{weekday:'short',day:'numeric',month:'short'})}</span>
                <span>🕐 {a.appointment_time?.slice(0,5)}</span>
                {a.vendors?.city&&<span>📍 {a.vendors.city}</span>}
              </div>
              {a.status==="pending"&&(
                <div style={{display:"flex",gap:8}}>
                  <a href={`https://wa.me/${a.vendors?.phone?.replace(/[^0-9]/g,"")}`} target="_blank" rel="noreferrer"
                    style={{flex:1,background:"#25D366",color:"#fff",border:"none",borderRadius:8,padding:"8px",fontSize:12,fontWeight:700,textDecoration:"none",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                    <MessageCircle size={13}/> WhatsApp
                  </a>
                  <button style={{flex:1,background:"#FFEBEE",color:"#E53935",border:"none",borderRadius:8,padding:"8px",fontSize:12,fontWeight:700,cursor:"pointer"}} onClick={()=>cancelAppt(a.id)}>
                    Annuler
                  </button>
                </div>
              )}
            </div>
          ))
        }
      </div>
    </div>
  );
};
