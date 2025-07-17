import React from 'react'
import ThemeProvider from './theme';
import Router from './Routes/Router';

const App = () => {
  console.log("💡 ENV VAR:", import.meta.env.VITE_API_URL);

  return (
     <ThemeProvider>
      <Router />
    </ThemeProvider>
  )
}

export default App