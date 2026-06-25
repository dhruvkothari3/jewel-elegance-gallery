import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { supabase } from '@/integrations/supabase/client';

(async () => {
  const sessionData = await supabase.auth.getSession();
  const hasSession = !!sessionData.data.session;
  const redirectUrl = window.location.pathname;
  const onLoginPage =
    redirectUrl.startsWith('/login') ||
    redirectUrl.startsWith('/signup');

  if (!hasSession && !onLoginPage) {
    window.location.href = `${import.meta.env.BASE_URL}login`;
    return;
  }

  createRoot(document.getElementById('root')!).render(<App />);
})();
