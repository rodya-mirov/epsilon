import { Cmd, loop, } from 'redux-loop';

import mainConversation from './mainConversation';
import marketConversation from './marketConversation';
import { MAIN_CONVERSATION_TYPE, MARKET_CONVERSATION_TYPE, } from './utils';

export { SELF_SPEAKER, TUTORIAL, OTHER_SPEAKER, } from './utils';

const ADVANCE_CONVERSATION = 'ADVANCE_CONVERSATION';

const START_CONVERSATION = 'START_CONVERSATION';

const getConversation = conversationType => {
  switch (conversationType) {
  case MAIN_CONVERSATION_TYPE:
    return mainConversation;

  case MARKET_CONVERSATION_TYPE:
    return marketConversation;

  default:
    throw new Error(`Unrecoginized conversation type ${conversationType}`);
  }
};

export const makeAdvanceConversationAction = () => ({
  type: ADVANCE_CONVERSATION,
});

export const startMainConversation = () => ({
  type: START_CONVERSATION,
  conversationType: MAIN_CONVERSATION_TYPE,
});

export const startMarketUnlockConversation = () => ({
  type: START_CONVERSATION,
  conversationType: MARKET_CONVERSATION_TYPE,
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
