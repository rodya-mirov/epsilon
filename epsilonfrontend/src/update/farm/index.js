import { reduceReducers, } from 'redux-loop';

import { updatePlot, } from './plot';
import { updateFarmers, } from './farmers';

const farmOnly = farmReducer => state => ({
  ...state,
  farm: farmReducer(state.farm),
});

const updatedSquaresReducer = farmOnly(farmState => ({
  ...farmState,
  squares: farmState.squares.map(row =>
    row.map(plot =>
      updatePlot({
        square: plot,
        stateLengths: farmState.stateLengths,
        powers: farmState.powers,
      })
    )
  ),
}));

const updateFarmersReducer = state => ({
  ...state,
  ...updateFarmers({ farm: state.farm, resources: state.resources, }),
});

export const updateFarm = state => {
  if (state.general.paused || !state.farm.isActive) {
    return state;
  }

  return reduceReducers(updatedSquaresReducer, updateFarmersReducer)(state);
};
