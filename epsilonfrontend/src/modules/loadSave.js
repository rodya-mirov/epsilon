import { Cmd, loop, } from 'redux-loop';

import { fullInitialState, } from './index';
import { startMainConversation, } from './conversation';

const LOAD_SAVE = 'loadSave/loadSave';

const NEW_GAME = 'general/newGame';
const DEBUG_SAVE = 'general/debugSave';

const makeDebugSaveState = () => {
  const { farm, market, } = fullInitialState;
  return {
    ...fullInitialState,
    farm: {
      ...farm,
      isActive: true,
    },
    market: {
      ...market,
      isActive: true,
    },
  };
};

export const startNewGame = () => ({
  type: LOAD_SAVE,
  save: NEW_GAME,
});

export const loadDebugSave = () => ({
  type: LOAD_SAVE,
  save: DEBUG_SAVE,
});

const loadSave = save => {
  switch (save) {
  case NEW_GAME:
    return loop(fullInitialState, Cmd.action(startMainConversation()));

  case DEBUG_SAVE:
    return makeDebugSaveState();

  default:
    throw new Error(`Unrecoginized save state name ${save}`);
  }
};

const loadSaveReducer = (state, action) => {
  switch (action.type) {
  case LOAD_SAVE:
    return loadSave(action.save);

  default:
    return state;
  }
};

export default loadSaveReducer;
