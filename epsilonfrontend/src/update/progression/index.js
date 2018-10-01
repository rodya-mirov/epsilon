import { reduceReducers, loop, Cmd, } from 'redux-loop';

import { startMarketUnlockConversation, } from '../../modules/conversation';

const checkForMarketUnlock = state => {
  const { conversation, progression, resources, } = state;

  if (conversation.inConversation || progression.marketUnlockStarted) {
    return state;
  }

  if (resources.seeds <= 0) {
    console.log('Seeds are empty! Send it on!');

    return loop(
      {
        ...state,
        progression: {
          ...progression,
          marketUnlockStarted: true,
        },
      },
      Cmd.action(startMarketUnlockConversation())
    );
  }

  return state;
};

export const updateProgression = reduceReducers(checkForMarketUnlock);
