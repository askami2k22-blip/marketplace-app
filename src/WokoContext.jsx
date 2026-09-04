import { createContext, useContext, useState, useEffect } from "react";
import { supabase, SITE_URL } from './supabase.js';
import { LIGHT, DARK } from './theme.js';
import { getProducts, getVendors, getUserRole, getVendorByUserId, getFavorites, getAppointmentsByVendor, getOrdersByVendor } from './api.js';

const WokoContext = createContext(null);

export const useWoko = () => useContext(WokoContext);

export const WokoProvider = ({ children }) => {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [dark, setDark] = useState(prefersDark);
  const T = dark ? DARK : LIGHT;

  const [screen, setScreen] = useState(() => sessionStorage.getItem('woko-screen') || "home");
  const [screenId, setScreenId] = useState(() => sessionStorage.getItem('woko-screen-id') || null);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState('buyer');
  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);
  const [myVendor, setMyVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [orders, setOrders] = useState([]);
  const [appts, setAppts] = useState([]);
  const [sellerProducts, setSellerProducts] = useState([]);
  const [notifCount, setNotifCount] = useState(0);
  const [loginModal, setLoginModal] = useState(false);
  const [callModal, setCallModal] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const go = (s, id = null) => {
    setScreen(s); setScreenId(id); setMenuOpen(false);
    window.scrollTo({top:0,behavior:'smooth'});
    sessionStorage.setItem('woko-screen', s);
    sessionStorage.setItem('woko-screen-id', id || '');
  };

  const getVendorColor = (vendor) => {
    if(!vendor) return "#E65100";
    if(vendor.color) return vendor.color;
    const colors = ["#E65100","#1565C0","#2E7D32","#AD1457","#4527A0","#00695C","#F57F17","#6A1B9A"];
    return colors[(vendor.name||"").charCodeAt(0) % colors.length];
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [v, p] = await Promise.all([getVendors(), getProducts()]);
      setVendors((v||[]).map(vendor=>({...vendor, color:getVendorColor(vendor), initials:vendor.initials||vendor.name?.[0]?.toUpperCase()||"?"})));
      setProducts(p || []);
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  const loadUserData = async (u) => {
    if(!u) { setUserRole('buyer'); setMyVendor(null); setSellerProducts([]); setFavorites([]); return; }
    try {
      const role = await getUserRole(u.id);
      const vendor = await getVendorByUserId(u.id);
      setUserRole(role || 'buyer');
      setMyVendor(vendor || null);
      if(vendor) {
        const [vProducts, vOrders, vAppts] = await Promise.all([
          getProducts(vendor.id, true),
          getOrdersByVendor(vendor.id),
          getAppointmentsByVendor(vendor.id)
        ]);
        setSellerProducts(vProducts || []);
        setOrders(vOrders || []);
        setAppts(vAppts || []);
        const {count} = await supabase.from('appointments').select('*',{count:'exact',head:true}).eq('vendor_id',vendor.id).eq('status','pending');
        setNotifCount(count || 0);
      }
      const favIds = await getFavorites(u.id);
      setFavorites(favIds || []);
    } catch(e) { console.error(e); }
  };

  useEffect(() => {
    loadData();
    const hash = window.location.hash;
    if(hash.startsWith('#product/')) { const id = hash.replace('#product/',''); if(id){setScreen('product');setScreenId(id);} }
    supabase.auth.getSession().then(({data:{session}}) => { const u=session?.user??null; setUser(u); loadUserData(u); });
    const {data:{subscription}} = supabase.auth.onAuthStateChange((_,session) => { const u=session?.user??null; setUser(u); loadUserData(u); });
    return () => subscription.unsubscribe();
  }, []);

  const addCart = pid => setCart(prev=>{const ex=prev.find(i=>i.pid===pid);return ex?prev.map(i=>i.pid===pid?{...i,qty:i.qty+1}:i):[...prev,{pid,qty:1}];});
  const updQty = (pid,d) => setCart(prev=>prev.map(i=>i.pid===pid?{...i,qty:i.qty+d}:i).filter(i=>i.qty>0));
  const remCart = pid => setCart(prev=>prev.filter(i=>i.pid!==pid));
  const cartCount = cart.reduce((s,i)=>s+i.qty,0);

  const toggleFav = async (id) => {
    if(!user){setLoginModal(true);return;}
    setFavorites(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev,id]);
    try { const {toggleFavorite}=await import('./api.js'); await toggleFavorite(user.id,id); }
    catch(e){setFavorites(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev,id]);}
  };

  const findP = id => { if(!id)return null; return products.find(p=>p.id===id)||sellerProducts.find(p=>p.id===id)||null; };
  const findV = id => { if(!id)return null; const v=vendors.find(v=>v.id===id); return v?{...v,color:getVendorColor(v),initials:v.initials||v.name?.[0]?.toUpperCase()||"?"}:null; };
  const getProductVendor = (p) => { if(!p)return null; let v=null; if(p.vendors)v=p.vendors; else if(p.vendor_id)v=findV(p.vendor_id); else if(p.vendorId)v=findV(p.vendorId); if(!v)return null; return {...v,color:getVendorColor(v),initials:v.initials||v.name?.[0]?.toUpperCase()||"?"}; };

  const shareProduct = async (p, v) => {
    const url = `${window.location.origin}/market/#product/${p.id}`;
    const text = `🛍 ${p.title} — ${Number(p.price).toLocaleString("fr-FR")} FCFA\nVendeur: ${v?.name||''}\n`;
    if(navigator.share){try{await navigator.share({title:p.title,text,url});}catch(e){if(e.name!=='AbortError')copyLink(url);}}
    else copyLink(url);
  };

  const copyLink = (text) => {
    navigator.clipboard.writeText(text).then(()=>{
      const t=document.createElement('div');
      t.textContent='🔗 Lien copié !';
      t.style.cssText='position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#1A1A1A;color:#fff;padding:10px 20px;border-radius:20px;font-size:14px;font-weight:600;z-index:9999';
      document.body.appendChild(t);setTimeout(()=>document.body.removeChild(t),2000);
    });
  };

  return (
    <WokoContext.Provider value={{
      dark,setDark,T,screen,screenId,go,user,userRole,vendors,products,myVendor,
      loading,cart,addCart,updQty,remCart,cartCount,favorites,toggleFav,
      orders,setOrders,appts,setAppts,sellerProducts,setSellerProducts,
      notifCount,setNotifCount,loginModal,setLoginModal,callModal,setCallModal,
      menuOpen,setMenuOpen,findP,findV,getProductVendor,getVendorColor,
      loadData,loadUserData,shareProduct,supabase
    }}>
      {children}
    </WokoContext.Provider>
  );
};
