import { useState, useEffect } from "react";
import { ArrowLeft, Phone, BadgeCheck, Star } from "lucide-react";
import { useWoko } from '../WokoContext.jsx';
import { Placeholder } from '../components/Placeholder.jsx';
import { StarRating } from '../components/StarRating.jsx';

export const VendorScreen = () => {
  const { T, screenId, findV, products, go, setCallModal, user, setLoginModal } = useWoko();
  const v = findV(screenId);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const vProducts = products.filter(p => p.vendor_id===v?.id||p.vendorId===v?.id);

  useEffect(()=>{
    if(!v?.id) return;
    const load = async () => {
      try {
        const {getVendorReviews, getVendorRating, trackVendorView} = await import('../api.js');
        const [r,rt] = await Promise.all([getVendorReviews(v.id), getVendorRating(v.id)]);
        setReviews(r||[]); setRating(rt);
        trackVendorView(v.id, null);
      } catch(e){console.error(e);}
    };
    load();
  },[v?.id]);

  if(!v) return null;

  const submitReview = async () => {
    if(!newRating||!user){if(!user)setLoginModal(true);return;}
    setSubmitting(true);
    try {
      const {submitReview: sr} = await import('../api.js');
      await sr({vendor_id:v.id,buyer_id:user.id,rating:newRating,comment:comment||null});
      const {getVendorReviews,getVendorRating} = await import('../api.js');
      const [r,rt] = await Promise.all([getVendorReviews(v.id),getVendorRating(v.id)]);
      setReviews(r||[]); setRating(rt);
      setShowReviewModal(false); setNewRating(0); setComment("");
    } catch(e){
      if(e.message?.includes('one_review'))alert("Vous avez déjà laissé un avis.");
      else alert("Erreur: "+e.message);
    }
    setSubmitting(false);
  };

  return (
    <div style={{paddingBottom:70}}>
      <div style={{background:`linear-gradient(135deg,${v.color}EE,${v.color}99)`,padding:"0 0 50px"}}>
        <div style={{display:"flex",alignItems:"center",padding:"12px 14px 16px",gap:12}}>
          <button style={{background:"rgba(0,0,0,0.2)",border:"none",borderRadius:"50%",width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#fff",flexShrink:0}} onClick={()=>go("home")}><ArrowLeft size={18}/></button>
          {v.logo_url
            ?<img src={v.logo_url} alt={v.name} style={{width:52,height:52,borderRadius:"50%",objectFit:"cover",border:"3px solid rgba(255,255,255,0.5)",flexShrink:0}}/>
            :<div style={{width:52,height:52,borderRadius:"50%",background:"rgba(255,255,255,0.25)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:20,border:"3px solid rgba(255,255,255,0.5)",flexShrink:0}}>{v.initials||v.name?.[0]}</div>
          }
          <div>
            <div style={{color:"#fff",fontWeight:800,fontSize:18}}>{v.name}</div>
            <div style={{color:"rgba(255,255,255,0.8)",fontSize:12}}>{v.city||v.zone||""}</div>
            {v.certified&&<div style={{display:"inline-flex",alignItems:"center",gap:4,background:"rgba(255,255,255,0.2)",color:"#fff",borderRadius:10,padding:"2px 8px",fontSize:10,fontWeight:700,marginTop:4}}><BadgeCheck size={10}/>CERTIFIÉ</div>}
          </div>
        </div>
      </div>

      <div style={{margin:"-30px 12px 12px",background:T.card,borderRadius:12,padding:14,boxShadow:"0 2px 12px rgba(0,0,0,0.1)"}}>
        <p style={{fontSize:14,color:T.sub,margin:"0 0 12px"}}>{v.description||v.desc||""}</p>
        {rating?.average>0&&(
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
            <StarRating rating={Math.round(rating.average)} size={16}/>
            <span style={{fontSize:13,fontWeight:700,color:T.orange}}>{rating.average}</span>
            <span style={{fontSize:12,color:T.muted}}>({rating.count} avis)</span>
          </div>
        )}
        <button style={{width:"100%",background:T.orange,color:"#fff",border:"none",borderRadius:10,padding:12,fontSize:14,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}} onClick={()=>setCallModal(v.id)}>
          <Phone size={16}/>Contacter le vendeur
        </button>
      </div>

      {/* Catalogue */}
      <div style={{padding:"4px 12px 8px"}}>
        <div style={{fontSize:15,fontWeight:700,color:T.text,marginBottom:10}}>Catalogue ({vProducts.length})</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {vProducts.map(p=>{
            const isService=p.type==="service";
            return (
              <div key={p.id} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:8,overflow:"hidden",cursor:"pointer"}} onClick={()=>go("product",p.id)}>
                {p.image_url?<img src={p.image_url} style={{width:"100%",height:110,objectFit:"cover"}}/>:<Placeholder vendor={v} height={110} fontSize={22}/>}
                <div style={{padding:"8px 10px"}}>
                  <div style={{fontSize:12,fontWeight:600,color:T.text,marginBottom:2}}>{p.title}</div>
                  <div style={{fontSize:14,fontWeight:800,color:T.orange}}>{Number(p.price).toLocaleString("fr-FR")} FCFA</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews */}
      <div style={{padding:"0 12px 20px"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
          <div style={{fontSize:15,fontWeight:700,color:T.text}}>Avis clients</div>
          <button style={{background:T.orange,color:"#fff",border:"none",borderRadius:20,padding:"8px 16px",fontSize:13,fontWeight:700,cursor:"pointer"}} onClick={()=>setShowReviewModal(true)}>+ Avis</button>
        </div>
        {reviews.length===0
          ?<div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:10,padding:16,textAlign:"center",color:T.sub,fontSize:13}}>Aucun avis pour le moment.</div>
          :reviews.map(r=>(
            <div key={r.id} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:10,padding:12,marginBottom:8}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
                <StarRating rating={r.rating} size={14}/>
                <span style={{fontSize:11,color:T.muted}}>{new Date(r.created_at).toLocaleDateString("fr-FR")}</span>
              </div>
              {r.comment&&<div style={{fontSize:13,color:T.sub}}>{r.comment}</div>}
            </div>
          ))
        }
      </div>

      {/* Review Modal */}
      {showReviewModal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={()=>setShowReviewModal(false)}>
          <div style={{background:T.card,borderRadius:"20px 20px 0 0",padding:"20px 20px 40px",width:"100%",maxWidth:500}} onClick={e=>e.stopPropagation()}>
            <div style={{width:40,height:4,background:T.border,borderRadius:2,margin:"0 auto 20px"}}/>
            <div style={{fontSize:18,fontWeight:700,color:T.text,marginBottom:16,textAlign:"center"}}>Laisser un avis</div>
            <div style={{textAlign:"center",marginBottom:20}}>
              <StarRating rating={newRating} size={40} interactive={true} onRate={setNewRating}/>
              <div style={{fontSize:12,color:T.sub,marginTop:8}}>
                {newRating===0?"Touchez une étoile":newRating===1?"Très mauvais":newRating===2?"Mauvais":newRating===3?"Correct":newRating===4?"Bien":"Excellent !"}
              </div>
            </div>
            <textarea style={{width:"100%",background:T.bg,border:`1px solid ${T.border}`,borderRadius:10,padding:"12px",fontSize:14,color:T.text,outline:"none",resize:"none",boxSizing:"border-box",marginBottom:16,minHeight:80}} placeholder="Partagez votre expérience..." value={comment} onChange={e=>setComment(e.target.value)}/>
            <button style={{width:"100%",background:newRating>0?T.orange:T.muted,color:"#fff",border:"none",borderRadius:12,padding:"14px",fontSize:15,fontWeight:700,cursor:newRating>0?"pointer":"not-allowed"}} disabled={newRating===0||submitting} onClick={submitReview}>
              {submitting?"Envoi...":"Publier mon avis"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
