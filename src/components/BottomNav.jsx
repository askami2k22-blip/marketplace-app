import { Home, Grid, Search, PlusCircle } from "lucide-react";
import { useWoko } from '../WokoContext.jsx';

export const BottomNav = () => {
  const { T, screen, go, setLoginModal } = useWoko();
  const tabs = [
    {icon:<Home size={20}/>,label:"Accueil",sc:"home"},
    {icon:<Grid size={20}/>,label:"Catégories",sc:"search"},
    {icon:<Search size={20}/>,label:"Recherche",sc:"search"},
    {icon:<PlusCircle size={22}/>,label:"Publier",sc:"publish",accent:true},
  ];
  return (
    <div style={{position:"fixed",bottom:0,left:0,right:0,background:T.navBg,borderTop:`1px solid ${T.border}`,display:"flex",zIndex:100}}>
      {tabs.map(tab=>(
        <button key={tab.sc+tab.label} style={{flex:1,padding:"10px 4px 8px",background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,color:tab.accent?T.orange:(screen===tab.sc?T.orange:T.muted)}}
          onClick={()=>tab.accent?setLoginModal(true):go(tab.sc)}>
          {tab.icon}
          <span style={{fontSize:10,fontWeight:screen===tab.sc?700:400}}>{tab.label}</span>
        </button>
      ))}
    </div>
  );
};
