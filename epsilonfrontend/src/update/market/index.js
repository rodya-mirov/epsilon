import { reduceReducers, } from 'redux-loop';

import {
  getNextState,
  getStateLength,
} from '../../modules/market/merchantState';

const marketOnly = marketUpdater => state => ({
  ...state,
  market: marketUpdater(state.market),
});

const updateMerchantStand = merchantStand => {
  const { state, timeLeftInState, } = merchantStand;
  if (timeLeftInState <= 0) {
    const newState = getNextState(state);
    const newTimeLeftInState = getStateLength(newState);
    return {
      ...merchantStand,
      state: newState,
      timeLeftInState: newTimeLeftInState,
    };
  } else {
    return {
      ...merchantStand,
      timeLeftInState: merchantStand.timeLeftInState - 1,
    };
  }
};

const updateMerchants = marketOnly(marketState => ({
  ...marketState,
  merchantStands: marketState.merchantStands.map(updateMerchantStand),
}));

export const updateMarket = reduceReducers(updateMerchants);
