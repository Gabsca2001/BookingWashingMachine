import React from 'react'
import { Outlet } from 'react-router-dom'
import Layout from './layouts/Layout'

const Home = () => {
  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}

export default Home