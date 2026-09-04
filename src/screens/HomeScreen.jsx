import { useState } from "react";
import { Star, Filter, MapPin, Phone, MessageCircle, Heart, BadgeCheck, Flame, Shirt, Smartphone, UtensilsCrossed, Sparkles, Palette, Wrench } from "lucide-react";
import { useWoko } from '../WokoContext.jsx';
import { Placeholder } from '../components/Placeholder.jsx';

const CATEGORIES = [
  {id:"all",label:"Tout",icon:<Flame size={22}/>},
  {id:"mode",label:"Mode",icon:<Shirt size={22}/>},
  {id:"elec",label:"Électronique",icon:<Smartphone size={22}/>},
  {id:"resto",label:"Resto",icon:<UtensilsCrossed size={22}/>},
  {id:"beaute",label:"Beauté",icon:<Sparkles size={22}/>},
  {id:"artisan",label:"Artisanat",icon:<Palette size={22}/>},
  {id:"service",label:"Services",icon:<Wrench size={22}/>},
];

export const HomeScreen = () => {
  const { T, vendors, products, loading, favorites, toggleFav, go, setCallModal, search, getProductVendor, shareProduct, addCart } = useWoko();
  const [localCategory, setLocalCategory] = useState("all");

  const filtered = products.filter(p => {
    const v = getProductVendor(p);
    const catMatch = localCategory==="all" || p.category===localCategory;
    const searchMatch = !search || p.title?.toLowerCase().includes(search.toLowerCase()) || v?.name?.toLowerCase().includes(search.toLowerCase());
    return catMatch && searchMatch && p.available!==false;
  });

  const ProductCard = ({p}) => {
    const v = getProductVendor(p);
    const isService = p.type==="service";
    const isFav = favorites.includes(p.id);
    return (
      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:8,overflow:"hidden"}}>
        <div style={{position:"relative",cursor:"pointer"}} onClick={()=>go("product",p.id)}>
          {p.image_url
            ?<img src={p.image_url} alt={p.title} style={{width:"100%",height:130,objectFit:"cover"}} loading="lazy"/>
            :<Placeholder vendor={v||{initials:"?",color:"#E65100"}} height={130} fontSize={28} title={p.title}/>
          }
          <button style={{position:"absolute",top:8,right:8,background:"rgba(255,255,255,0.9)",border:"none",borderRadius:"50%",width:30,height:30,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:isFav?"#E53935":T.muted}} onClick={e=>{e.stopPropagation();toggleFav(p.id);}}>
            <Heart size={15} fill={isFav?"#E53935":"none"}/>
          </button>
          <div style={{position:"absolute",top:8,left:8,display:"flex",gap:4}}>
            <div style={{background:isService?"#1565C0":T.orange,color:"#fff",borderRadius:4,padding:"2px 7px",fontSize:10,fontWeight:700}}>{isService?"SERVICE":"PRODUIT"}</div>
          </div>
        </div>
        <div style={{padding:"10px 10px 4px",cursor:"pointer"}} onClick={()=>go("product",p.id)}>
          <div style={{fontSize:13,fontWeight:600,color:T.text,lineHeight:1.3,marginBottom:4}}>{p.title}</div>
          <div style={{fontSize:15,fontWeight:800,color:T.orange,marginBottom:4}}>{Number(p.price).toLocaleString("fr-FR")} FCFA</div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
            <div style={{fontSize:11,color:T.sub,display:"flex",alignItems:"center",gap:4}}><MapPin size={10}/>{v?.zone||v?.city||""}</div>
            {p.quantity!==null&&p.quantity!==undefined&&(
              <span style={{fontSize:10,fontWeight:700,color:p.quantity===0?"#E53935":p.quantity<=5?"#E65100":"#2E7D32",background:p.quantity===0?"#FFEBEE":p.quantity<=5?"#FFF3E0":"#E8F5E9",borderRadius:10,padding:"2px 7px"}}>
                {p.quantity===0?"Épuisé":p.quantity<=5?`${p.quantity} restants`:"∞"}
              </span>
            )}
          </div>
        </div>
        <div style={{display:"flex",borderTop:`1px solid ${T.border}`}}>
          <button style={{flex:1,padding:"9px 8px",background:"none",border:"none",borderRight:`1px solid ${T.border}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6,color:T.orange,fontSize:13,fontWeight:600}} onClick={()=>setCallModal(p.vendor_id||p.vendorId)}>
            <Phone size={14}/> Appeler
          </button>
          <button style={{flex:1,padding:"9px 8px",background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6,color:T.sub,fontSize:13}}
            onClick={()=>isService?go("booking",p.id):addCart(p.id)}>
            <MessageCircle size={14}/> {isService?"RDV":"Panier"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div style={{paddingBottom:70}}>
      {/* Categories */}
      <div style={{background:T.card,padding:"12px 0 8px",borderBottom:`1px solid ${T.border}`}}>
        <div style={{display:"flex",overflowX:"auto",gap:0,paddingLeft:8,scrollbarWidth:"none"}}>
          {CATEGORIES.map(cat=>(
            <button key={cat.id} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6,padding:"4px 12px",background:"none",border:"none",cursor:"pointer",flexShrink:0}} onClick={()=>setLocalCategory(cat.id)}>
              <div style={{width:52,height:52,borderRadius:"50%",background:localCategory===cat.id?T.indigoBg:T.tag,border:`2px solid ${localCategory===cat.id?T.orange:"transparent"}`,display:"flex",alignItems:"center",justifyContent:"center",color:localCategory===cat.id?T.orange:T.sub}}>
                {cat.icon}
              </div>
              <span style={{fontSize:10,color:localCategory===cat.id?T.orange:T.sub,fontWeight:localCategory===cat.id?700:400,whiteSpace:"nowrap"}}>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Boutiques à la une */}
      <div style={{background:T.card,padding:"14px 0 8px",borderBottom:`1px solid ${T.border}`,marginBottom:8}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 12px 10px"}}>
          <div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:18}}>🏪</span><span style={{fontSize:15,fontWeight:700,color:T.text}}>Boutiques à la une</span></div>
          <span style={{fontSize:13,color:T.orange,fontWeight:600,cursor:"pointer"}} onClick={()=>go("search")}>VOIR PLUS</span>
        </div>
        <div style={{display:"flex",overflowX:"auto",gap:10,paddingLeft:12,paddingRight:12,scrollbarWidth:"none"}}>
          {vendors.filter(v=>v.certified).map(v=>(
            <div key={v.id} style={{flexShrink:0,width:120,background:T.card,border:`1px solid ${T.border}`,borderRadius:8,overflow:"hidden",cursor:"pointer",textAlign:"center"}} onClick={()=>go("vendor",v.id)}>
              <div style={{background:`linear-gradient(135deg,${v.color}CC,${v.color}44)`,height:75,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
                {v.logo_url
                  ?<img src={v.logo_url} alt={v.name} style={{width:48,height:48,borderRadius:"50%",objectFit:"cover",border:"3px solid rgba(255,255,255,0.6)"}} loading="lazy"/>
                  :<div style={{width:48,height:48,borderRadius:"50%",background:v.color,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:17,border:"3px solid rgba(255,255,255,0.4)"}}>{v.initials||v.name?.[0]}</div>
                }
              </div>
              <div style={{padding:"8px 8px 10px"}}>
                <div style={{fontSize:11,fontWeight:700,color:T.text,marginBottom:3}}>{v.name}</div>
                {v.certified&&<div style={{display:"inline-flex",alignItems:"center",gap:3,background:"#E3F2FD",color:"#1565C0",borderRadius:10,padding:"2px 6px",fontSize:9,fontWeight:700}}><BadgeCheck size={9}/>CERTIFIÉ</div>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Toutes les annonces */}
      <div style={{padding:"14px 10px 8px"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
          <span style={{fontSize:15,fontWeight:700,color:T.text}}>
            Toutes les annonces
            <span style={{fontSize:12,color:T.muted,fontWeight:400,marginLeft:6}}>({filtered.length})</span>
          </span>
          <button style={{background:T.tag,border:`1px solid ${T.border}`,borderRadius:6,padding:"5px 10px",cursor:"pointer",display:"flex",alignItems:"center",gap:5,fontSize:12,color:T.text}}>
            <Filter size={12}/>Filtrer
          </button>
        </div>
        {loading
          ?<div style={{textAlign:"center",padding:"40px 20px",color:T.sub}}>Chargement...</div>
          :filtered.length===0
          ?<div style={{textAlign:"center",padding:"40px 20px",color:T.sub}}>Aucune annonce.</div>
          :<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>{filtered.map(p=><ProductCard key={p.id} p={p}/>)}</div>
        }
      </div>
    </div>
  );
};
