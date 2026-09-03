// ===============================================================
//  useCategories — live list of project categories
// ===============================================================
//  Returns { categories, loading, error }.
//  The store is dynamically imported so the Firebase SDK stays out
//  of the initial bundle (same approach as useProjects).
// ===============================================================

import { useEffect, useState } from 'react';
import { DEFAULT_CATEGORIES } from '../config/projectCategories';

export function useCategories() {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    let unsub = () => {};

    import('./categoriesStore')
      .then(({ subscribeCategories }) => {
        if (!alive) return;
        unsub = subscribeCategories(
          (list) => {
            if (!alive) return;
            setCategories(list.length ? list : DEFAULT_CATEGORIES);
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

  return { categories, loading, error };
}
