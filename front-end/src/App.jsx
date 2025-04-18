import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import { useState } from 'react'
import Navbar from './main_components/Navbar/Navbar'
import Footer from './main_components/Footer/Footer'
import Home from './pages/Home/Home'
import SelfPsycho from './pages/Self-psycho/Self-psycho'
import Community from './pages/Community/Community'
import AI_chat from './pages/AI_chat/AI_chat'
import Healing_video from './pages/Healing_video/Healing_video.jsx'
import Contact from './pages/Contact/Contact'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
      <div className='app'>
        <Navbar/>
        <Routes>
          <Route path='/' element={<Home></Home>}></Route>
          <Route path='/ai-chat' element={<AI_chat></AI_chat>}></Route>
          <Route path = '/healing-vedio' element={<Healing_video></Healing_video>}></Route>
          <Route path = '/self-psycho' element={<SelfPsycho></SelfPsycho>}></Route>
          <Route path = '/contact' element={<Contact></Contact>}></Route>
          <Route path = '/community' element={<Community></Community>}></Route>
        </Routes>
        <Footer/>
      </div>
      </BrowserRouter>
    </>
  )
}

export default App
