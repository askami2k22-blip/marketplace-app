import { useWoko } from './WokoContext.jsx';
import { Header } from './components/Header.jsx';
import { BottomNav } from './components/BottomNav.jsx';
import { SideMenu } from './components/SideMenu.jsx';
import { CallModal } from './components/modals/CallModal.jsx';
import { LoginModal } from './components/modals/LoginModal.jsx';

// Screens
import { HomeScreen } from './screens/HomeScreen.jsx';
import { SearchScreen } from './screens/SearchScreen.jsx';
import { ProductScreen } from './screens/ProductScreen.jsx';
import { VendorScreen } from './screens/VendorScreen.jsx';
import { CartScreen } from './screens/CartScreen.jsx';
import { BookingScreen } from './screens/BookingScreen.jsx';
import { DashboardScreen } from './screens/DashboardScreen.jsx';
import { ProfileScreen } from './screens/ProfileScreen.jsx';
import { AdminScreen } from './screens/AdminScreen.jsx';
import { TosScreen } from './screens/TosScreen.jsx';
import { PrivacyScreen } from './screens/PrivacyScreen.jsx';
import { FavoritesScreen } from './screens/FavoritesScreen.jsx';
import { MyAppointmentsScreen } from './screens/MyAppointmentsScreen.jsx';
import { VendorRequestScreen } from './screens/VendorRequestScreen.jsx';

const SCREENS = {
  home: HomeScreen,
  search: SearchScreen,
  product: ProductScreen,
  vendor: VendorScreen,
  cart: CartScreen,
  booking: BookingScreen,
  dashboard: DashboardScreen,
  profile: ProfileScreen,
  admin: AdminScreen,
  tos: TosScreen,
  privacy: PrivacyScreen,
  favorites: FavoritesScreen,
  'my-appointments': MyAppointmentsScreen,
  'vendor-request': VendorRequestScreen,
};

export default function App() {
  const { T, screen, menuOpen, dark } = useWoko();

  const Current = SCREENS[screen] || HomeScreen;

  return (
    <div style={{
      minHeight:"100vh",
      background:T.bg,
      color:T.text,
      fontFamily:"'Inter','Segoe UI',sans-serif",
      width:"100%",
      position:"relative"
    }}>
      <style>{`
        * { box-sizing:border-box; margin:0; padding:0; }
        html { scroll-behavior:smooth; }
        body {
          -webkit-overflow-scrolling:touch;
          width:100%;
          overflow-x:hidden;
          overflow-y:auto;
          overscroll-behavior-y:none;
        }
        @keyframes fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideInLeft { from{transform:translateX(-100%)} to{transform:translateX(0)} }
        button { transition:opacity 0.15s,transform 0.1s; -webkit-tap-highlight-color:transparent; }
        button:active { opacity:0.75; transform:scale(0.97); }
        a { -webkit-tap-highlight-color:transparent; }
        ::-webkit-scrollbar { display:none; }
        * { -webkit-font-smoothing:antialiased; }
        @media (min-width:768px) {
          #root > div { max-width:480px; margin:0 auto; box-shadow:0 0 60px rgba(0,0,0,0.15); min-height:100vh; }
        }
      `}</style>

      <Header/>
      {menuOpen && <SideMenu/>}
      <CallModal/>
      <LoginModal/>
      <Current/>
      <BottomNav/>
    </div>
  );
}
