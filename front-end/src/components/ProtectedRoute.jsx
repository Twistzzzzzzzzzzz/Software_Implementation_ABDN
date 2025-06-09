import { Navigate } from 'react-router-dom';
import { useAuthPrompt } from '../context/AuthPromptContext';
import { useEffect, useState } from 'react';

const ProtectedRoute = ({ children }) => {
    const { showPrompt } = useAuthPrompt();
    const isLoggedIn = localStorage.getItem('access_token') !== null;
    const [shouldRedirect, setShouldRedirect] = useState(false);

    useEffect(() => {
        if (!isLoggedIn) {
            showPrompt('Please log in to access this feature.');
            setShouldRedirect(true);
        }
    }, [isLoggedIn, showPrompt]);

    if (!isLoggedIn && shouldRedirect) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoute;