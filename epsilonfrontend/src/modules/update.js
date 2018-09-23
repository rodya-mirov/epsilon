import { updater, } from '../update';
import { fullInitialState, } from '../modules';

// Used for the general update-loop
const UPDATE = 'UPDATE';

export const updateAction = () => ({
  type: UPDATE,
});

export default (state = fullInitialState, action) => {
  if (action.type === UPDATE) {
    return updater(state);
  } else {
    return state;
  }
};
