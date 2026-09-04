import { useState } from "react";
import { ArrowLeft, Store, ShoppingCart, CalendarDays, Heart, Bell, FileText, Lock, Settings, CheckCircle2 } from "lucide-react";
import { useWoko } from '../WokoContext.jsx';
import { supabase } from '../supabase.js';

export const ProfileScreen = () => {
  const { T, user, userRole, go } = useWoko();
  const [avatarUrl, setAvatarUrl] = useState(user?.user_metadata?.avatar_url || null);

  if(!user) { go("home"); return null; }

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarUrl(ev.target.result);
    reader.readAsDataURL(file);
  };

  const items = [
    {icon:<Store size={20}/>,label:"Mon espace vendeur",action:()=>go("dashboard")},
    {icon:<ShoppingCart size={20}/>,label:"Mes commandes",action:()=>{}},
    {icon:<CalendarDays size={20}/>,label:"Mes rendez-vous",action:()=>go("my-appointments")},
    {icon:<Heart size={20}/>,label:"Mes favoris",action:()=>go("favorites")},
    {icon:<Bell size={20}/>,label:"Notifications",action:()=>{}},
    {icon:<FileText size={20}/>,label:"Conditions d'utilisation",action:()=>go("tos")},
    {icon:<Lock size={20}/>,label:"Politique de confidentialité",action:()=>go("privacy")},
    ...(userRole==="admin"||userRole==="owner"?[{icon:<Settings size={20}/>,label:"Panel Admin",action:()=>go("admin")}]:[]),
  ];

  return (
    <div style={{paddingBottom:70,animation:"fadeIn 0.3s ease"}}>
      <div style={{background:T.headerTop,padding:"12px 14px",display:"flex",alignItems:"center",gap:12}}>
        <button style={{background:"none",border:"none",color:"#fff",cursor:"pointer"}} onClick={()=>go("home")}><ArrowLeft size={20}/></button>
        <span style={{color:"#fff",fontWeight:700,fontSize:17}}>Mon profil</span>
      </div>
      <div style={{padding:16}}>
        <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:24,textAlign:"center",marginBottom:14}}>
          <label style={{cursor:"pointer",display:"inline-block",position:"relative",marginBottom:12}}>
            <input type="file" accept="image/*" style={{display:"none"}} onChange={handleAvatarChange}/>
            {avatarUrl
              ?<img src={avatarUrl} alt="avatar" style={{width:80,height:80,borderRadius:"50%",objectFit:"cover",border:`3px solid ${T.orange}`}}/>
              :<div style={{width:80,height:80,borderRadius:"50%",background:T.orange,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:30,border:`3px solid ${T.orange}`}}>
                {user.email?.[0].toUpperCase()}
              </div>
            }
            <div style={{position:"absolute",bottom:0,right:0,background:T.orange,borderRadius:"50%",width:24,height:24,display:"flex",alignItems:"center",justifyContent:"center",border:"2px solid #fff"}}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
            </div>
          </label>
          <div style={{fontSize:18,fontWeight:700,color:T.text}}>{user.user_metadata?.full_name||user.email?.split("@")[0]}</div>
          <div style={{fontSize:13,color:T.sub,marginTop:4}}>{user.email}</div>
          <div style={{display:"inline-flex",alignItems:"center",gap:6,background:"#E8F5E9",color:"#2E7D32",borderRadius:20,padding:"4px 12px",fontSize:12,fontWeight:600,marginTop:10}}>
            <CheckCircle2 size={12}/> Compte vérifié Google
          </div>
        </div>

        {items.map((item,i)=>(
          <button key={i} style={{display:"flex",alignItems:"center",gap:14,width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"14px 16px",marginBottom:8,cursor:"pointer",color:T.text,fontSize:15,fontWeight:500,textAlign:"left"}} onClick={item.action}>
            <span style={{color:T.orange,display:"flex"}}>{item.icon}</span>
            <span style={{flex:1}}>{item.label}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.muted} strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        ))}

        <button style={{width:"100%",background:"#FFEBEE",color:"#E53935",border:"none",borderRadius:12,padding:"14px",fontSize:15,fontWeight:700,cursor:"pointer",marginTop:8}}
          onClick={async()=>{await supabase.auth.signOut();go("home");}}>
          Se déconnecter
        </button>
      </div>
    </div>
  );
};
