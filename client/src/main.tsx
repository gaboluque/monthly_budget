import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/main.css'
import { registerSW } from 'virtual:pwa-register'
import { BrowserRouter } from 'react-router'

// Register service worker
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('New content available. Reload?')) {
      updateSW(true)
    }
  },
  onOfflineReady() {
    console.log('App ready to work offline')
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
