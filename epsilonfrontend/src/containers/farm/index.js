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
  getFarmerAction,
} from '../../modules/farm';

import './farm.css';

const farmerPropType = PropTypes.shape({
  row: PropTypes.number,
  col: PropTypes.number,
});

const squarePropType = PropTypes.shape({
  state: PropTypes.string,
});

const gridPropType = ImmutablePropTypes.listOf(
  ImmutablePropTypes.listOf(squarePropType)
);

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
    return '?';
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

      {/* TODO: remove the following, it's a placeholder to see if farmer viz is working */}
      <div className="container mt-2">
        <ul>
          {props.farmers.map((farmer, ind) => (
            <li key={ind}>
              Farmer {ind + 1} at ({farmer.col},{farmer.row}) is{' '}
              {getFarmerAction(
                props.squares.get(farmer.row).get(farmer.col).state
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

Farm.propTypes = {
  numRows: PropTypes.number,
  numCols: PropTypes.number,
  squares: gridPropType,
  farmers: ImmutablePropTypes.listOf(farmerPropType),
  oddTick: PropTypes.bool,
};

const mapStateToProps = state => {
  const { farm, } = state;
  return {
    numRows: farm.numRows,
    numCols: farm.numCols,
    squares: farm.squares,
    farmers: farm.farmers,
    oddTick: farm.oddTick,
  };
};

// currently no actions
const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Farm);
