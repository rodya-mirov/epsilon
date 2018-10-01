export const message = ({ text, advance = '...', speaker, advanceBy = 1, }) => ({
  text,
  advance,
  advanceBy,
  speaker,
});

export const SELF_SPEAKER = 'conversation/speaker/self';
export const OTHER_SPEAKER = 'conversation/speaker/other';
export const TUTORIAL = 'conversation/speaker/tutorial';

export const MAIN_CONVERSATION_TYPE = 'MAIN_CONVERSATION_TYPE';
export const MARKET_CONVERSATION_TYPE = 'MARKET_CONVERSATION_TYPE';
