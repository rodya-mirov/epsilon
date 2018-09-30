import { unlockFarmAction, } from '../../modules/farm';
import { Cmd, loop, } from 'redux-loop';
import { push, } from 'connected-react-router';

const message = ({ text, advance = '...', speaker, advanceBy = 1, }) => ({
  text,
  advance,
  advanceBy,
  speaker,
});

const ADVANCE_CONVERSATION = 'ADVANCE_CONVERSATION';

const START_CONVERSATION = 'START_CONVERSATION';
const MAIN_CONVERSATION_TYPE = 'MAIN_CONVERSATION_TYPE';

export const SELF_SPEAKER = 'conversation/speaker/self';
export const OTHER_SPEAKER = 'conversation/speaker/other';
export const TUTORIAL = 'conversation/speaker/tutorial';

const getConversation = conversationType => {
  switch (conversationType) {
  case MAIN_CONVERSATION_TYPE:
    return mainConversation;

  default:
    throw new Error(`Unrecoginized conversation type ${conversationType}`);
  }
};

const mainConversation = {
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
      advanceBy: 2,
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
      text: 'You have unlocked the FARM! Check it out in the nav bar.',
      speaker: TUTORIAL,
    }),
  ],
};

export const makeAdvanceConversationAction = () => ({
  type: ADVANCE_CONVERSATION,
});

export const startMainConversation = () => ({
  type: START_CONVERSATION,
  conversationType: MAIN_CONVERSATION_TYPE,
});

const notInConversation = () => ({
  inConversation: false,
  conversationType: undefined,
  conversationIndex: -1,
  messages: [],
});

const conversationAtIndex = ({ conversation, conversationIndex, }) => {
  const { messages, conversationType, } = conversation;

  if (conversationIndex >= messages.length) {
    const { endActions, } = conversation;
    const endState = notInConversation();

    if (endActions) {
      return loop(endState, Cmd.list(endActions.map(Cmd.action)));
    } else {
      return endState;
    }
  }

  return {
    inConversation: true,
    conversationType,
    conversationIndex,
    messages: messages.slice(0, conversationIndex + 1),
  };
};

const advanceConversation = state => {
  const conversation = getConversation(state.conversationType);

  const newIndex =
    state.conversationIndex +
    conversation.messages[state.conversationIndex].advanceBy;

  return conversationAtIndex({
    conversation,
    conversationIndex: newIndex,
  });
};

const startConversation = (state, conversationType) => {
  const conversation = getConversation(conversationType);

  return conversationAtIndex({
    conversation,
    conversationIndex: conversation.startIndex,
  });
};

export const initialState = notInConversation();

export default (state = initialState, action) => {
  switch (action.type) {
  case ADVANCE_CONVERSATION:
    return advanceConversation(state);

  case START_CONVERSATION:
    return startConversation(state, action.conversationType);

  default:
    return state;
  }
};
