import { useState } from "react";
import { ArrowLeft, ShoppingCart, Minus, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { useWoko } from '../WokoContext.jsx';
import { money, ZONES, PAYMENTS } from '../theme.js';

export const CartScreen = () => {
  const { T, cart, updQty, remCart, cartCount, findP, findV, getProductVendor, go } = useWoko();
  const [zone, setZone] = useState("centre");
  const [payment, setPayment] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  const subtotal = cart.reduce((s,i)=>s+(findP(i.pid)?.price||0)*i.qty,0);
  const delivFee = ZONES.find(z=>z.id===zone)?.fee||0;
  const total = subtotal+(cart.length?delivFee:0);

  if(confirmed) return (
    <div style={{padding:"60px 20px",textAlign:"center"}}>
      <div style={{width:64,height:64,borderRadius:"50%",background:"#E8F5E9",color:"#2E7D32",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}><CheckCircle2 size={32}/></div>
      <div style={{fontSize:20,fontWeight:700,color:T.text,marginBottom:8}}>Commande confirmée !</div>
      <div style={{color:T.sub,marginBottom:24}}>Total : {money(total)}</div>
      <button style={{background:T.orange,color:"#fff",border:"none",borderRadius:10,padding:"13px 24px",fontSize:15,fontWeight:700,cursor:"pointer"}} onClick={()=>go("home")}>Retour à l'accueil</button>
    </div>
  );

  if(cart.length===0) return (
    <div style={{padding:"60px 20px",textAlign:"center",paddingBottom:70}}>
      <ShoppingCart size={48} color={T.border} style={{margin:"0 auto 16px",display:"block"}}/>
      <div style={{fontSize:18,fontWeight:700,color:T.text,marginBottom:8}}>Panier vide</div>
      <button style={{background:T.orange,color:"#fff",border:"none",borderRadius:10,padding:"12px 24px",fontSize:14,fontWeight:700,cursor:"pointer"}} onClick={()=>go("home")}>Explorer le marché</button>
    </div>
  );

  return (
    <div style={{paddingBottom:80}}>
      <div style={{background:T.headerTop,padding:"12px 14px",display:"flex",alignItems:"center",gap:12}}>
        <button style={{background:"none",border:"none",color:"#fff",cursor:"pointer"}} onClick={()=>go("home")}><ArrowLeft size={20}/></button>
        <span style={{color:"#fff",fontWeight:700,fontSize:17}}>Mon panier ({cartCount})</span>
      </div>
      <div style={{padding:12}}>
        {cart.map(item=>{
          const p=findP(item.pid); const v=getProductVendor(p); if(!p||!v) return null;
          return (
            <div key={item.pid} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:8,padding:12,marginBottom:8,display:"flex",gap:10,alignItems:"center"}}>
              <div style={{width:60,height:60,borderRadius:6,background:`linear-gradient(135deg,${v.color}CC,${v.color}44)`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:16,flexShrink:0}}>{v.initials}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:14,fontWeight:600,color:T.text}}>{p.title}</div>
                <div style={{fontSize:15,fontWeight:800,color:T.orange}}>{money(p.price*item.qty)}</div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <button style={{width:28,height:28,borderRadius:"50%",background:T.tag,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>updQty(item.pid,-1)}><Minus size={12}/></button>
                <span style={{fontWeight:700,minWidth:20,textAlign:"center"}}>{item.qty}</span>
                <button style={{width:28,height:28,borderRadius:"50%",background:T.tag,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>updQty(item.pid,1)}><Plus size={12}/></button>
                <button style={{width:28,height:28,borderRadius:"50%",background:"#FFEBEE",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#E53935"}} onClick={()=>remCart(item.pid)}><Trash2 size={12}/></button>
              </div>
            </div>
          );
        })}

        <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:8,padding:14,marginBottom:10}}>
          <div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:10}}>Zone de livraison</div>
          {ZONES.map(z=>(
            <button key={z.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",padding:"10px 0",background:"none",border:"none",borderBottom:`1px solid ${T.border}`,cursor:"pointer",color:T.text}} onClick={()=>setZone(z.id)}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:18,height:18,borderRadius:"50%",border:`2px solid ${zone===z.id?T.orange:T.muted}`,background:zone===z.id?T.orange:"transparent"}}/>
                <span style={{fontSize:14}}>{z.label}</span>
              </div>
              <span style={{fontSize:14,fontWeight:600,color:T.orange}}>{money(z.fee)}</span>
            </button>
          ))}
        </div>

        <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:8,padding:14,marginBottom:10}}>
          <div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:10}}>Paiement</div>
          <div style={{display:"flex",gap:8}}>
            {PAYMENTS.map(pm=>(
              <button key={pm.id} style={{flex:1,background:payment===pm.id?pm.color+"22":T.tag,border:`2px solid ${payment===pm.id?pm.color:T.border}`,borderRadius:8,padding:"10px 4px",cursor:"pointer",textAlign:"center"}} onClick={()=>setPayment(pm.id)}>
                <div style={{width:22,height:22,borderRadius:"50%",background:pm.color,margin:"0 auto 5px"}}/>
                <div style={{fontSize:10,fontWeight:600,color:T.text}}>{pm.label}</div>
              </button>
            ))}
          </div>
        </div>

        <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:8,padding:14,marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:6,fontSize:14,color:T.sub}}><span>Sous-total</span><span>{money(subtotal)}</span></div>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:10,fontSize:14,color:T.sub}}><span>Livraison</span><span>{money(delivFee)}</span></div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:18,fontWeight:800,color:T.orange}}><span>Total</span><span>{money(total)}</span></div>
        </div>

        <button style={{width:"100%",background:payment?T.orange:T.muted,color:"#fff",border:"none",borderRadius:10,padding:14,fontSize:16,fontWeight:700,cursor:payment?"pointer":"not-allowed"}} onClick={()=>payment&&setConfirmed(true)}>
          {payment?"Confirmer la commande":"Choisissez un mode de paiement"}
        </button>
      </div>
    </div>
  );
};
