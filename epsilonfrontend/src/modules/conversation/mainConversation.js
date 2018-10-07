import { unlockFarmAction, } from '../../modules/farm';

import {
  message,
  makeAdvance,
  OTHER_SPEAKER,
  TUTORIAL,
  SELF_SPEAKER,
  MAIN_CONVERSATION_TYPE,
} from './utils';

import { push, } from '../router';
import { List, } from 'immutable';

const twoAdvance = text => [makeAdvance({ text, advanceBy: 2, }),];

export default {
  startIndex: 0,
  conversationType: MAIN_CONVERSATION_TYPE,
  messages: List([
    message({
      text: 'So, I\'ve been thinking about a new business opportunity.',
      speaker: OTHER_SPEAKER,
      advances: twoAdvance('Sure'),
    }),
    message({
      text: 'Sure',
      speaker: SELF_SPEAKER,
    }),
    message({
      text: 'Have you thought about farming? Lot of money in farms these days.',
      speaker: OTHER_SPEAKER,
      advances: twoAdvance('Not really, aren\'t they all going broke?'),
    }),
    message({
      text: 'Not really, aren\'t they all going broke?',
      speaker: SELF_SPEAKER,
    }),
    message({
      text:
        'Yeah, it\'s a huge problem. Anyway what would you want to grow? Like, hypothetically.',
      speaker: OTHER_SPEAKER,
      advances: twoAdvance(
        'I\'m not sure, I\'m not really into farming. Maybe something interesting, like peppers? Or ... pineapples?'
      ),
    }),
    message({
      text:
        'I\'m not sure, I\'m not really into farming. Maybe something interesting, like peppers? Or ... pineapples?',
      speaker: SELF_SPEAKER,
    }),
    message({
      text: 'Cool! That\'s cool. Anyway I bought you a lime farm.',
      speaker: OTHER_SPEAKER,
      advances: [makeAdvance({ text: 'What\'s that now?', advanceBy: 2, }),],
    }),
    message({
      text: 'What\'s that now?',
      speaker: SELF_SPEAKER,
    }),
    message({
      text:
        'Yeah and they\'re deep in debt, so I used your house as collateral. You\'re gonna love it!',
      speaker: OTHER_SPEAKER,
      advances: [makeAdvance({ text: '(hang up)', }),],
    }),
    message({
      text: 'You have unlocked the FARM!',
      advances: [
        makeAdvance({
          text: '(head there now)',
          actions: [unlockFarmAction(), push('/farm'),],
        }),
      ],
      speaker: TUTORIAL,
    }),
  ]),
};
