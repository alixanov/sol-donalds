import React from 'react'
import Main from '../components/main/Main'
import { Route, Routes } from 'react-router-dom'
import Game from '../components/game/Game'

const AppRoutes = () => {
  return (
    <div>
      <Routes >
        <Route path={"/"} element={<Main/>}/>
        <Route path={"/game"} element={<Game />} />

      </Routes>
      
    </div>
  )
}

export default AppRoutes
