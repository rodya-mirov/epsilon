import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { bindActionCreators, } from 'redux';
import { connect, } from 'react-redux';
import classNames from 'classnames';

import { makeAdvanceConversationAction, } from '../../modules/conversation';
import {
  SELF_SPEAKER,
  OTHER_SPEAKER,
  TUTORIAL,
} from '../../modules/conversation';

import { List, } from 'immutable';
import { Optional, } from '../../utils/optional';

const msgPropType = PropTypes.shape({
  text: PropTypes.string,
});

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

        <div className="row">
          {messages.last().advances.map((advance, ind) => (
            <div className="col" key={ind}>
              <button
                onClick={() => advanceConversation(ind)}
                className={classNames('nextMessage')}
                key={ind}
              >
                {advance.text}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  ) : (
    ''
  );
};

ConversationModal.propTypes = {
  messages: ImmutablePropTypes.listOf(msgPropType),
  inConversation: PropTypes.bool.isRequired,
  advanceConversation: PropTypes.func.isRequired,
};

const getMessages = conversation => {
  return Optional.of(conversation)
    .filter(c => c.inConversation)
    .map(c => c.conversationStack.last().messages)
    .orElse(List());
};

const mapStateToProps = ({ conversation, }) => {
  return {
    messages: conversation ? getMessages(conversation) : [],
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
