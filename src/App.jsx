import React from 'react'
import ThemeProvider from './theme';
import Router from './Routes/Router';

const App = () => {
  return (
     <ThemeProvider>
      <Router />
    </ThemeProvider>
  )
}

export default App