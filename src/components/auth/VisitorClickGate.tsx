import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const VisitorClickGate = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading || user) return;

    if (
      location.pathname.includes('/login') ||
      location.pathname.includes('/account')
    ) {
      return;
    }

    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest(
        'a, button, [role="button"], input[type="submit"]'
      ) as HTMLElement | null;

      if (!interactive) return;

      if (interactive.closest('[data-public="true"]')) return;

      const href = interactive.getAttribute('href') || '';

      if (
        href.startsWith('/login') ||
        href.startsWith('/signup') ||
        href === '/' ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('http')
      ) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      toast.info('Please sign up to continue', {
        description:
          'Create a free account to explore products, wishlist and more.',
      });

      navigate('/login', {
        replace: true,
        state: { from: location.pathname },
      });
    };

    document.addEventListener('click', handler, true);

    return () => {
      document.removeEventListener('click', handler, true);
    };
  }, [user, loading, navigate, location.pathname]);

  return null;
};

export default VisitorClickGate;
