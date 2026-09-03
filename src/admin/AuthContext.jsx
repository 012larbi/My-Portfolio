// ===============================================================
//  ADMIN AUTH PROVIDER
// ===============================================================
//  Wraps the /admin route tree. See ./authCore.js for the context
//  object, the useAuth() hook and AUTH_MODE.
// ===============================================================

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import {
  AUTH_MODE,
  AuthContext,
  PASSCODE,
  SESSION_KEY,
  friendlyFirebaseError,
  restorePasscodeSession,
} from './authCore';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(restorePasscodeSession);
  const [ready, setReady] = useState(AUTH_MODE !== 'firebase');

  // Firebase: subscribe to auth state
  useEffect(() => {
    if (AUTH_MODE !== 'firebase') return undefined;
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u || null);
      setReady(true);
    });
    return unsub;
  }, []);

  const signIn = useCallback(async ({ email, password }) => {
    if (AUTH_MODE === 'firebase') {
      try {
        await signInWithEmailAndPassword(auth, email.trim(), password);
        return { ok: true };
      } catch (err) {
        return { ok: false, error: friendlyFirebaseError(err) };
      }
    }
    if (AUTH_MODE === 'passcode') {
      if (password && password === PASSCODE) {
        try {
          sessionStorage.setItem(SESSION_KEY, 'ok');
        } catch {
          /* ignore */
        }
        setUser({ name: 'Admin', mode: 'passcode' });
        return { ok: true };
      }
      return { ok: false, error: 'Incorrect passcode.' };
    }
    return {
      ok: false,
      error:
        'Admin is not configured. Set the Firebase env vars, or VITE_ADMIN_PASSCODE for local use.',
    };
  }, []);

  const signOutUser = useCallback(async () => {
    if (AUTH_MODE === 'firebase') {
      await signOut(auth);
    } else {
      try {
        sessionStorage.removeItem(SESSION_KEY);
      } catch {
        /* ignore */
      }
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      ready,
      isAuthed: Boolean(user),
      mode: AUTH_MODE,
      signIn,
      signOutUser,
    }),
    [user, ready, signIn, signOutUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
