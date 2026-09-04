import { ArrowLeft, Phone, ShoppingCart, CalendarDays, Heart, BadgeCheck, Share2, CheckCircle2, MapPin } from "lucide-react";
import { useWoko } from '../WokoContext.jsx';
import { Placeholder } from '../components/Placeholder.jsx';
import { useState } from "react";

export const ProductScreen = () => {
  const { T, screenId, findP, getProductVendor, favorites, toggleFav, setCallModal, go, cart, addCart, setLoginModal, user, shareProduct } = useWoko();
  const p = findP(screenId);
  const [added, setAdded] = useState(false);

  if(!p) return null;
  const v = getProductVendor(p);
  const isService = p.type === "service";
  const isFav = favorites.includes(p.id);

  return (
    <div style={{paddingBottom:70}}>
      <div style={{position:"relative"}}>
        {p.image_url
          ?<img src={p.image_url} alt={p.title} style={{width:"100%",height:200,objectFit:"cover",display:"block"}} loading="lazy"/>
          :<Placeholder vendor={v||{initials:"?",color:"#E65100"}} height={200} fontSize={48}/>
        }
        <button style={{position:"absolute",top:12,left:12,background:"rgba(0,0,0,0.5)",border:"none",borderRadius:"50%",width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#fff",zIndex:10}} onClick={()=>go("home")}><ArrowLeft size={18}/></button>
        <button style={{position:"absolute",top:12,right:12,background:"rgba(255,255,255,0.9)",border:"none",borderRadius:"50%",width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:isFav?"#E53935":T.muted}} onClick={()=>toggleFav(p.id)}><Heart size={18} fill={isFav?"#E53935":"none"}/></button>
        <div style={{position:"absolute",bottom:12,left:12,background:isService?"#1565C0":T.orange,color:"#fff",borderRadius:4,padding:"4px 10px",fontSize:11,fontWeight:700}}>{isService?"SERVICE":"PRODUIT"}</div>
      </div>

      <div style={{padding:"16px 14px",background:T.card,marginBottom:8}}>
        <div style={{fontSize:20,fontWeight:700,color:T.text,marginBottom:6}}>{p.title}</div>
        <div style={{fontSize:24,fontWeight:800,color:T.orange,marginBottom:8}}>{Number(p.price).toLocaleString("fr-FR")} FCFA</div>
        <div style={{fontSize:13,color:T.sub,display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
          <span style={{display:"flex",alignItems:"center",gap:4}}><MapPin size={13}/>{v?.zone||v?.city||""}</span>
          {p.quantity!==null&&p.quantity!==undefined&&(
            <span style={{fontSize:11,fontWeight:700,color:p.quantity===0?"#E53935":p.quantity<=5?"#E65100":"#2E7D32",background:p.quantity===0?"#FFEBEE":p.quantity<=5?"#FFF3E0":"#E8F5E9",borderRadius:10,padding:"3px 10px"}}>
              {p.quantity===0?"Épuisé":p.quantity<=5?`${p.quantity} restants`:"En stock ∞"}
            </span>
          )}
        </div>
      </div>

      {v&&<div style={{background:T.card,padding:"14px",marginBottom:8,cursor:"pointer"}} onClick={()=>go("vendor",v.id)}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:52,height:52,borderRadius:"50%",background:v.color||T.orange,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:18,flexShrink:0,overflow:"hidden"}}>
            {v.logo_url?<img src={v.logo_url} style={{width:52,height:52,objectFit:"cover"}}/>:v.initials||v.name?.[0]}
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:16,fontWeight:700,color:T.text}}>{v.name}</div>
            <div style={{fontSize:12,color:T.sub}}>{v.description||v.desc||""}</div>
            {v.certified&&<div style={{display:"inline-flex",alignItems:"center",gap:4,background:"#E3F2FD",color:"#1565C0",borderRadius:10,padding:"2px 8px",fontSize:11,fontWeight:700,marginTop:4}}><BadgeCheck size={11}/>CERTIFIÉ</div>}
          </div>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.muted} strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
      </div>}

      <div style={{padding:"0 14px 14px",display:"flex",gap:10,background:T.card}}>
        <button style={{width:44,background:T.tag,border:`1px solid ${T.border}`,borderRadius:10,padding:"13px 10px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}} onClick={()=>shareProduct(p,v)}><Share2 size={18} color={T.orange}/></button>
        <button style={{flex:1,background:T.orange,color:"#fff",border:"none",borderRadius:10,padding:"13px",fontSize:14,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}} onClick={()=>setCallModal(p.vendor_id||p.vendorId)}><Phone size={16}/>Appeler</button>
        {isService
          ?<button style={{flex:1,background:"#1565C0",color:"#fff",border:"none",borderRadius:10,padding:"13px",fontSize:14,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}} onClick={()=>go("booking",p.id)}><CalendarDays size={16}/>Réserver</button>
          :<button style={{flex:1,background:added?"#2E7D32":T.indigoBg,color:added?"#fff":T.orange,border:`1px solid ${T.orange}`,borderRadius:10,padding:"13px",fontSize:14,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}
            onClick={()=>{addCart(p.id);setAdded(true);setTimeout(()=>setAdded(false),1500);}}>
            {added?<><CheckCircle2 size={16}/>Ajouté</>:<><ShoppingCart size={16}/>Panier</>}
          </button>
        }
      </div>
    </div>
  );
};
