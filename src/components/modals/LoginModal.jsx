import { X } from "lucide-react";
import { useWoko } from '../../WokoContext.jsx';
import { supabase, SITE_URL } from '../../supabase.js';

export const LoginModal = () => {
  const { T, loginModal, setLoginModal, go } = useWoko();
  if(!loginModal) return null;
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={()=>setLoginModal(false)}>
      <div style={{background:T.card,borderRadius:"20px 20px 0 0",padding:"8px 0 40px",width:"100%",maxWidth:500}} onClick={e=>e.stopPropagation()}>
        <div style={{width:40,height:4,background:T.border,borderRadius:2,margin:"12px auto 24px"}}/>
        <div style={{textAlign:"center",marginBottom:20}}>
          <div style={{fontSize:36,marginBottom:4}}>🛍</div>
          <div style={{fontSize:22,fontWeight:800,color:T.orange}}>Woko</div>
          <div style={{fontSize:13,color:T.sub,marginTop:4}}>Le marché en ligne pour l'Afrique de l'Ouest</div>
        </div>
        <div style={{padding:"0 20px"}}>
          <button style={{width:"100%",background:"#fff",color:"#1A1A1A",border:"1.5px solid #E0E0E0",borderRadius:12,padding:"13px",fontSize:15,fontWeight:600,cursor:"pointer",marginBottom:12,display:"flex",alignItems:"center",justifyContent:"center",gap:12,boxShadow:"0 1px 4px rgba(0,0,0,0.08)"}}
            onClick={async()=>{await supabase.auth.signInWithOAuth({provider:'google',options:{redirectTo:SITE_URL}})}}>
            <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
            Continuer avec Google
          </button>
          <button style={{width:"100%",background:"#1877F2",color:"#fff",border:"none",borderRadius:12,padding:"13px",fontSize:15,fontWeight:600,cursor:"pointer",marginBottom:20,display:"flex",alignItems:"center",justifyContent:"center",gap:12}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            Continuer avec Facebook
          </button>
          <div style={{textAlign:"center",fontSize:11,color:T.muted,lineHeight:1.6}}>
            En continuant, vous acceptez nos <span style={{color:T.orange,cursor:"pointer"}} onClick={()=>{setLoginModal(false);go("tos");}}>Conditions</span> et notre <span style={{color:T.orange,cursor:"pointer"}} onClick={()=>{setLoginModal(false);go("privacy");}}>Politique de confidentialité</span>
          </div>
        </div>
      </div>
    </div>
  );
};
