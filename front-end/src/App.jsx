import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { lazy, Suspense, useState } from 'react'
import './App.css'
import Navbar from './main_components/Navbar/Navbar'
import Footer from './main_components/Footer/Footer'

// 删除所有直接导入的组件（如 Home、AI_chat 等）

// 使用懒加载组件
const Home = lazy(() => import('./pages/Home/Home'))
const AI_chat = lazy(() => import('./pages/AI_chat/AI_chat'))
const Healing_video = lazy(() => import('./pages/Healing_video/Healing_video'))
const SelfPsycho = lazy(() => import('./pages/Self-psycho/Self-psycho'))
const Community = lazy(() => import('./pages/Community/Community'))
const Articles = lazy(() => import('./pages/Articles_Page/ArticlesMain'))

const Answer_page = lazy(() => import('./pages/Self-psycho/components/Answer_page/Answer_page'))
const Report = lazy(() => import('./pages/Self-psycho/pages/report/report'))
const Login = lazy(() => import('./pages/Login/Login'))
const Register = lazy(() => import('./pages/Register/Register'))

// 加载状态组件
const LoadingFallback = () => (
    <div className="page-loading">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
    </div>
)

function AppContent() {
    const location = useLocation();
    const isHealingVideo = location.pathname === '/healing-vedio';
    const isAIChat = location.pathname === '/ai-chat';
    return (
        <div className='app'>
            <Navbar />
            <Suspense fallback={<LoadingFallback />}>
                <Routes>
                    <Route path='/' element={<Home />}></Route>
                    <Route path='/ai-chat' element={<AI_chat />}></Route>
                    <Route path='/healing-vedio' element={<Healing_video />}></Route>
                    <Route path='/self-psycho' element={<SelfPsycho />}></Route>
                    <Route path='/self-psycho/anxiety' element={<Answer_page />}></Route>
                    <Route path='/self-psycho/depression' element={<Answer_page />}></Route>
                    <Route path='/self-psycho/career' element={<Answer_page />}></Route>
                    <Route path='/articles' element={<Articles />}></Route>

                    <Route path='/community' element={<Community />}></Route>
                    <Route path='/self-psycho/report' element={<Report />}></Route>
                    <Route path='/login' element={<Login />}></Route>
                    <Route path='/register' element={<Register />}></Route>
                </Routes>
            </Suspense>
            {!(isHealingVideo || isAIChat) && <Footer />}
        </div>
    )
}

function App() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    )
}

export default App