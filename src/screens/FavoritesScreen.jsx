import { ArrowLeft, Heart } from "lucide-react";
import { useWoko } from '../WokoContext.jsx';

export const FavoritesScreen = () => {
  const { T, products, favorites, go, setCallModal, toggleFav, getProductVendor } = useWoko();
  const favProducts = products.filter(p => favorites.includes(p.id));

  return (
    <div style={{paddingBottom:70}}>
      <div style={{background:T.headerTop,padding:"12px 14px",display:"flex",alignItems:"center",gap:12}}>
        <button style={{background:"none",border:"none",color:"#fff",cursor:"pointer"}} onClick={()=>go("profile")}><ArrowLeft size={20}/></button>
        <span style={{color:"#fff",fontWeight:700,fontSize:17}}>Mes favoris ({favorites.length})</span>
      </div>
      <div style={{padding:"12px 10px"}}>
        {favProducts.length===0
          ?<div style={{textAlign:"center",padding:"60px 20px"}}>
            <Heart size={48} color={T.border} style={{margin:"0 auto 16px",display:"block"}}/>
            <div style={{fontSize:16,fontWeight:700,color:T.text,marginBottom:8}}>Aucun favori</div>
            <div style={{fontSize:13,color:T.sub,marginBottom:20}}>Appuyez sur ❤️ sur un produit pour l'ajouter ici.</div>
            <button style={{background:T.orange,color:"#fff",border:"none",borderRadius:10,padding:"12px 24px",fontSize:14,fontWeight:700,cursor:"pointer"}} onClick={()=>go("home")}>Explorer le marché</button>
          </div>
          :<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {favProducts.map(p=>{
              const v=getProductVendor(p); const isService=p.type==="service"; const isFav=favorites.includes(p.id);
              return (
                <div key={p.id} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:8,overflow:"hidden"}}>
                  <div style={{position:"relative",cursor:"pointer",height:120,background:`linear-gradient(135deg,${v?.color||T.orange}CC,${v?.color||T.orange}44)`,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>go("product",p.id)}>
                    {p.image_url?<img src={p.image_url} style={{width:"100%",height:120,objectFit:"cover"}}/>:<span style={{fontSize:28,color:"#fff",fontWeight:800}}>{v?.initials||"?"}</span>}
                    <button style={{position:"absolute",top:6,right:6,background:"rgba(255,255,255,0.9)",border:"none",borderRadius:"50%",width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#E53935"}} onClick={e=>{e.stopPropagation();toggleFav(p.id);}}>
                      <Heart size={14} fill="#E53935"/>
                    </button>
                  </div>
                  <div style={{padding:"8px 10px"}}>
                    <div style={{fontSize:13,fontWeight:600,color:T.text}}>{p.title}</div>
                    <div style={{fontSize:14,fontWeight:800,color:T.orange}}>{Number(p.price).toLocaleString("fr-FR")} FCFA</div>
                  </div>
                </div>
              );
            })}
          </div>
        }
      </div>
    </div>
  );
};
