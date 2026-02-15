import { useProcessTransactionsMutation } from "../store/api";
import { useDispatch } from "react-redux";
import { setMisses, setHabits } from "../store/HabitState";

export const useProcessTransactions = () => {
  const dispatch = useDispatch();
  const [mutation] = useProcessTransactionsMutation();

  const processTransactions = async () => {
    const result = await mutation();
    if (result.data) {
      const { filteredHabits, misses, wins } = result.data;
      console.log({ filteredHabits });
      dispatch(setHabits(filteredHabits));
      dispatch(setMisses(misses));
    } else if (result.error) {
      console.error("Habbit update failed", result.error);
    }
  };

  return {
    mutate: processTransactions,
  };
};
