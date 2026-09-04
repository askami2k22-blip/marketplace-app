import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { WokoProvider } from './WokoContext.jsx'

if('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/market/sw.js')
      .catch(e => console.log('SW failed:', e));
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WokoProvider>
      <App />
    </WokoProvider>
  </StrictMode>,
)
