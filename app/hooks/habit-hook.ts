import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { gethabits } from '../repositories/habit-repository';

export const useProcessTransactions = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async () => {
      // 1. retrieve from db
      const rawdata = await gethabits();

      // 2. perform logic
      const processeddata = rawdata.map(item => ({
        ...item,
        status: complexlogic(item)
      }));

      // 3. store updates back in db
      await db.runasync('update items set status = ...'); // simplified

      return processeddata;
    },
    onSuccess: (processedData) => {
      // 4. Propagate to Redux
      dispatch(setReduxItems(processedData));

      // 5. Invalidate TanStack Cache (So UI reflects DB changes)
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
    onError: (error) => {
      console.error("Workflow failed", error);
    }
  });
