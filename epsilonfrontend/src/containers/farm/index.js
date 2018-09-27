import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { bindActionCreators, } from 'redux';
import { connect, } from 'react-redux';
import classNames from 'classnames';
import {
  UNPLOWED,
  PLOWED,
  PLANTED,
  READY_FOR_HARVEST,
  hireFarmerAction,
} from '../../modules/farm';
import { farmerPropType, squarePropType, gridPropType, } from './propTypes';

import './farm.css';
import FarmerSummary from './farmerStates';

const squareToAscii = state => {
  switch (state) {
  case UNPLOWED:
    return '~';
  case PLOWED:
    return '-';
  case PLANTED:
    return 'o';
  case READY_FOR_HARVEST:
    return 't';
  default:
    throw new Error(`Unrecognized plot state ${state}`);
  }
};

const farmerAscii = () => 'f';

const Square = ({ square, isFarmer, }) => {
  const plotClass = isFarmer ? 'farmplot-farmer' : 'farmplot-' + square.state;
  return (
    <td className={classNames('farmplot', plotClass)}>
      {isFarmer ? farmerAscii() : squareToAscii(square.state)}
    </td>
  );
};

Square.propTypes = {
  square: squarePropType,
  isFarmer: PropTypes.bool,
};

const PlotGrid = ({ squares, isFarmer, }) => (
  <div className="farm rounded border">
    <table className="farm rounded">
      <tbody>
        {squares.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((square, colIndex) => (
              <Square
                square={square}
                isFarmer={isFarmer(rowIndex, colIndex)}
                key={colIndex}
              />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

PlotGrid.propTypes = {
  squares: gridPropType,
  isFarmer: PropTypes.func,
};

const makeIsFarmer = (farmers, oddTick) => {
  if (oddTick) {
    return () => false;
  }
  return (row, col) =>
    farmers.some(farmer => farmer.row === row && farmer.col === col);
};

const Farm = props => {
  return (
    <div className="container">
      <h1 className="mt-5">Farming is Repetitive</h1>

      <p>
        Welcome to your lovely {props.numCols.toString()}x
        {props.numRows.toString()} farm.
      </p>

      <PlotGrid
        squares={props.squares}
        isFarmer={makeIsFarmer(props.farmers, props.oddTick)}
      />

      <FarmerSummary farmers={props.farmers} squares={props.squares} />
      <button onClick={props.hireFarmer}>Hire Farmer</button>
    </div>
  );
};

Farm.propTypes = {
  numRows: PropTypes.number,
  numCols: PropTypes.number,
  squares: gridPropType,
  farmers: ImmutablePropTypes.listOf(farmerPropType),
  oddTick: PropTypes.bool,
  hireFarmer: PropTypes.func,
};

const mapStateToProps = state => {
  const { farm, ticks, } = state;
  return {
    numRows: farm.numRows,
    numCols: farm.numCols,
    squares: farm.squares,
    farmers: farm.farmers,
    oddTick: ticks.ticks % 2 === 0,
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      hireFarmer: () => hireFarmerAction(1),
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Farm);
