import { ArrowLeft } from "lucide-react";
import { useWoko } from '../WokoContext.jsx';

export const TosScreen = () => {
  const { T, go } = useWoko();
  const sections = [
    {title:"1. Acceptation des conditions",text:"En utilisant Woko, vous acceptez les présentes conditions. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service."},
    {title:"2. Description du service",text:"Woko est une marketplace en ligne permettant aux vendeurs certifiés d'Afrique de l'Ouest de proposer leurs produits et services."},
    {title:"3. Inscription et compte",text:"Pour accéder à certaines fonctionnalités, vous devez créer un compte. Vous êtes responsable de la confidentialité de vos informations de connexion."},
    {title:"4. Vendeurs certifiés",text:"La certification est effectuée manuellement par l'équipe Woko après vérification d'une pièce d'identité valide."},
    {title:"5. Paiements",text:"Les paiements sont effectués via Orange Money, Wave et Moov Money. Woko n'est pas responsable des litiges entre acheteurs et vendeurs."},
    {title:"6. Livraison",text:"Les conditions de livraison sont définies par chaque vendeur. Woko facilite la mise en relation mais n'est pas responsable des délais."},
    {title:"7. Modifications",text:"Woko se réserve le droit de modifier ces conditions à tout moment."},
  ];
  return (
    <div style={{paddingBottom:70}}>
      <div style={{background:T.headerTop,padding:"12px 14px",display:"flex",alignItems:"center",gap:12}}>
        <button style={{background:"none",border:"none",color:"#fff",cursor:"pointer"}} onClick={()=>go("home")}><ArrowLeft size={20}/></button>
        <span style={{color:"#fff",fontWeight:700,fontSize:17}}>Conditions d'utilisation</span>
      </div>
      <div style={{padding:"20px 16px",lineHeight:1.7}}>
        <div style={{fontSize:13,color:T.muted,marginBottom:20}}>Dernière mise à jour : Août 2026</div>
        {sections.map((s,i)=>(
          <div key={i} style={{marginBottom:20}}>
            <div style={{fontSize:15,fontWeight:700,color:T.text,marginBottom:6}}>{s.title}</div>
            <div style={{fontSize:14,color:T.sub}}>{s.text}</div>
          </div>
        ))}
        <div style={{fontSize:13,color:T.muted,borderTop:`1px solid ${T.border}`,paddingTop:16}}>Contact : <span style={{color:T.orange}}>support@woko.africa</span></div>
      </div>
    </div>
  );
};
