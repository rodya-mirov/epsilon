import { push, } from 'connected-react-router';

import { unlockMarketAction, } from '../../modules/market';

import {
  message,
  OTHER_SPEAKER,
  TUTORIAL,
  SELF_SPEAKER,
  MARKET_CONVERSATION_TYPE,
} from './utils';

export default {
  startIndex: 0,
  conversationType: MARKET_CONVERSATION_TYPE,
  endActions: [unlockMarketAction(), push('/market'),],
  messages: [
    message({
      text: 'So how much money are you making off those limes?',
      advance: 'I\'m in more of a growth phase right now.',
      speaker: OTHER_SPEAKER,
      advanceBy: 2,
    }),
    message({
      text: 'I\'m in more of a growth phase, right now.',
      speaker: SELF_SPEAKER,
    }),
    message({
      text:
        'So, I got a couple of guys who want to get into limes. It\'s huge right now, of course.',
      speaker: OTHER_SPEAKER,
      advance:
        'Well, forward me some résumés and I can give them a look in a couple days.',
      advanceBy: 2,
    }),
    message({
      text:
        'Well, forward me some résumés and I can give them a look in a couple days.',
      speaker: SELF_SPEAKER,
    }),
    message({
      text:
        'That\'s a great idea, they\'ll bring them when they come to pick up your limes in a few minutes.',
      speaker: OTHER_SPEAKER,
      advanceBy: 2,
      advance:
        'I really feel like you should talk to me before you do things like this.',
    }),
    message({
      text:
        'I really feel like you should talk to me before you do things like this.',
      speaker: SELF_SPEAKER,
    }),
    message({
      text:
        'Who has the time? Speaking of which, I gave them your bank info, so they\'ll just deposit/withdraw as they go. So efficient!',
      speaker: OTHER_SPEAKER,
      advance: '(the other user has disconnected)',
    }),
    message({
      text: 'You have unlocked the MARKET. Check it out in the nav bar.',
      speaker: TUTORIAL,
    }),
  ],
};
