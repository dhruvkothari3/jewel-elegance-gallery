// Silences TypeScript in a Node/Vite workspace for Deno edge functions.
// These files are executed by Supabase (Deno), not by your local TS toolchain.

declare module 'https://esm.sh/@supabase/supabase-js@2' {
  export * from '@supabase/supabase-js';
}

// Minimal Deno globals so TS doesn't error locally
declare const Deno: {
  env: {
    get(name: string): string | undefined;
  };
  serve: (handler: (req: Request) => Promise<Response> | Response) => void;
};







