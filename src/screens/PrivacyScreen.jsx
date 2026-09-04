import { ArrowLeft } from "lucide-react";
import { useWoko } from '../WokoContext.jsx';

export const PrivacyScreen = () => {
  const { T, go } = useWoko();
  const sections = [
    {title:"1. Données collectées",text:"Woko collecte : adresse email, nom d'affichage via Google OAuth, historique des commandes et rendez-vous."},
    {title:"2. Utilisation des données",text:"Vos données sont utilisées pour gérer votre compte, traiter vos commandes et améliorer nos services. Nous ne vendons jamais vos données."},
    {title:"3. Authentification Google",text:"Lorsque vous vous connectez via Google, nous recevons uniquement votre email et votre nom."},
    {title:"4. Sécurité",text:"Vos données sont stockées de manière sécurisée via Supabase avec chiffrement en transit et au repos."},
    {title:"5. Vos droits",text:"Vous pouvez demander l'accès, la modification ou la suppression de vos données en nous contactant."},
    {title:"6. Cookies",text:"Woko utilise uniquement des cookies essentiels. Aucun cookie de tracking publicitaire."},
    {title:"7. Contact",text:"Pour toute question : privacy@woko.africa"},
  ];
  return (
    <div style={{paddingBottom:70}}>
      <div style={{background:T.headerTop,padding:"12px 14px",display:"flex",alignItems:"center",gap:12}}>
        <button style={{background:"none",border:"none",color:"#fff",cursor:"pointer"}} onClick={()=>go("home")}><ArrowLeft size={20}/></button>
        <span style={{color:"#fff",fontWeight:700,fontSize:17}}>Politique de confidentialité</span>
      </div>
      <div style={{padding:"20px 16px",lineHeight:1.7}}>
        <div style={{fontSize:13,color:T.muted,marginBottom:20}}>Dernière mise à jour : Août 2026</div>
        {sections.map((s,i)=>(
          <div key={i} style={{marginBottom:20}}>
            <div style={{fontSize:15,fontWeight:700,color:T.text,marginBottom:6}}>{s.title}</div>
            <div style={{fontSize:14,color:T.sub}}>{s.text}</div>
          </div>
        ))}
        <div style={{fontSize:13,color:T.muted,borderTop:`1px solid ${T.border}`,paddingTop:16}}>Contact : <span style={{color:T.orange}}>privacy@woko.africa</span></div>
      </div>
    </div>
  );
};
