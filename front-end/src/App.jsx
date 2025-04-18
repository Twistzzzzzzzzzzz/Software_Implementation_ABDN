import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home/Home'
import './App.css'
import { useState } from 'react'
import SelfPsycho from './pages/Self-psycho/Self-psycho'
import Community from './pages/Community/Community'
import Navbar from './main_components/Navbar/Navbar'
import AI_chat from './pages/AI_chat/AI_chat'
import Healing_vedio from './pages/Healing_vedio/Healing_vedio'
import Contact from './pages/Contact/Contact'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
      <div className='app'>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home></Home>}></Route>
          <Route path='/ai-chat' element={<AI_chat></AI_chat>}></Route>
          <Route path = '/healing-vedio' element={<Healing_vedio></Healing_vedio>}></Route>
          <Route path = '/self-psycho' element={<SelfPsycho></SelfPsycho>}></Route>
          <Route path = '/contact' element={<Contact></Contact>}></Route>
          <Route path = '/community' element={<Community></Community>}></Route>
        </Routes>
      </div>
      </BrowserRouter>
    </>
  )
}

export default App
