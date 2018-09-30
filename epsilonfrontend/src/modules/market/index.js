import { alea, } from 'seedrandom';

import { makeInitialState, } from './initState';

/**
 * Description of the state & general actions associated to the market.
 *
 * The market is a grid with:
 * -  Your merchants with stands (really just a list of stand objects)
 * -  Random people wandering around
 *
 * Periodically a person will approach one of your merchants and either
 * sell a seed or purchase a lime (or whatever)
 */

/**
 *
 * A STAND has shape {
 *   xmin: number
 *   ymin: number
 *   xmax: number
 *   ymax: number
 *   merchant: direction
 * }
 *
 * A SQUARE has shape {
 *  type: string (one of the square types, below)
 * }
 *
 * Direction is one of [LEFT, RIGHT, TOP, BOTTOM]
 * Orientation is one of [HORIZONTAL, VERTICAL], derived from merchant direction (left/right -> vertical, top/bottom -> horizontal)
 * Customer position is on the opposite side (left <-> right, top <-> bottom)
 */

export const initialState = makeInitialState(
  // absolutely yes, I messed with this string until I liked the result
  alea('This is an rng seed for initializatio')
);

// currently no available actions
export default (state = initialState, action) => {
  switch (action.type) {
  default:
    return state;
  }
};
