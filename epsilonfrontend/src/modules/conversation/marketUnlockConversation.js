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
      text: 'How much money we making on these limes?',
      speaker: OTHER_SPEAKER,
      advances: twoAdvance(
        'I\'m in more of a growth phase right now, actually.'
      ),
    }),
    message({
      text: 'I\'m in more of a growth phase right now, actually.',
      speaker: SELF_SPEAKER,
    }),
    message({
      text:
        'That\'s cool. Listen, I got some guys who can start right away. Been in the lime industry a couple decades, best salesmen you\'ll ever meet.',
      speaker: OTHER_SPEAKER,
      advances: [
        makeAdvance({ text: 'That sounds promising...', advanceBy: 2, }),
      ],
    }),
    message({
      text: 'That sounds promising...',
      speaker: SELF_SPEAKER,
    }),
    message({
      text:
        'Yeah and they\'re fresh out of college so they\'ll work for food. Say, 20 limes?',
      speaker: OTHER_SPEAKER,
      advances: [
        makeAdvance({
          text: 'Wait, how is that possible? With decades of experience?',
          advanceBy: 2,
        }),
      ],
    }),
    message({
      text: 'Wait, how is that possible? With decades of experience?',
      speaker: SELF_SPEAKER,
    }),
    message({
      text: 'Trade 20 limes for access to the market?',
      speaker: TUTORIAL,
      advances: [
        makeAdvance({
          text: 'I\'m gonna hold off for now, I think.',
        }),
        makeAdvance({
          text: 'Might as well.',
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
