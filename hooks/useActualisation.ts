import { useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

/** « Tirer pour actualiser » : relance les requêtes de l'écran affiché. */
export function useActualisation() {
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await queryClient.refetchQueries({ type: 'active' });
    } finally {
      setRefreshing(false);
    }
  }, [queryClient]);
  return { refreshing, onRefresh };
}
