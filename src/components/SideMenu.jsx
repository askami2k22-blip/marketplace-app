import { X, Sun, Moon, User, Plus, PlusCircle, Store, Home, Shirt, Smartphone, UtensilsCrossed, Sparkles, Palette, Wrench } from "lucide-react";
import { useWoko } from '../WokoContext.jsx';
import { supabase, SITE_URL } from '../supabase.js';

const CATS = [
  {id:"mode",label:"Mode & Textile",icon:<Shirt size={16}/>},
  {id:"elec",label:"Électronique",icon:<Smartphone size={16}/>},
  {id:"resto",label:"Restauration",icon:<UtensilsCrossed size={16}/>},
  {id:"beaute",label:"Beauté & Bien-être",icon:<Sparkles size={16}/>},
  {id:"artisan",label:"Artisanat",icon:<Palette size={16}/>},
  {id:"service",label:"Services à domicile",icon:<Wrench size={16}/>},
];

export const SideMenu = () => {
  const { T, dark, setDark, user, userRole, go, setMenuOpen, setLoginModal } = useWoko();
  return (
    <>
      <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:200}} onClick={()=>setMenuOpen(false)}/>
      <div style={{position:"fixed",top:0,left:0,bottom:0,width:280,background:T.card,zIndex:300,overflowY:"auto",boxShadow:"4px 0 20px rgba(0,0,0,0.2)",animation:"slideInLeft 0.25s ease both"}}>
        <div style={{background:T.headerTop,padding:"20px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <span style={{color:"#fff",fontWeight:800,fontSize:20}}>🛍 Woko</span>
          <button style={{background:"none",border:"none",color:"#fff",cursor:"pointer"}} onClick={()=>setMenuOpen(false)}><X size={20}/></button>
        </div>

        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 16px",borderBottom:`1px solid ${T.border}`}}>
          <div style={{display:"flex",gap:12}}>
            <span style={{fontWeight:700,color:T.orange,fontSize:13}}>FR</span>
            <span style={{color:T.sub,fontSize:13}}>عربية</span>
            <span style={{color:T.sub,fontSize:13}}>EN</span>
          </div>
          <button style={{background:T.tag,border:"none",borderRadius:20,padding:"4px 12px",cursor:"pointer",display:"flex",alignItems:"center",gap:6,color:T.text,fontSize:13}} onClick={()=>setDark(d=>!d)}>
            {dark?<Sun size={14}/>:<Moon size={14}/>} {dark?"Clair":"Sombre"}
          </button>
        </div>

        <div style={{padding:"8px 0",borderBottom:`1px solid ${T.border}`}}>
          <div style={{padding:"4px 16px 8px",color:T.muted,fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:1}}>Compte</div>
          {user
            ?<button style={{display:"flex",alignItems:"center",gap:14,width:"100%",padding:"12px 16px",background:"none",border:"none",cursor:"pointer",color:T.text,fontSize:15}} onClick={()=>{setMenuOpen(false);go("profile");}}>
              <span style={{color:T.orange}}><User size={18}/></span>Mon profil
            </button>
            :<>
              <button style={{display:"flex",alignItems:"center",gap:14,width:"100%",padding:"12px 16px",background:"none",border:"none",cursor:"pointer",color:T.text,fontSize:15}} onClick={()=>{setMenuOpen(false);setLoginModal(true);}}><span style={{color:T.orange}}><User size={18}/></span>Se connecter</button>
              <button style={{display:"flex",alignItems:"center",gap:14,width:"100%",padding:"12px 16px",background:"none",border:"none",cursor:"pointer",color:T.text,fontSize:15}} onClick={()=>{setMenuOpen(false);setLoginModal(true);}}><span style={{color:T.orange}}><Plus size={18}/></span>Créer compte</button>
              <button style={{display:"flex",alignItems:"center",gap:14,width:"100%",padding:"12px 16px",background:"none",border:"none",cursor:"pointer",color:T.text,fontSize:15}} onClick={()=>{setMenuOpen(false);setLoginModal(true);}}><span style={{color:T.orange}}><PlusCircle size={18}/></span>Publier une annonce</button>
            </>
          }
        </div>

        <div style={{padding:"8px 0",borderBottom:`1px solid ${T.border}`}}>
          <div style={{padding:"4px 16px 8px",color:T.muted,fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:1}}>Espace</div>
          <button style={{display:"flex",alignItems:"center",gap:14,width:"100%",padding:"12px 16px",background:"none",border:"none",cursor:"pointer",color:T.text,fontSize:15}} onClick={()=>{setMenuOpen(false);go("dashboard");}}>
            <span style={{color:T.orange}}><Store size={18}/></span>Mon espace vendeur
          </button>
          <button style={{display:"flex",alignItems:"center",gap:14,width:"100%",padding:"12px 16px",background:"none",border:"none",cursor:"pointer",color:T.text,fontSize:15}} onClick={()=>{setMenuOpen(false);go("home");}}>
            <span style={{color:T.orange}}><Home size={18}/></span>Espace acheteur
          </button>
        </div>

        <div style={{padding:"8px 0"}}>
          <div style={{padding:"4px 16px 8px",color:T.muted,fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:1}}>Catégories</div>
          {CATS.map(cat=>(
            <button key={cat.id} style={{display:"flex",alignItems:"center",gap:14,width:"100%",padding:"11px 16px",background:"none",border:"none",cursor:"pointer",color:T.text,fontSize:14}} onClick={()=>{setMenuOpen(false);go("home");}}>
              <span style={{color:T.orange,display:"flex",alignItems:"center"}}>{cat.icon}</span>{cat.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};
