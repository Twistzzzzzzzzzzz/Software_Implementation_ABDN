import { Navigate } from 'react-router-dom';
import { useAuthPrompt } from '../context/AuthPromptContext';

const ProtectedRoute = ({ children }) => {
    const { showPrompt } = useAuthPrompt();
    const isLoggedIn = localStorage.getItem('access_token') !== null;

    if (!isLoggedIn) {
        showPrompt('Please log in to access this feature.');
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoute;