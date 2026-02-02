import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../stores/useAuthStore';
import { ROUTES } from '../routes/routes';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = () => {
    const { user, loading } = useAuthStore();

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-brand-600" />
            </div>
        );
    }

    return user ? <Outlet /> : <Navigate to={ROUTES.PUBLIC.LOGIN} replace />;
};

export default ProtectedRoute;
