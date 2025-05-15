import { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function Contact() {
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
            <h1>Contact Page</h1>
        </div>
    )
}

export default Contact;