"use client";

import { useState } from 'react';
import { signUp, signIn, signOut } from '@/utils/supabase/auth';

interface SignInButtonProps {
  isSignedIn: boolean;
  setIsSignedIn: (isSignedIn: boolean) => void;
}

export default function SignInButton({ isSignedIn, setIsSignedIn }: SignInButtonProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async () => {
    try {
      const { user, error } = await signUp(email, password);
      if (error) {
        setError(error.message);
      } else {
        console.log('User signed up:', user);
        setIsSignedIn(true);
      }
    } catch {
      setError('An unexpected error occurred');
    }
  };

  const handleSignIn = async () => {
    try {
      const { user } = await signIn(email, password);
      if (user) {
        console.log('User signed in:', user);
        setIsSignedIn(true);
      }
    } catch {
      setError('An unexpected error occurred');
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await signOut();
      if (error) {
        setError(error.message);
      } else {
        setIsSignedIn(false);
      }
    } catch {
      setError('An unexpected error occurred');
    }
  };

  return (
    <div style={{ position: 'absolute', bottom: 10, right: 10 }}>
      {isSignedIn ? (
        <button onClick={handleSignOut}>Sign Out</button>
      ) : (
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleSignIn}>Sign In</button>
          <button onClick={handleSignUp}>Sign Up</button>
        </div>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
} 