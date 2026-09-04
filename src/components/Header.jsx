import { Menu, Search, ShoppingCart, User } from "lucide-react";
import { useWoko } from '../WokoContext.jsx';

export const Header = () => {
  const { T, user, cartCount, notifCount, go, setMenuOpen, setLoginModal } = useWoko();
  return (
    <div style={{position:"sticky",top:0,zIndex:100}}>
      <div style={{background:T.headerTop,padding:"10px 12px",display:"flex",alignItems:"center",gap:10}}>
        <button style={{background:"none",border:"none",cursor:"pointer",color:"#fff",padding:4}} onClick={()=>setMenuOpen(true)}>
          <Menu size={22}/>
        </button>
        <button style={{fontWeight:800,fontSize:20,color:"#fff",background:"none",border:"none",cursor:"pointer",flexShrink:0}} onClick={()=>go("home")}>
          🛍 Woko
        </button>
        <div style={{flex:1,display:"flex",alignItems:"center",background:"rgba(255,255,255,0.2)",borderRadius:8,padding:"7px 12px",gap:8,cursor:"pointer"}} onClick={()=>go("search")}>
          <Search size={15} color="rgba(255,255,255,0.8)"/>
          <span style={{color:"rgba(255,255,255,0.8)",fontSize:14}}>Rechercher...</span>
        </div>
        <button style={{background:"none",border:"none",cursor:"pointer",color:"#fff",position:"relative",padding:4}} onClick={()=>go("cart")}>
          <ShoppingCart size={22}/>
          {cartCount>0&&<span style={{position:"absolute",top:-2,right:-2,background:"#fff",color:T.orange,borderRadius:"50%",width:16,height:16,fontSize:10,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800}}>{cartCount}</span>}
        </button>
        <button style={{background:"none",border:"none",cursor:"pointer",color:"#fff",padding:4,position:"relative"}} onClick={()=>user?go("profile"):setLoginModal(true)}>
          {user
            ?<div style={{width:28,height:28,borderRadius:"50%",background:"rgba(255,255,255,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:"#fff",overflow:"hidden"}}>
              {user.user_metadata?.avatar_url?<img src={user.user_metadata.avatar_url} style={{width:28,height:28,borderRadius:"50%",objectFit:"cover"}}/>:user.email?.[0].toUpperCase()}
            </div>
            :<User size={22}/>
          }
          {notifCount>0&&<span style={{position:"absolute",top:-2,right:-2,background:"#E53935",color:"#fff",borderRadius:"50%",width:16,height:16,fontSize:9,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800}}>{notifCount>9?"9+":notifCount}</span>}
        </button>
      </div>
    </div>
  );
};
