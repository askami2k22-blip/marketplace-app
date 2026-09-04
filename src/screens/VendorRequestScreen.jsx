import { useState } from "react";
import { ArrowLeft, Store, FileText } from "lucide-react";
import { useWoko } from '../WokoContext.jsx';
import { uploadImage, submitVendorRequest } from '../api.js';
import { supabase } from '../supabase.js';

export const VendorRequestScreen = () => {
  const { T, user, go, setLoginModal } = useWoko();
  const [form, setForm] = useState({shop_name:"",description:"",phone:"",city:""});
  const [idFile, setIdFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  if(!user) return (
    <div style={{padding:20,textAlign:"center"}}>
      <div style={{fontSize:17,fontWeight:700,color:T.text,marginBottom:12}}>Connectez-vous d'abord</div>
      <button style={{background:T.orange,color:"#fff",border:"none",borderRadius:10,padding:"12px 24px",fontSize:14,fontWeight:700,cursor:"pointer"}} onClick={()=>setLoginModal(true)}>Se connecter</button>
    </div>
  );

  if(done) return (
    <div style={{minHeight:"100vh",background:T.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"20px 24px",textAlign:"center"}}>
      <div style={{background:T.card,borderRadius:24,padding:"40px 28px",maxWidth:400,width:"100%",boxShadow:"0 8px 32px rgba(0,0,0,0.08)"}}>
        <div style={{width:80,height:80,borderRadius:"50%",background:`linear-gradient(135deg,#E65100,#FF8F00)`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",fontSize:36}}>🏪</div>
        <div style={{fontSize:22,fontWeight:800,color:T.text,marginBottom:8}}>Demande envoyée !</div>
        <div style={{width:48,height:3,background:T.orange,borderRadius:2,margin:"0 auto 16px"}}/>
        <p style={{color:T.sub,fontSize:14,lineHeight:1.7,marginBottom:24}}>Merci pour votre confiance. L'équipe <strong style={{color:T.orange}}>Woko</strong> va examiner votre dossier sous <strong>24 à 48 heures</strong>.</p>
        <div style={{background:T.indigoBg,borderRadius:12,padding:"14px 16px",marginBottom:24,textAlign:"left"}}>
          {[{e:"📋",t:"Dossier en cours d'examen"},{e:"✅",t:"Validation sous 24-48h"},{e:"📧",t:"Notification par email"},{e:"🏪",t:"Boutique activée immédiatement"}].map((s,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:10,marginBottom:i<3?10:0}}>
              <span style={{fontSize:18}}>{s.e}</span>
              <span style={{fontSize:13,color:T.text}}>{s.t}</span>
            </div>
          ))}
        </div>
        <button style={{width:"100%",background:T.orange,color:"#fff",border:"none",borderRadius:12,padding:"14px",fontSize:15,fontWeight:700,cursor:"pointer"}} onClick={()=>go("home")}>Retour à l'accueil</button>
      </div>
    </div>
  );

  const handleSubmit = async () => {
    if(!form.shop_name||!form.phone||!form.city){alert("Remplissez tous les champs obligatoires");return;}
    setSubmitting(true);
    try {
      let id_document_url = null;
      if(idFile) id_document_url = await uploadImage(idFile);
      await submitVendorRequest({user_id:user.id,...form,id_document_url});
      // Notify owner
      try {
        await supabase.functions.invoke('notify-vendor-request',{body:{shop_name:form.shop_name,phone:form.phone,city:form.city,user_email:user.email}});
      } catch(e){console.warn("Email notification failed:",e);}
      setDone(true);
    } catch(e){
      if(e.message?.includes('one_pending_per_user')){alert("Vous avez déjà une demande en cours d'examen.");}
      else if(e.message?.includes('one_vendor_per_user')){alert("Vous avez déjà une boutique active sur Woko.");}
      else alert("Erreur: "+e.message);
    }
    setSubmitting(false);
  };

  return (
    <div style={{paddingBottom:70}}>
      <div style={{background:T.headerTop,padding:"12px 14px",display:"flex",alignItems:"center",gap:12}}>
        <button style={{background:"none",border:"none",color:"#fff",cursor:"pointer"}} onClick={()=>go("home")}><ArrowLeft size={20}/></button>
        <span style={{color:"#fff",fontWeight:700,fontSize:17}}>Devenir vendeur certifié</span>
      </div>
      <div style={{padding:16}}>
        <div style={{background:T.indigoBg,borderRadius:10,padding:14,marginBottom:16,fontSize:13,color:T.orange}}>
          🏪 Complétez ce formulaire pour soumettre votre demande. L'équipe Woko vérifiera votre identité sous 24-48h.
        </div>
        {[{label:"Nom de la boutique *",key:"shop_name",placeholder:"Ex: Aïcha Couture"},{label:"Description",key:"description",placeholder:"Décrivez votre activité..."},{label:"Téléphone *",key:"phone",placeholder:"+223 70 00 00 00"},{label:"Ville *",key:"city",placeholder:"Bamako, Sikasso..."}].map(field=>(
          <div key={field.key} style={{marginBottom:12}}>
            <div style={{fontSize:13,fontWeight:600,color:T.text,marginBottom:6}}>{field.label}</div>
            <input style={{width:"100%",background:T.bg,border:`1px solid ${T.border}`,borderRadius:8,padding:"11px 12px",fontSize:14,color:T.text,outline:"none",boxSizing:"border-box"}}
              placeholder={field.placeholder} value={form[field.key]} onChange={e=>setForm({...form,[field.key]:e.target.value})}/>
          </div>
        ))}
        <div style={{marginBottom:16}}>
          <div style={{fontSize:13,fontWeight:600,color:T.text,marginBottom:6}}>Pièce d'identité (optionnel)</div>
          <label style={{display:"flex",alignItems:"center",gap:10,background:T.bg,border:`1px dashed ${T.border}`,borderRadius:8,padding:"11px 12px",cursor:"pointer"}}>
            <input type="file" accept="image/*" style={{display:"none"}} onChange={e=>setIdFile(e.target.files?.[0]||null)}/>
            <FileText size={16} color={T.orange}/>
            <span style={{fontSize:13,color:idFile?T.green:T.sub}}>{idFile?idFile.name:"Importer votre CNI, passeport..."}</span>
          </label>
        </div>
        <button style={{width:"100%",background:submitting?T.muted:T.orange,color:"#fff",border:"none",borderRadius:10,padding:"14px",fontSize:15,fontWeight:700,cursor:submitting?"not-allowed":"pointer"}} onClick={handleSubmit} disabled={submitting}>
          {submitting?"Envoi en cours...":"Soumettre ma demande"}
        </button>
      </div>
    </div>
  );
};
