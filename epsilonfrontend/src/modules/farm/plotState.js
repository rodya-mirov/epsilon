import { Cmd, loop, } from 'redux-loop';

import { makeContainsFarmers, } from './utils';
import { harvestAction, plantedAction, } from '../resources';

export const UNPLOWED = 'UNPLOWED';
export const PLOWED = 'PLOWED';
export const PLANTED = 'PLANTED';
export const READY_FOR_HARVEST = 'READY_FOR_HARVEST';

// duration of each state (how many ticks to move it to next)
const StateLength = {
  UNPLOWED: 8,
  PLOWED: 6,
  PLANTED: 12,
  READY_FOR_HARVEST: 6,
};

// whether or not a plot requires work to advance
const RequiresWork = {
  UNPLOWED: true,
  PLOWED: true,
  PLANTED: false,
  READY_FOR_HARVEST: true,
};

// which state you move to next
const NextState = {
  UNPLOWED: PLOWED,
  PLOWED: PLANTED,
  PLANTED: READY_FOR_HARVEST,
  READY_FOR_HARVEST: UNPLOWED,
};

const maybePushFinishAction = (actions, currState) => {
  // if we just finished a harvest, trigger a harvest action
  if (currState === READY_FOR_HARVEST) {
    actions.push(harvestAction(1));
    // if we just finished a plant, trigger a planted action
  } else if (currState === PLANTED) {
    actions.push(plantedAction(1));
  }
};

const shouldUpdate = (state, containsFarmer) =>
  containsFarmer || !RequiresWork[state];

const updateSquare = (square, containsFarmer, actions) => {
  const currState = square.state;

  if (square.timeLeftInState <= 0) {
    maybePushFinishAction(actions, currState);
    const nextPlotState = NextState[currState];
    return {
      ...square,
      state: nextPlotState,
      timeLeftInState: StateLength[nextPlotState],
    };
  } else if (shouldUpdate(currState, containsFarmer)) {
    return {
      ...square,
      timeLeftInState: square.timeLeftInState - 1,
    };
  } else {
    return square;
  }
};

export const updateSquares = state => {
  const containsFarmer = makeContainsFarmers(state.farmers);
  const actions = [];
  const nextState = {
    ...state,
    squares: state.squares.map((row, rowInd) =>
      row.map((square, colInd) =>
        updateSquare(square, containsFarmer(rowInd, colInd), actions)
      )
    ),
  };

  return actions
    ? loop(nextState, Cmd.list(actions.map(Cmd.action), { sequence: true, }))
    : nextState;
};

const farmerAction = {
  UNPLOWED: 'plowing',
  PLOWED: 'planting',
  PLANTED: 'bored',
  READY_FOR_HARVEST: 'harvesting',
};

export const getFarmerAction = plotState => {
  return farmerAction[plotState];
};
