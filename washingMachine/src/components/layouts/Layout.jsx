import React, { useEffect } from 'react'
import NavbarHome from '../navbars/NavbarHome'

const Layout = ({ children }) => {

  //start from top
  useEffect(() => {

    window.scrollTo(0, 0);

  }, []);


  return (
    <div>
      <NavbarHome />
      {children}
    </div>
  )
}

export default Layout