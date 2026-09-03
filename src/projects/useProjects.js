// ===============================================================
//  useProjects — live list of projects for React components
// ===============================================================
//  Returns { projects, loading, error }.
//
//  The store (and, with it, the Firebase SDK) is loaded with a
//  dynamic import so it stays OUT of the initial bundle — the
//  Home / About / Contact pages never download it. Only the
//  Portfolio page (and the admin dashboard) pull it in, on mount.
// ===============================================================

import { useEffect, useState } from 'react';

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    let unsub = () => {};

    import('./projectsStore')
      .then(({ subscribeProjects }) => {
        if (!alive) return;
        unsub = subscribeProjects(
          (list) => {
            if (!alive) return;
            setProjects(list);
            setLoading(false);
            setError(null);
          },
          (err) => {
            if (!alive) return;
            setError(err);
            setLoading(false);
          },
        );
      })
      .catch((err) => {
        if (!alive) return;
        setError(err);
        setLoading(false);
      });

    return () => {
      alive = false;
      if (typeof unsub === 'function') unsub();
    };
  }, []);

  return { projects, loading, error };
}
