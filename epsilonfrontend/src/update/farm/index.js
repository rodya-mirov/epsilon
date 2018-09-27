import { reduceReducers, } from 'redux-loop';

import { updatePlot, } from './plot';
import { updateFarmers, } from './farmers';

const farmOnly = farmReducer => state => ({
  ...state,
  farm: farmReducer(state.farm),
});

const updatedSquaresReducer = farmOnly(farmState => ({
  ...farmState,
  squares: farmState.squares.map(row => row.map(updatePlot)),
}));

const updateFarmersReducer = state => ({
  ...state,
  ...updateFarmers({ farm: state.farm, resources: state.resources, }),
});

export const updateFarm = reduceReducers(
  updatedSquaresReducer,
  updateFarmersReducer
);
