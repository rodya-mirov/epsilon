import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators, } from 'redux';
import { connect, } from 'react-redux';
import classNames from 'classnames';

import { makeAdvanceConversationAction, } from '../../modules/conversation';
import {
  SELF_SPEAKER,
  OTHER_SPEAKER,
  TUTORIAL,
} from '../../modules/conversation';

const msgPropType = PropTypes.shape({
  text: PropTypes.string,
});

const makeMessages = ({ messages, }) => messages;
const makeCssClass = ({ speaker, }) => {
  switch (speaker) {
  case SELF_SPEAKER:
    return 'self';

  case OTHER_SPEAKER:
    return 'other';

  case TUTORIAL:
    return 'tutorial';

  default:
    throw new Error(`Unrecognized speaker ${speaker}`);
  }
};

const ConversationModal = ({
  messages,
  inConversation,
  advanceConversation,
}) => {
  return inConversation ? (
    <div className="modalContainer">
      <div className="conversation rounded border">
        {messages.map((msg, msgInd) => (
          <p
            key={msgInd}
            className={classNames(
              'conversationBox',
              'rounded',
              makeCssClass(msg)
            )}
          >
            {msg.text}
          </p>
        ))}

        <button
          onClick={advanceConversation}
          className={classNames('nextMessage')}
        >
          {messages[messages.length - 1].advance}
        </button>
      </div>
    </div>
  ) : (
    ''
  );
};

ConversationModal.propTypes = {
  messages: PropTypes.arrayOf(msgPropType),
  inConversation: PropTypes.bool.isRequired,
  advanceConversation: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  const { conversation, } = state;
  return {
    messages: conversation ? makeMessages(conversation) : [],
    inConversation: conversation.inConversation,
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      advanceConversation: makeAdvanceConversationAction,
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConversationModal);
