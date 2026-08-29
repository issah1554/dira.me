import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './assets/css/animate.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import App from './App.tsx'
import { registerServiceWorker } from './registerServiceWorker'

// Register PWA Service Worker for offline caching & shortcut launching
registerServiceWorker()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
