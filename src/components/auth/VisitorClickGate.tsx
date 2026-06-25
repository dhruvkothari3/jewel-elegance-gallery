import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

/**
 * Recruiter-friendly gate:
 * - Anyone can SEE the homepage and browse visually.
 * - Any click on a button or link (except whitelisted ones) bounces
 *   unauthenticated users to /login so they sign up before interacting.
 */
const PUBLIC_PATHS = ['/login', '/account'];

const VisitorClickGate = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading || user) return;
    // Allow free browsing on auth pages themselves
    if (PUBLIC_PATHS.includes(location.pathname)) return;

    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest(
        'a, button, [role="button"], input[type="submit"]'
      ) as HTMLElement | null;
      if (!interactive) return;

      // Whitelist: anything explicitly marked public, or auth/nav links
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
        description: 'Create a free account to explore products, wishlist and more.',
      });
      navigate('/login', { state: { from: location.pathname } });
    };

    document.addEventListener('click', handler, true);
    return () => document.removeEventListener('click', handler, true);
  }, [user, loading, navigate, location.pathname]);

  return null;
};

export default VisitorClickGate;
