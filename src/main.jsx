import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { SnackbarAndLoaderProvider,  } from './context/snackbar.jsx'
import { AuthProvider } from './context/useAuth.jsx'

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
   <SnackbarAndLoaderProvider>
       <AuthProvider>
    <App />
    </AuthProvider>
    </SnackbarAndLoaderProvider>
    </BrowserRouter>
)
