export const processAndSetHabitsThunk = async (dispatch: AppDispatch) => {
  try {
  } catch (error) {
    console.error("Error processing habits:", error);
  }
};
/*
Can't really use a thunk here. Seems like thunks are not a thing anymore. So to do my updates, I'm going to probably need a hook that
1. Pulls the habbits
2. Processes them to see which habits have misses
3. Delete habits that have too many misses
4. propigate this list of habbits to state.
5. Propigate the changes to the DB.

The real thing we'll need to save is really just the deletes. We're parsing misses regardless, so if there is a habit with a miss we can just delete it.
*/
