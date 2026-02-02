import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ROUTES } from './routes/routes';
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import SignUpPage from './pages/auth/SignUpPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';

import { useEffect } from 'react';
import useAuthStore from './stores/useAuthStore';

import ProtectedRoute from './components/ProtectedRoute';
import ProtectedLayout from './layouts/ProtectedLayout';

import HomePage from './pages/protected/HomePage';
import MyDrivePage from './pages/protected/MyDrivePage';
import TrashPage from './pages/protected/TrashPage';
import StarredPage from './pages/protected/StarredPage';
import RecentPage from './pages/protected/RecentPage';
import SpamPage from './pages/protected/SpamPage';
import NotFoundPage from './pages/error/NotFoundPage';
import UnauthorizedPage from './pages/error/UnauthorizedPage';
import FolderPage from './pages/protected/FolderPage';
import FilePreviewPage from './pages/protected/FilePreviewPage';

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Router>
      <div className="min-h-screen bg-white text-[#0f172a]">
        <Routes>
          {/* Public Routes */}
          <Route path={ROUTES.PUBLIC.HOME} element={<LandingPage />} />
          <Route path={ROUTES.PUBLIC.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.PUBLIC.SIGNUP} element={<SignUpPage />} />
          <Route path={ROUTES.PUBLIC.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
          <Route path={ROUTES.PUBLIC.RESET_PASSWORD} element={<ResetPasswordPage />} />
          <Route path={ROUTES.PUBLIC.VERIFY_EMAIL} element={<VerifyEmailPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<ProtectedLayout />}>
              <Route path={ROUTES.PROTECTED.USER.DASHBOARD} element={<HomePage />} />
              <Route path={ROUTES.PROTECTED.USER.MY_DRIVE} element={<MyDrivePage />} />
              <Route path={ROUTES.PROTECTED.USER.STARRED} element={<StarredPage />} />
              <Route path={ROUTES.PROTECTED.USER.RECENT} element={<RecentPage />} />
              <Route path={ROUTES.PROTECTED.USER.SPAM} element={<SpamPage />} />
              <Route path={ROUTES.PROTECTED.USER.BIN} element={<TrashPage />} />
              <Route path={ROUTES.PROTECTED.USER.FOLDER} element={<FolderPage />} />
              <Route path={ROUTES.PROTECTED.USER.FILE_PREVIEW} element={<FilePreviewPage />} />
            </Route>
          </Route>

          {/* Error Routes */}
          <Route path={ROUTES.PUBLIC.UNAUTHORIZED} element={<UnauthorizedPage />} />
          <Route path={ROUTES.PUBLIC.NOT_FOUND} element={<NotFoundPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Toaster />
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </Router>
  );
}



export default App;
