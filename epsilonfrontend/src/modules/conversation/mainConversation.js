import { unlockFarmAction, } from '../../modules/farm';

import {
  message,
  OTHER_SPEAKER,
  TUTORIAL,
  SELF_SPEAKER,
  MAIN_CONVERSATION_TYPE,
} from './utils';

import { push, } from '../router';

export default {
  startIndex: 0,
  conversationType: MAIN_CONVERSATION_TYPE,
  endActions: [unlockFarmAction(), push('/farm'),],
  messages: [
    message({
      text: 'So, I\'ve been thinking about a new business opportunity.',
      advance: 'Sure',
      speaker: OTHER_SPEAKER,
      advanceBy: 2,
    }),
    message({
      text: 'Sure',
      speaker: SELF_SPEAKER,
    }),
    message({
      text: 'Have you thought about farming? Lot of money in farms these days.',
      advance: 'Not really, aren\'t they all going broke?',
      speaker: OTHER_SPEAKER,
      advanceBy: 2,
    }),
    message({
      text: 'Not really, aren\'t they all going broke?',
      speaker: SELF_SPEAKER,
    }),
    message({
      text:
        'Yeah, it\'s a huge problem. Anyway what would you want to grow? Like, hypothetically.',
      speaker: OTHER_SPEAKER,
      advanceBy: 2,
      advance:
        'I\'m not sure, I\'m not really into farming. Maybe something interesting, like peppers? Or ... pineapples?',
    }),
    message({
      text:
        'I\'m not sure, I\'m not really into farming. Maybe something interesting, like peppers? Or ... pineapples?',
      speaker: SELF_SPEAKER,
    }),
    message({
      text: 'Cool! That\'s cool. Anyway I bought you a lime farm.',
      speaker: OTHER_SPEAKER,
      advance: 'What\'s that now?',
      advanceBy: 3,
    }),
    message({
      text: 'What\'s that now?',
      speaker: SELF_SPEAKER,
    }),
    message({
      text:
        'Yeah and they\'re deep in debt, so I used your house as collateral. You\'re gonna love it!',
      speaker: OTHER_SPEAKER,
      advance: '(hang up)',
    }),
    message({
      text: 'You have unlocked the FARM!',
      advance: '(head there now)',
      speaker: TUTORIAL,
    }),
  ],
};
