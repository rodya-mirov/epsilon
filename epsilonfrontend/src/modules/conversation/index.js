import { Cmd, loop, } from 'redux-loop';

import mainConversation from './mainConversation';
import {
  MAIN_CONVERSATION_TYPE,
  MARKET_UNLOCK_CONVERSATION_TYPE,
} from './utils';
import { List, } from 'immutable';
import marketUnlockConversation from './marketUnlockConversation';

export { SELF_SPEAKER, TUTORIAL, OTHER_SPEAKER, } from './utils';

const ADVANCE_CONVERSATION = 'ADVANCE_CONVERSATION';

const START_CONVERSATION = 'START_CONVERSATION';

const getConversation = conversationType => {
  switch (conversationType) {
  case MAIN_CONVERSATION_TYPE:
    return mainConversation;

  case MARKET_UNLOCK_CONVERSATION_TYPE:
    return marketUnlockConversation;

  default:
    throw new Error(`Unrecoginized conversation type ${conversationType}`);
  }
};

export const makeAdvanceConversationAction = (index = 0) => ({
  type: ADVANCE_CONVERSATION,
  index,
});

export const startMainConversation = () => ({
  type: START_CONVERSATION,
  conversationType: MAIN_CONVERSATION_TYPE,
});

export const startMarketUnlockConversation = () => ({
  type: START_CONVERSATION,
  conversationType: MARKET_UNLOCK_CONVERSATION_TYPE,
});

const notInConversation = () => ({
  inConversation: false,
  conversationStack: List(),
});

const endCurrentConversation = ({ conversationStack, }) => {
  const numConv = conversationStack.size - 1;
  if (numConv <= 0) {
    return notInConversation();
  }

  return {
    inConversation: true,
    conversationStack: conversationStack.pop(),
  };
};

const startConversation = ({ conversationStack, }, conversationType) => {
  const conversation = getConversation(conversationType);

  const { startIndex, } = conversation;
  const messages = conversation.messages.slice(0, startIndex + 1);

  const newConversation = {
    conversationIndex: startIndex,
    conversationType,
    messages,
  };

  const newConversationStack = conversationStack.push(newConversation);

  return {
    inConversation: true,
    conversationStack: newConversationStack,
  };
};

const advanceConversation = ({ conversationStack, }, advanceIndex) => {
  if (!conversationStack) {
    return {
      inConversation: false,
      conversationStack: [],
    };
  }

  const currentConversationPiece = conversationStack.last();
  const { conversationIndex, conversationType, } = currentConversationPiece;

  const { messages, } = getConversation(conversationType);

  const currentMessage = messages.get(conversationIndex);

  const advance = currentMessage.advances.get(advanceIndex);
  const { advanceBy, actions: advanceActions, } = advance;

  const newIndex = conversationIndex + advanceBy;
  if (newIndex >= messages.size) {
    return loop(
      endCurrentConversation({ conversationStack, }),
      Cmd.list(advanceActions.map(Cmd.action))
    );
  } else {
    const newTop = {
      conversationType: conversationType,
      conversationIndex: newIndex,
      messages: messages.slice(0, newIndex + 1),
    };

    return loop(
      {
        inConversation: true,
        conversationStack: conversationStack.pop().push(newTop),
      },
      Cmd.list(advanceActions.map(Cmd.action))
    );
  }
};

export const initialState = notInConversation();

export default (state = initialState, action) => {
  switch (action.type) {
  case ADVANCE_CONVERSATION:
    return advanceConversation(state, action.index);

  case START_CONVERSATION:
    return startConversation(state, action.conversationType);

  default:
    return state;
  }
};
