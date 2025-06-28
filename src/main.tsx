import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from './context/ThemeContext.tsx';
import { BodyFatProvider } from './context/BodyFatContext.tsx';
import { UserProvider } from './context/UserContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <BodyFatProvider>
        <UserProvider>
        <App />
        </UserProvider>
      </BodyFatProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
