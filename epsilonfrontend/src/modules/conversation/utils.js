import { List, } from 'immutable';

export const makeAdvance = ({ text = '...', advanceBy = 1, actions = [], }) => ({
  text,
  advanceBy,
  actions,
});

const defaultAdvances = [makeAdvance({}),];

export const message = ({ text, speaker, advances = defaultAdvances, }) => ({
  text,
  advances: List(advances),
  speaker,
});

export const SELF_SPEAKER = 'conversation/speaker/self';
export const OTHER_SPEAKER = 'conversation/speaker/other';
export const TUTORIAL = 'conversation/speaker/tutorial';

export const MAIN_CONVERSATION_TYPE = 'MAIN_CONVERSATION_TYPE';
export const MARKET_UNLOCK_CONVERSATION_TYPE = 'conversation/type/marketUnlock';
