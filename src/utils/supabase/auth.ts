import { supabase } from './server';
import { User, Session } from '@supabase/supabase-js';

export const signUp = async (email: string, password: string): Promise<{ user: User | null; session: Session | null; error: Error | null }> => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  const { user, session } = data;
  if (error) throw error;
  return { user, session, error };
};

export const signIn = async (email: string, password: string): Promise<{ user: User | null; session: Session | null; error: Error | null }> => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  const { user, session } = data;
  if (error) throw error;
  return { user, session, error };
};

export const signOut = async (): Promise<{ error: Error | null }> => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  return { error };
};
