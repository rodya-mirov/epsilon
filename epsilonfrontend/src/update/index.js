/**
 * Module for describing the 'update' modification of the state.
 * This is so large, affects the entire state (conceivably), and
 * so unlike the overall design of redux that it deserves its own module
 */
import { reduceReducers, } from 'redux-loop';

import { updateFarm, } from './farm';
import { updateMarket, } from './market';

import { updateGeneral, } from './general';
import { updateProgression, } from './progression';

export const updater = reduceReducers(
  updateFarm,
  updateMarket,
  updateGeneral,
  updateProgression
);
