import Main from './pages/main/main'
import { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function SelfPsycho() {
    const topRef = useRef(null);
    const location = useLocation();
    useEffect(() => {
        if (location.state && location.state.scrollToTop && topRef.current) {
            topRef.current.scrollIntoView({ behavior: 'auto' });
        }
    }, [location]);
    return (
        <div>
            <div ref={topRef}></div>
            <Main />
        </div>
    )
}
