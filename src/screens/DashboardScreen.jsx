import { useState, useEffect } from "react";
import { ArrowLeft, Pencil, Trash2, Plus, ClipboardList, CalendarDays, CheckCircle2, Camera, X, Store, Eye, TrendingUp, Star, ShoppingCart } from "lucide-react";
import { useWoko } from '../WokoContext.jsx';
import { supabase } from '../supabase.js';
import { uploadImage } from '../api.js';

const money = n => Number(n).toLocaleString("fr-FR") + " FCFA";

const EditVendorForm = ({vendor, onSave, T}) => {
  const [form, setForm] = useState({name:vendor.name||"",description:vendor.description||"",phone:vendor.phone||"",city:vendor.city||""});
  const [logoFile, setLogoFile] = useState(null);
  const [saving, setSaving] = useState(false);

  return (
    <div style={{background:T.indigoBg,borderRadius:10,padding:14,border:`1px solid ${T.orange}`,marginTop:12}}>
      <div style={{fontSize:13,fontWeight:700,color:T.orange,marginBottom:10,display:"flex",alignItems:"center",gap:6}}><Pencil size={13}/>Modifier ma boutique</div>
      {[{label:"Nom",key:"name"},{label:"Description",key:"description"},{label:"Téléphone",key:"phone"},{label:"Ville",key:"city"}].map(f=>(
        <input key={f.key} style={{width:"100%",background:"rgba(255,255,255,0.1)",border:`1px solid ${T.border}`,borderRadius:8,padding:"9px 12px",fontSize:13,color:T.text,outline:"none",marginBottom:8,boxSizing:"border-box"}}
          placeholder={f.label} defaultValue={form[f.key]} onBlur={e=>setForm(p=>({...p,[f.key]:e.target.value}))}/>
      ))}
      <label style={{display:"flex",alignItems:"center",gap:10,background:"rgba(255,255,255,0.1)",border:`1px dashed ${T.border}`,borderRadius:8,padding:"9px 12px",cursor:"pointer",marginBottom:12}}>
        <input type="file" accept="image/*" style={{display:"none"}} onChange={e=>{const f=e.target.files?.[0];if(f)setLogoFile(f);}}/>
        <Store size={16} color={T.orange}/>
        <span style={{fontSize:12,color:logoFile?T.green:T.sub}}>{logoFile?logoFile.name:"Logo de la boutique (optionnel)"}</span>
      </label>
      <div style={{display:"flex",gap:8}}>
        <button style={{flex:1,background:saving?T.muted:T.orange,color:"#fff",border:"none",borderRadius:8,padding:"11px",fontSize:14,fontWeight:700,cursor:saving?"not-allowed":"pointer"}} disabled={saving}
          onClick={async()=>{
            if(!form.name||!form.phone||!form.city){alert("Remplissez tous les champs");return;}
            setSaving(true);
            try {
              let logo_url = vendor.logo_url;
              if(logoFile) logo_url = await uploadImage(logoFile);
              await onSave({...form,logo_url});
            } catch(e){alert("Erreur: "+e.message);}
            setSaving(false);
          }}>
          {saving?"Enregistrement...":"Enregistrer"}
        </button>
      </div>
    </div>
  );
};

