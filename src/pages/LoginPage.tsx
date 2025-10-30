import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { AuthDialog } from '@/components/auth/AuthDialog';

const LoginPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/', { replace: true });
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      {/* AuthDialog in page mode: always open for login/signup */}
      <div className="flex items-center justify-center py-24">
        <AuthDialog isOpen={true} onClose={() => {}} />
      </div>
    </div>
  );
};
export default LoginPage;
