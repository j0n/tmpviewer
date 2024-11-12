import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Demo from './Demo/Demo.tsx'
import './app.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Demo />
  </StrictMode>,
)
