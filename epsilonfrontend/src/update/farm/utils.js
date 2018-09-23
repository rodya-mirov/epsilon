import { getNextState, getStateLength, } from './plotState';

/**
 * Given a farm state, replace the square at the given coordinates with the given new square
 * @param {*} rowInd
 * @param {*} colInd
 * @param {*} newSquare
 * @param {*} farmState
 */
export const updateSquare = (rowInd, colInd, newSquare, farmState) => ({
  ...farmState,
  squares: farmState.squares.update(rowInd, row =>
    row.update(colInd, () => newSquare)
  ),
});

export const stateChange = square => {
  const nextState = getNextState(square.state);
  return {
    ...square,
    state: nextState,
    timeLeftInState: getStateLength(nextState),
  };
};
