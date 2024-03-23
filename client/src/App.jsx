import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import Header from './components/Header';
import FooterCom from './components/Footer'
import AppRoutes from './AppRoutes';

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <AppRoutes />
      <FooterCom />
    </BrowserRouter>
  )
}

export default App