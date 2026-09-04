import { useState, useEffect } from "react";
import { ArrowLeft, Store, ShoppingCart, Clock, User } from "lucide-react";
import { useWoko } from '../WokoContext.jsx';
import { supabase } from '../supabase.js';

const money = n => Number(n).toLocaleString("fr-FR") + " FCFA";

export const AdminScreen = () => {
  const { T, user, userRole, go, loadData } = useWoko();
  const [adminTab, setAdminTab] = useState("requests");
  const [requests, setRequests] = useState([]);
  const [allVendors, setAllVendors] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [stats, setStats] = useState({vendors:0,products:0,requests:0,users:0});
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    const load = async () => {
      try {
        const {getPendingRequests,getAllUsers,getAdminStats,getAllVendorsAdmin} = await import('../api.js');
        const [reqs,users,vs,st] = await Promise.all([getPendingRequests(),getAllUsers(),getAllVendorsAdmin(),getAdminStats()]);
        setRequests(reqs||[]); setAllUsers(users||[]); setAllVendors(vs||[]);
        setStats({vendors:st?.vendors||0,products:st?.products||0,requests:st?.pending_requests||0,users:st?.users||0});
      } catch(e){console.error(e);}
      setLoading(false);
    };
    load();
  },[]);

  if(userRole!=='admin'&&userRole!=='owner') return <div style={{padding:40,textAlign:"center",color:T.sub}}>Accès refusé</div>;

  const handleReview = async (id, status) => {
    try {
      const {reviewVendorRequest} = await import('../api.js');
      await reviewVendorRequest(id, status, user.id);
      setRequests(prev=>prev.filter(r=>r.id!==id));
      await loadData();
      setStats(s=>({...s,requests:s.requests-1,...(status==="approved"?{vendors:s.vendors+1}:{})}));
    } catch(e){alert("Erreur: "+e.message);}
  };

  const StatBox = ({icon,label,value,color}) => (
    <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"14px 10px",textAlign:"center",flex:1}}>
      <div style={{display:"flex",justifyContent:"center",marginBottom:6}}>{icon}</div>
      <div style={{fontSize:22,fontWeight:800,color:color||T.orange}}>{value}</div>
      <div style={{fontSize:11,color:T.sub}}>{label}</div>
    </div>
  );

  return (
    <div style={{paddingBottom:70}}>
      <div style={{background:T.headerTop,padding:"12px 14px",display:"flex",alignItems:"center",gap:12}}>
        <button style={{background:"none",border:"none",color:"#fff",cursor:"pointer"}} onClick={()=>go("home")}><ArrowLeft size={20}/></button>
        <span style={{color:"#fff",fontWeight:700,fontSize:17}}>Panel Admin</span>
        <span style={{background:"rgba(255,255,255,0.2)",color:"#fff",borderRadius:20,padding:"2px 10px",fontSize:11,fontWeight:700,marginLeft:"auto"}}>{userRole.toUpperCase()}</span>
      </div>

      <div style={{display:"flex",gap:8,padding:"12px 12px 0"}}>
        <StatBox icon={<Store size={22} color={T.orange}/>} label="Boutiques" value={stats.vendors}/>
        <StatBox icon={<ShoppingCart size={22} color={T.orange}/>} label="Produits" value={stats.products}/>
        <StatBox icon={<Clock size={22} color="#E53935"/>} label="En attente" value={stats.requests} color="#E53935"/>
        <StatBox icon={<User size={22} color={T.orange}/>} label="Utilisateurs" value={stats.users}/>
      </div>

      <div style={{display:"flex",background:T.card,borderBottom:`1px solid ${T.border}`,margin:"12px 0 0",overflowX:"auto"}}>
        {[{id:"requests",label:`Demandes (${stats.requests})`},{id:"vendors",label:"Boutiques"},...(userRole==="owner"?[{id:"users",label:"Utilisateurs"}]:[])].map(tab=>(
          <button key={tab.id} style={{flex:1,padding:"12px 8px",background:"none",border:"none",borderBottom:`3px solid ${adminTab===tab.id?T.orange:"transparent"}`,cursor:"pointer",fontSize:13,fontWeight:600,color:adminTab===tab.id?T.orange:T.sub,whiteSpace:"nowrap"}} onClick={()=>setAdminTab(tab.id)}>
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{padding:"12px 12px"}}>
        {adminTab==="requests"&&(
          loading?<div style={{textAlign:"center",padding:20,color:T.sub}}>Chargement...</div>
          :requests.length===0
          ?<div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:10,padding:24,textAlign:"center"}}><div style={{fontSize:32,marginBottom:8}}>🎉</div><div style={{color:T.sub}}>Aucune demande en attente</div></div>
          :requests.map(r=>(
            <div key={r.id} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:14,marginBottom:10}}>
              <div style={{fontSize:15,fontWeight:700,color:T.text,marginBottom:4}}>{r.shop_name}</div>
              <div style={{fontSize:13,color:T.sub,marginBottom:4}}>📍 {r.city} · 📞 {r.phone}</div>
              {r.description&&<div style={{fontSize:13,color:T.sub,marginBottom:6}}>{r.description}</div>}
              {r.id_document_url&&<a href={r.id_document_url} target="_blank" rel="noreferrer" style={{display:"inline-flex",alignItems:"center",gap:6,color:T.orange,fontSize:13,marginBottom:10,textDecoration:"none"}}>📄 Voir pièce d'identité</a>}
              <div style={{fontSize:11,color:T.muted,marginBottom:10}}>Soumis le {new Date(r.created_at).toLocaleDateString("fr-FR")}</div>
              <div style={{display:"flex",gap:8}}>
                <button style={{flex:1,background:"#E8F5E9",color:"#2E7D32",border:"none",borderRadius:8,padding:"10px",fontSize:14,fontWeight:700,cursor:"pointer"}} onClick={()=>handleReview(r.id,"approved")}>✅ Approuver</button>
                <button style={{flex:1,background:"#FFEBEE",color:"#E53935",border:"none",borderRadius:8,padding:"10px",fontSize:14,fontWeight:700,cursor:"pointer"}} onClick={()=>handleReview(r.id,"rejected")}>❌ Rejeter</button>
              </div>
            </div>
          ))
        )}

        {adminTab==="vendors"&&(
          allVendors.length===0?<div style={{textAlign:"center",padding:20,color:T.sub}}>Aucune boutique</div>
          :allVendors.map(v=>(
            <div key={v.id} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:12,marginBottom:8,display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:44,height:44,borderRadius:"50%",background:T.orange,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:16,flexShrink:0}}>{v.name?.[0]?.toUpperCase()||"?"}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:14,fontWeight:700,color:T.text}}>{v.name}</div>
                <div style={{fontSize:12,color:T.sub}}>📍 {v.city||"N/A"} · 📞 {v.phone||"N/A"}</div>
              </div>
              <button style={{background:v.certified?"#E8F5E9":"#FFEBEE",color:v.certified?"#2E7D32":"#E53935",border:"none",borderRadius:8,padding:"6px 10px",fontSize:11,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"}}
                onClick={async()=>{
                  await supabase.from('vendors').update({certified:!v.certified}).eq('id',v.id);
                  setAllVendors(prev=>prev.map(x=>x.id===v.id?{...x,certified:!v.certified}:x));
                  await loadData();
                }}>
                {v.certified?"✅ Certifié":"❌ Non certifié"}
              </button>
            </div>
          ))
        )}

        {adminTab==="users"&&userRole==="owner"&&(
          allUsers.length===0?<div style={{textAlign:"center",padding:20,color:T.sub}}>Aucun utilisateur</div>
          :allUsers.map(u=>(
            <div key={u.user_id} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:12,marginBottom:8}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                <div style={{width:36,height:36,borderRadius:"50%",background:T.orange,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:14}}>{u.user_id?.[0]?.toUpperCase()||"?"}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,color:T.text,fontWeight:600}}>{u.user_id?.slice(0,8)}...</div>
                  <div style={{fontSize:11,color:T.sub}}>Inscrit le {new Date(u.created_at).toLocaleDateString("fr-FR")}</div>
                </div>
                <span style={{background:u.role==="owner"?"#FFF3E0":u.role==="admin"?"#E8EAF6":u.role==="vendor"?"#E8F5E9":"#F5F5F5",color:u.role==="owner"?T.orange:u.role==="admin"?"#3949AB":u.role==="vendor"?"#2E7D32":"#757575",borderRadius:20,padding:"3px 10px",fontSize:11,fontWeight:700}}>
                  {u.role?.toUpperCase()}
                </span>
              </div>
              {u.user_id!==user?.id&&(
                <div style={{display:"flex",gap:6}}>
                  {["buyer","vendor","admin"].map(role=>(
                    <button key={role} style={{flex:1,background:u.role===role?T.indigoBg:T.tag,color:u.role===role?T.orange:T.sub,border:`1px solid ${u.role===role?T.orange:T.border}`,borderRadius:6,padding:"6px 4px",fontSize:11,fontWeight:600,cursor:"pointer"}}
                      onClick={async()=>{const {setUserRole}=await import('../api.js');await setUserRole(u.user_id,role);setAllUsers(prev=>prev.map(x=>x.user_id===u.user_id?{...x,role}:x));}}>
                      {role}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
