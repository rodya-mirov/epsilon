import { unlockMarketAction, } from '../../modules/market';

import {
  message,
  makeAdvance,
  OTHER_SPEAKER,
  TUTORIAL,
  SELF_SPEAKER,
  MARKET_UNLOCK_CONVERSATION_TYPE,
} from './utils';

import { makeTrySpendAction, LIMES, } from '../resources';

import { push, } from '../router';
import { List, } from 'immutable';

const twoAdvance = text => [makeAdvance({ text, advanceBy: 2, }),];

export default {
  startIndex: 0,
  conversationType: MARKET_UNLOCK_CONVERSATION_TYPE,
  messages: List([
    message({
      text: 'Limes, man',
      speaker: OTHER_SPEAKER,
      advances: twoAdvance('Yeah'),
    }),
    message({
      text: 'Yeah',
      speaker: SELF_SPEAKER,
    }),
    message({
      text:
        'For 20 limes, my guys will start working for you, selling your stuff, buying your seeds...',
      speaker: OTHER_SPEAKER,
      advances: [makeAdvance({ text: 'Uh', advanceBy: 2, }),],
    }),
    message({
      text: 'Uh',
      speaker: SELF_SPEAKER,
    }),
    message({
      text: 'Trade 20 limes for access to the market?',
      speaker: TUTORIAL,
      advances: [
        makeAdvance({
          text: 'Not right now',
        }),
        makeAdvance({
          text: 'Yeah what else are they good for?',
          actions: [
            makeTrySpendAction({
              cost: { [LIMES]: 20, },
              successActions: [unlockMarketAction(), push('/market'),],
            }),
          ],
        }),
      ],
    }),
  ]),
};
