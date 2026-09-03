// ===============================================================
//  ADMIN AUTH — core (context object, hook, mode detection)
// ===============================================================
//  Kept separate from AuthContext.jsx so that file can export only
//  the <AuthProvider> component (React Fast Refresh friendly).
//
//  Modes (chosen automatically):
//    "firebase"     Firebase Auth email+password  (recommended, secure)
//    "passcode"     VITE_ADMIN_PASSCODE check     (local editing only)
//    "unconfigured" neither set up -> dashboard stays locked
// ===============================================================

import { createContext, useContext } from 'react';
import { isFirebaseConfigured } from '../lib/firebase';

export const PASSCODE = import.meta.env.VITE_ADMIN_PASSCODE || '';
export const SESSION_KEY = 'portfolio.admin.session';

export const AUTH_MODE = isFirebaseConfigured
  ? 'firebase'
  : PASSCODE
    ? 'passcode'
    : 'unconfigured';

export const AuthContext = createContext(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}

export function restorePasscodeSession() {
  if (AUTH_MODE !== 'passcode') return null;
  try {
    if (sessionStorage.getItem(SESSION_KEY) === 'ok') {
      return { name: 'Admin', mode: 'passcode' };
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function friendlyFirebaseError(err) {
  const code = err && err.code ? err.code : '';
  switch (code) {
    case 'auth/invalid-email':
      return 'That email address is not valid.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Try again later.';
    default:
      return 'Sign in failed. Please try again.';
  }
}
