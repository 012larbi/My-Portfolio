// ===============================================================
//  useAboutContent — live About-page content
// ===============================================================
//  Returns { about, loading, error }.
//  While loading, or if the backend is unreachable, `about` stays
//  equal to ABOUT_DEFAULTS, so the public page renders unchanged.
//  Store is dynamically imported to keep Firebase out of the initial
//  bundle (same approach as useProjects / useCategories).
// ===============================================================

import { useEffect, useState } from 'react';
import { ABOUT_DEFAULTS } from './aboutDefaults';

export function useAboutContent() {
  const [about, setAbout] = useState(ABOUT_DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    let unsub = () => {};

    import('./aboutStore')
      .then(({ subscribeAbout }) => {
        if (!alive) return;
        unsub = subscribeAbout(
          (data) => {
            if (!alive) return;
            setAbout(data);
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

  return { about, loading, error };
}
