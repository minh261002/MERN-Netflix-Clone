import React from 'react'
import './style.scss'

import Navbar from '../../components/Navbar'
import Featured from '../../components/Featured'

const Home = () => {
  return (
    <div className='home-page'>
      <Navbar/>
      <Featured/>
    </div>
  )
}

export default Home