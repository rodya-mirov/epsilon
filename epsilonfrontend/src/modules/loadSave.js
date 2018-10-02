import { Cmd, loop, } from 'redux-loop';

import { fullInitialState, } from './index';
import { startMainConversation, } from './conversation';

const LOAD_SAVE = 'loadSave/loadSave';

const NEW_GAME = 'general/newGame';
const DEBUG_SAVE = 'general/debugSave';
const RICH_SAVE = 'general/richSave';

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
    progression: {
      marketUnlockStarted: true,
    },
  };
};

const makeRichSaveState = () => {
  const debug = makeDebugSaveState();
  return {
    ...debug,
    resources: {
      ...debug.resources,
      money: 10000,
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

export const loadRichSave = () => ({
  type: LOAD_SAVE,
  save: RICH_SAVE,
});

const loadSave = save => {
  switch (save) {
  case NEW_GAME:
    return loop(fullInitialState, Cmd.action(startMainConversation()));

  case DEBUG_SAVE:
    return makeDebugSaveState();

  case RICH_SAVE:
    return makeRichSaveState();

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