const AnalyticsTab = ({vendorId, T}) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    const load = async () => {
      try { const {getVendorAnalytics}=await import('../api.js'); const d=await getVendorAnalytics(vendorId); setAnalytics(d); }
      catch(e){console.error(e);}
      setLoading(false);
    };
    load();
  },[vendorId]);

  if(loading) return <div style={{padding:40,textAlign:"center",color:T.sub}}>Chargement...</div>;

  const StatBox = ({icon,label,value,sub,color}) => (
    <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"14px 12px",flex:1,minWidth:0}}>
      <div style={{marginBottom:6}}>{icon}</div>
      <div style={{fontSize:20,fontWeight:800,color:color||T.orange}}>{value}</div>
      <div style={{fontSize:11,fontWeight:600,color:T.text,marginBottom:2}}>{label}</div>
      {sub&&<div style={{fontSize:10,color:T.muted}}>{sub}</div>}
    </div>
  );

  return (
    <div style={{animation:"fadeIn 0.3s ease"}}>
      <div style={{fontSize:12,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Visibilité</div>
      <div style={{display:"flex",gap:8,marginBottom:16}}>
        <StatBox icon={<Eye size={18} color={T.orange}/>} label="Vues totales" value={analytics?.total_views||0} sub="depuis le début"/>
        <StatBox icon={<TrendingUp size={18} color="#1565C0"/>} label="Vues 7 jours" value={analytics?.views_7d||0} color="#1565C0" sub="cette semaine"/>
      </div>
      <div style={{fontSize:12,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Activité</div>
      <div style={{display:"flex",gap:8,marginBottom:16}}>
        <StatBox icon={<CalendarDays size={18} color="#2E7D32"/>} label="Total RDV" value={analytics?.total_rdv||0} color="#2E7D32" sub={`${analytics?.pending_rdv||0} en attente`}/>
        <StatBox icon={<ShoppingCart size={18} color="#AD1457"/>} label="Commandes" value={analytics?.total_orders||0} color="#AD1457"/>
      </div>
      <div style={{fontSize:12,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Performance</div>
      <div style={{display:"flex",gap:8,marginBottom:16}}>
        <StatBox icon={<span style={{fontSize:18}}>💰</span>} label="Revenus" value={money(analytics?.total_revenue||0)} sub="commandes confirmées"/>
        <StatBox icon={<Star size={18} color="#FFA000" fill="#FFA000"/>} label="Note moy." value={analytics?.avg_rating||"—"} color="#FFA000" sub={`${analytics?.total_reviews||0} avis`}/>
      </div>
      <div style={{background:T.indigoBg,borderRadius:10,padding:14,fontSize:13,color:T.orange}}>
        💡 Ajoutez des photos à vos produits pour augmenter vos vues de 3x.
      </div>
    </div>
  );
};

export const DashboardScreen = () => {
  const { T, myVendor, setMyVendor, sellerProducts, setSellerProducts, orders, setOrders, appts, setAppts, go, loading, loadData } = useWoko();
  const [sellerTab, setSellerTab] = useState("catalogue");
  const [stockFilter, setStockFilter] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [showEditVendor, setShowEditVendor] = useState(false);
  const [newP, setNewP] = useState({title:"",price:"",type:"produit",imageFile:null,uploading:false,preview:null,quantity:null});

  const me = myVendor;

  if(!me && !loading) return (
    <div style={{padding:20,textAlign:"center",paddingBottom:70}}>
      <div style={{fontSize:40,marginBottom:12}}>🏪</div>
      <div style={{fontSize:17,fontWeight:700,color:T.text,marginBottom:8}}>Vous n'avez pas encore de boutique</div>
      <p style={{color:T.sub,fontSize:14,marginBottom:20}}>Soumettez une demande de certification pour créer votre boutique Woko.</p>
      <button style={{background:T.orange,color:"#fff",border:"none",borderRadius:10,padding:"13px 24px",fontSize:15,fontWeight:700,cursor:"pointer"}} onClick={()=>go("vendor-request")}>Demander la certification</button>
    </div>
  );

  if(!me && loading) return <div style={{padding:60,textAlign:"center",color:T.sub}}>Chargement...</div>;

  const addProduct = async () => {
    if(!newP.title||!newP.price||!me) return;
    setNewP(p=>({...p,uploading:true}));
    try {
      let image_url = null;
      if(newP.imageFile) image_url = await uploadImage(newP.imageFile);
      const {createProduct} = await import('../api.js');
      const p = await createProduct({vendor_id:me.id,title:newP.title,price:Number(newP.price),type:newP.type,image_url,available:true,quantity:newP.quantity||null});
      setSellerProducts(prev=>[...prev,{...p,vendors:me}]);
      setNewP({title:"",price:"",type:"produit",imageFile:null,uploading:false,preview:null,quantity:null});
      setShowAdd(false);
      loadData();
    } catch(e){alert("Erreur: "+e.message);setNewP(p=>({...p,uploading:false}));}
  };

  const filteredProducts = sellerProducts.filter(p=>stockFilter==="all"||(stockFilter==="available"&&p.available!==false)||(stockFilter==="unavailable"&&p.available===false));

  return (
    <div style={{paddingBottom:70}}>
      <div style={{background:T.headerTop,padding:"12px 14px"}}>
        <div style={{color:"#fff",fontWeight:800,fontSize:18}}>Mon espace vendeur</div>
        <div style={{color:"rgba(255,255,255,0.8)",fontSize:13}}>{me.name}</div>
      </div>

      {/* Vendor info */}
      <div style={{background:T.card,margin:12,borderRadius:10,padding:14,marginBottom:8}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:52,height:52,borderRadius:"50%",background:me.color||T.orange,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:18,overflow:"hidden"}}>
            {me.logo_url?<img src={me.logo_url} style={{width:52,height:52,objectFit:"cover"}}/>:me.initials||me.name?.[0]}
          </div>
          <div style={{flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{fontWeight:700,fontSize:16,color:T.text}}>{me.name}</div>
              <button style={{background:"none",border:"none",cursor:"pointer",color:T.orange,padding:2}} onClick={()=>setShowEditVendor(v=>!v)}><Pencil size={14}/></button>
            </div>
            <div style={{fontSize:12,color:T.sub,marginBottom:4}}>{me.city} · {me.phone}</div>
            <div style={{display:"inline-flex",alignItems:"center",gap:4,background:"#E3F2FD",color:"#1565C0",borderRadius:10,padding:"2px 8px",fontSize:11,fontWeight:700}}>✅ CERTIFIÉ</div>
          </div>
        </div>
        {showEditVendor&&<EditVendorForm vendor={me} T={T} onSave={async(data)=>{
          await supabase.from('vendors').update(data).eq('id',me.id);
          setMyVendor({...me,...data});
          setShowEditVendor(false);
          loadData();
        }}/>}
      </div>

      {/* Tabs */}
      <div style={{display:"flex",background:T.card,borderBottom:`1px solid ${T.border}`,marginBottom:8}}>
        {[{id:"catalogue",label:"Catalogue"},{id:"commandes",label:"Commandes"},{id:"analytics",label:"📊 Stats"}].map(tab=>(
          <button key={tab.id} style={{flex:1,padding:"12px 4px",background:"none",border:"none",borderBottom:`3px solid ${sellerTab===tab.id?T.orange:"transparent"}`,cursor:"pointer",fontSize:13,fontWeight:600,color:sellerTab===tab.id?T.orange:T.sub,whiteSpace:"nowrap"}}
            onClick={()=>setSellerTab(tab.id)}>
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{padding:"0 12px"}}>
        {/* CATALOGUE */}
        {sellerTab==="catalogue"&&<>
          <div style={{display:"flex",background:T.tag,borderRadius:20,padding:3,gap:2,marginBottom:12}}>
            {[{id:"all",label:"Tous"},{id:"available",label:"En stock"},{id:"unavailable",label:"Hors stock"}].map(f=>(
              <button key={f.id} style={{flex:1,background:stockFilter===f.id?T.card:"transparent",color:stockFilter===f.id?T.orange:T.sub,border:"none",borderRadius:16,padding:"6px 4px",fontWeight:600,fontSize:11,cursor:"pointer"}} onClick={()=>setStockFilter(f.id)}>
                {f.label} ({f.id==="all"?sellerProducts.length:f.id==="available"?sellerProducts.filter(p=>p.available!==false).length:sellerProducts.filter(p=>p.available===false).length})
              </button>
            ))}
          </div>

          {filteredProducts.map(p=>(
            <div key={p.id} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:10,marginBottom:10,overflow:"hidden",opacity:p.available===false?0.7:1}}>
              <div style={{position:"relative",height:100,background:`linear-gradient(135deg,${me.color||T.orange}CC,${me.color||T.orange}44)`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                {p.image_url?<img src={p.image_url} style={{width:"100%",height:100,objectFit:"cover"}}/>:<span style={{fontSize:32,color:"#fff",fontWeight:800}}>{me.initials||me.name?.[0]}</span>}
                <div style={{position:"absolute",top:6,left:6,background:p.type==="service"?"#1565C0":T.orange,color:"#fff",borderRadius:4,padding:"2px 7px",fontSize:9,fontWeight:700}}>{p.type==="service"?"SERVICE":"PRODUIT"}</div>
                {p.available===false&&<div style={{position:"absolute",top:6,right:6,background:"#757575",color:"#fff",borderRadius:4,padding:"2px 7px",fontSize:9,fontWeight:700}}>HORS STOCK</div>}
              </div>
              <div style={{padding:"10px 12px"}}>
                <div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:4}}>{p.title}</div>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                  <span style={{fontSize:16,fontWeight:800,color:T.orange}}>{money(p.price)}</span>
                  {p.quantity!=null&&<span style={{fontSize:11,color:T.sub,background:T.tag,borderRadius:10,padding:"2px 8px"}}>Qté: {p.quantity}</span>}
                </div>
                <div style={{display:"flex",gap:6}}>
                  <button style={{flex:1,background:p.available===false?"#E8F5E9":"#FFEBEE",color:p.available===false?"#2E7D32":"#E53935",border:"none",borderRadius:8,padding:"7px",fontSize:12,fontWeight:700,cursor:"pointer"}}
                    onClick={async()=>{
                      const newAvail=p.available===false;
                      const {error}=await supabase.from('products').update({available:newAvail}).eq('id',p.id);
                      if(!error) setSellerProducts(prev=>prev.map(x=>x.id===p.id?{...x,available:newAvail}:x));
                    }}>
                    {p.available===false?"→ Remettre en stock":"→ Hors stock"}
                  </button>
                  <button style={{width:34,height:34,borderRadius:8,background:"#FFEBEE",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}
                    onClick={async()=>{
                      if(!window.confirm("Supprimer ce produit ?")) return;
                      await supabase.from('products').delete().eq('id',p.id);
                      setSellerProducts(prev=>prev.filter(x=>x.id!==p.id));
                      loadData();
                    }}><Trash2 size={14} color="#E53935"/></button>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8,marginTop:8,padding:"6px 0",borderTop:`1px solid ${T.border}`}}>
                  <span style={{fontSize:11,color:T.sub}}>Quantité:</span>
                  <input type="number" min="0" defaultValue={p.quantity??''} placeholder="Illimitée"
                    style={{flex:1,background:T.bg,border:`1px solid ${T.border}`,borderRadius:6,padding:"4px 8px",fontSize:12,color:T.text,outline:"none"}}
                    onBlur={async e=>{
                      const qty=e.target.value===''?null:parseInt(e.target.value);
                      await supabase.from('products').update({quantity:qty}).eq('id',p.id);
                      setSellerProducts(prev=>prev.map(x=>x.id===p.id?{...x,quantity:qty}:x));
                    }}/>
                </div>
              </div>
            </div>
          ))}

          {showAdd?(
            <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:8,padding:14,marginBottom:8}}>
              <input style={{width:"100%",background:T.bg,border:`1px solid ${T.border}`,borderRadius:8,padding:"10px 12px",fontSize:14,color:T.text,outline:"none",marginBottom:8,boxSizing:"border-box"}} placeholder="Titre" defaultValue={newP.title} onBlur={e=>setNewP(p=>({...p,title:e.target.value}))}/>
              <input style={{width:"100%",background:T.bg,border:`1px solid ${T.border}`,borderRadius:8,padding:"10px 12px",fontSize:14,color:T.text,outline:"none",marginBottom:8,boxSizing:"border-box"}} placeholder="Prix FCFA" type="number" defaultValue={newP.price} onBlur={e=>setNewP(p=>({...p,price:e.target.value}))}/>
              <div style={{display:"flex",gap:8,marginBottom:8}}>
                {["produit","service"].map(t=><button key={t} style={{flex:1,background:newP.type===t?T.orange:T.tag,color:newP.type===t?"#fff":T.text,border:"none",borderRadius:8,padding:"10px",fontSize:14,fontWeight:600,cursor:"pointer"}} onClick={()=>setNewP(p=>({...p,type:t}))}>{t}</button>)}
              </div>
              {newP.preview&&(
                <div style={{marginBottom:8,borderRadius:8,overflow:"hidden",height:120,position:"relative",animation:"fadeIn 0.3s ease"}}>
                  <img src={newP.preview} style={{width:"100%",height:120,objectFit:"cover"}}/>
                  <button style={{position:"absolute",top:6,right:6,background:"rgba(0,0,0,0.5)",border:"none",borderRadius:"50%",width:24,height:24,color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setNewP(p=>({...p,imageFile:null,preview:null}))}>
                    <X size={12}/>
                  </button>
                </div>
              )}
              <div style={{display:"flex",gap:8,marginBottom:8}}>
                <label style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:8,background:T.bg,border:`1px dashed ${newP.imageFile?T.green:T.border}`,borderRadius:8,padding:"10px",cursor:"pointer",color:newP.imageFile?T.green:T.sub,fontSize:13}}>
                  <input type="file" accept="image/*" style={{display:"none"}} onChange={e=>{
                    const file=e.target.files?.[0];
                    if(!file) return;
                    const reader=new FileReader();
                    reader.onloadend=()=>setNewP(p=>({...p,imageFile:file,preview:reader.result}));
                    reader.readAsDataURL(file);
                  }}/>
                  <Camera size={16} color={newP.imageFile?T.green:T.sub}/>
                  {newP.imageFile?"Photo ✓":"Ajouter photo"}
                </label>
              </div>
              {newP.uploading&&<div style={{fontSize:12,color:T.orange,marginBottom:8,textAlign:"center"}}>Upload en cours...</div>}
              <div style={{display:"flex",gap:8}}>
                <button style={{flex:1,background:T.orange,color:"#fff",border:"none",borderRadius:8,padding:"12px",fontSize:14,fontWeight:700,cursor:"pointer"}} onClick={addProduct}>Enregistrer</button>
                <button style={{flex:1,background:T.tag,color:T.text,border:"none",borderRadius:8,padding:"12px",fontSize:14,cursor:"pointer"}} onClick={()=>setShowAdd(false)}>Annuler</button>
              </div>
            </div>
          ):(
            <button style={{width:"100%",background:T.card,border:`2px dashed ${T.orange}`,borderRadius:8,padding:"14px",color:T.orange,fontSize:14,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:8}} onClick={()=>setShowAdd(true)}>
              <Plus size={16}/>Ajouter un produit / service
            </button>
          )}
        </>}

        {/* COMMANDES */}
        {sellerTab==="commandes"&&<>
          <div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:10,display:"flex",alignItems:"center",gap:6}}><ClipboardList size={15} color={T.orange}/>Commandes</div>
          {orders.length===0?<div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:10,padding:16,textAlign:"center",color:T.sub,fontSize:13}}>Aucune commande</div>
          :orders.map(o=>(
            <div key={o.id} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:8,padding:12,marginBottom:8,display:"flex",alignItems:"center",gap:10}}>
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:600,color:T.text}}>{o.products?.title||o.produit||"Commande"}</div>
                <div style={{fontSize:13,color:T.sub}}>{o.buyer_name||o.client} · <span style={{color:T.orange,fontWeight:700}}>{money(o.total_price||o.montant||0)}</span></div>
              </div>
              {o.status==="expediee"||o.status==="shipped"
                ?<div style={{display:"flex",alignItems:"center",gap:4,background:"#E8F5E9",color:"#2E7D32",borderRadius:20,padding:"4px 10px",fontSize:11,fontWeight:700}}><CheckCircle2 size={11}/>EXPÉDIÉE</div>
                :<button style={{background:T.orange,color:"#fff",border:"none",borderRadius:8,padding:"7px 12px",fontSize:12,fontWeight:700,cursor:"pointer"}} onClick={()=>setOrders(prev=>prev.map(x=>x.id===o.id?{...x,status:"expediee"}:x))}>Expédiée</button>
              }
            </div>
          ))}

          <div style={{fontSize:14,fontWeight:700,color:T.text,margin:"16px 0 10px",display:"flex",alignItems:"center",gap:6}}><CalendarDays size={15} color={T.orange}/>Rendez-vous ({appts.length})</div>
          {appts.length===0?<div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:10,padding:16,textAlign:"center",color:T.sub,fontSize:13}}>Aucun rendez-vous</div>
          :appts.map(a=>(
            <div key={a.id} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:8,padding:12,marginBottom:8}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
                <div>
                  <div style={{fontSize:14,fontWeight:600,color:T.text}}>{a.buyer_name}</div>
                  <div style={{fontSize:12,color:T.sub}}>{a.appointment_date} à {a.appointment_time?.slice(0,5)}</div>
                </div>
                <span style={{background:a.status==="confirmed"?"#E8F5E9":a.status==="cancelled"?"#FFEBEE":"#FFF3E0",color:a.status==="confirmed"?"#2E7D32":a.status==="cancelled"?"#E53935":"#E65100",borderRadius:20,padding:"4px 10px",fontSize:11,fontWeight:700}}>
                  {a.status==="confirmed"?"✅":a.status==="cancelled"?"❌":"⏳"}
                </span>
              </div>
              {a.status==="pending"&&(
                <div style={{display:"flex",gap:8,marginTop:8}}>
                  <button style={{flex:1,background:"#E8F5E9",color:"#2E7D32",border:"none",borderRadius:8,padding:"7px",fontSize:12,fontWeight:700,cursor:"pointer"}} onClick={async()=>{await supabase.from('appointments').update({status:'confirmed'}).eq('id',a.id);setAppts(prev=>prev.map(x=>x.id===a.id?{...x,status:'confirmed'}:x));}}>✅ Confirmer</button>
                  <button style={{flex:1,background:"#FFEBEE",color:"#E53935",border:"none",borderRadius:8,padding:"7px",fontSize:12,fontWeight:700,cursor:"pointer"}} onClick={async()=>{await supabase.from('appointments').update({status:'cancelled'}).eq('id',a.id);setAppts(prev=>prev.map(x=>x.id===a.id?{...x,status:'cancelled'}:x));}}>❌ Annuler</button>
                </div>
              )}
            </div>
          ))}
        </>}

        {sellerTab==="analytics"&&<AnalyticsTab vendorId={me.id} T={T}/>}
      </div>
    </div>
  );
};
