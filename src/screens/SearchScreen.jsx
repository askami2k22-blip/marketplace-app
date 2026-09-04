import { useState, useEffect } from "react";
import { ArrowLeft, Search, X, BadgeCheck, ChevronRight, Shirt, Smartphone, UtensilsCrossed, Sparkles, Palette, Wrench } from "lucide-react";
import { useWoko } from '../WokoContext.jsx';
import { Placeholder } from '../components/Placeholder.jsx';

const CATS = [
  {id:"mode",label:"Mode & Textile",icon:<Shirt size={20}/>},
  {id:"elec",label:"Électronique",icon:<Smartphone size={20}/>},
  {id:"resto",label:"Restauration",icon:<UtensilsCrossed size={20}/>},
  {id:"beaute",label:"Beauté",icon:<Sparkles size={20}/>},
  {id:"artisan",label:"Artisanat",icon:<Palette size={20}/>},
  {id:"service",label:"Services",icon:<Wrench size={20}/>},
];

export const SearchScreen = () => {
  const { T, vendors, products, search, setSearch, go, setCallModal, getProductVendor, favorites, toggleFav } = useWoko();
  const [searchTab, setSearchTab] = useState("produits");
  const [cityFilter, setCityFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState(0);
  const [vendorRatings, setVendorRatings] = useState({});

  useEffect(()=>{
    const load = async () => {
      const {getVendorRating} = await import('../api.js');
      const r = {};
      for(const v of vendors) { try { r[v.id]=await getVendorRating(v.id); } catch(e){} }
      setVendorRatings(r);
    };
    if(vendors.length) load();
  },[vendors.length]);

  const cities = ["all",...new Set(vendors.map(v=>v.city).filter(Boolean))];

  const filtered = products.filter(p=>{
    const v=getProductVendor(p);
    return (!search||p.title.toLowerCase().includes(search.toLowerCase())||v?.name?.toLowerCase().includes(search.toLowerCase()));
  });

  const filteredVendors = vendors.filter(v=>{
    const cityOk=cityFilter==="all"||v.city===cityFilter;
    const nameOk=!search||v.name?.toLowerCase().includes(search.toLowerCase());
    const ratingOk=ratingFilter===0||(vendorRatings[v.id]?.average||0)>=ratingFilter;
    return cityOk&&nameOk&&ratingOk;
  });

  return (
    <div style={{paddingBottom:70}}>
      <div style={{background:T.headerTop,padding:"10px 12px 14px",display:"flex",gap:10,alignItems:"center"}}>
        <button style={{background:"none",border:"none",cursor:"pointer",color:"#fff"}} onClick={()=>go("home")}><ArrowLeft size={20}/></button>
        <div style={{flex:1,display:"flex",alignItems:"center",background:"#fff",borderRadius:8,padding:"8px 12px",gap:8}}>
          <Search size={15} color={T.muted}/>
          <input autoFocus style={{flex:1,border:"none",outline:"none",fontSize:14,background:"transparent",color:"#1A1A1A"}} placeholder="Rechercher..." value={search} onChange={e=>setSearch(e.target.value)}/>
          {search&&<button style={{background:"none",border:"none",cursor:"pointer"}} onClick={()=>setSearch("")}><X size={14} color={T.muted}/></button>}
        </div>
      </div>

      <div style={{display:"flex",background:T.card,borderBottom:`1px solid ${T.border}`}}>
        {[{id:"produits",label:`Produits (${filtered.length})`},{id:"vendeurs",label:`Vendeurs (${filteredVendors.length})`}].map(tab=>(
          <button key={tab.id} style={{flex:1,padding:"12px",background:"none",border:"none",borderBottom:`3px solid ${searchTab===tab.id?T.orange:"transparent"}`,cursor:"pointer",fontSize:14,fontWeight:600,color:searchTab===tab.id?T.orange:T.sub}} onClick={()=>setSearchTab(tab.id)}>
            {tab.label}
          </button>
        ))}
      </div>

      {searchTab==="vendeurs"&&(
        <div style={{background:T.card,padding:"10px 12px",borderBottom:`1px solid ${T.border}`}}>
          <div style={{display:"flex",gap:6,overflowX:"auto",scrollbarWidth:"none",marginBottom:8}}>
            {cities.map(c=>(
              <button key={c} style={{background:cityFilter===c?T.orange:T.tag,color:cityFilter===c?"#fff":T.sub,border:"none",borderRadius:20,padding:"5px 12px",fontSize:12,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0}} onClick={()=>setCityFilter(c)}>
                📍 {c==="all"?"Toutes les villes":c}
              </button>
            ))}
          </div>
          <div style={{display:"flex",gap:6,alignItems:"center"}}>
            <span style={{fontSize:12,color:T.sub,whiteSpace:"nowrap"}}>Note min:</span>
            {[0,3,4,5].map(r=>(
              <button key={r} style={{background:ratingFilter===r?T.orange:T.tag,color:ratingFilter===r?"#fff":T.sub,border:"none",borderRadius:20,padding:"5px 10px",fontSize:12,fontWeight:600,cursor:"pointer"}} onClick={()=>setRatingFilter(r)}>
                {r===0?"Tous":r+"★+"}
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{padding:"12px 10px"}}>
        {searchTab==="produits"&&(
          search
            ?<><div style={{fontSize:13,color:T.sub,marginBottom:10}}>{filtered.length} résultat(s) pour "{search}"</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>{filtered.map(p=>{
                const v=getProductVendor(p); const isService=p.type==="service"; const isFav=favorites.includes(p.id);
                return (
                  <div key={p.id} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:8,overflow:"hidden",cursor:"pointer"}} onClick={()=>go("product",p.id)}>
                    {p.image_url?<img src={p.image_url} style={{width:"100%",height:120,objectFit:"cover"}}/>:<Placeholder vendor={v||{initials:"?",color:"#E65100"}} height={120} fontSize={24}/>}
                    <div style={{padding:"8px 10px"}}>
                      <div style={{fontSize:13,fontWeight:600,color:T.text}}>{p.title}</div>
                      <div style={{fontSize:14,fontWeight:800,color:T.orange}}>{Number(p.price).toLocaleString("fr-FR")} FCFA</div>
                    </div>
                  </div>
                );
              })}</div></>
            :<div>
              <div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:10}}>Catégories populaires</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {CATS.map(cat=>(
                  <button key={cat.id} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:8,padding:"14px 12px",display:"flex",alignItems:"center",gap:10,cursor:"pointer",color:T.text,fontSize:14,fontWeight:500}} onClick={()=>go("home")}>
                    <span style={{color:T.orange,display:"flex"}}>{cat.icon}</span>{cat.label}
                  </button>
                ))}
              </div>
            </div>
        )}

        {searchTab==="vendeurs"&&(
          filteredVendors.length===0
            ?<div style={{textAlign:"center",padding:"40px 20px",color:T.sub}}>Aucun vendeur trouvé</div>
            :filteredVendors.map(v=>{
              const rating=vendorRatings[v.id];
              return (
                <div key={v.id} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:14,marginBottom:10,cursor:"pointer",display:"flex",alignItems:"center",gap:12}} onClick={()=>go("vendor",v.id)}>
                  <div style={{width:52,height:52,borderRadius:"50%",background:v.color||T.orange,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:18,flexShrink:0,overflow:"hidden"}}>
                    {v.logo_url?<img src={v.logo_url} style={{width:52,height:52,objectFit:"cover"}}/>:<span>{v.initials||v.name?.[0]}</span>}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
                      <span style={{fontSize:15,fontWeight:700,color:T.text}}>{v.name}</span>
                      {v.certified&&<BadgeCheck size={14} color="#1565C0"/>}
                    </div>
                    <div style={{fontSize:12,color:T.sub,marginBottom:4}}>📍 {v.city||"N/A"}</div>
                    {rating?.average>0&&(
                      <div style={{display:"flex",alignItems:"center",gap:4}}>
                        <span style={{color:"#FFA000",fontSize:12}}>{"★".repeat(Math.round(rating.average))}</span>
                        <span style={{fontSize:12,fontWeight:600,color:T.orange}}>{rating.average}</span>
                        <span style={{fontSize:11,color:T.muted}}>({rating.count})</span>
                      </div>
                    )}
                  </div>
                  <ChevronRight size={16} color={T.muted}/>
                </div>
              );
            })
        )}
      </div>
    </div>
  );
};
