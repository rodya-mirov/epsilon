import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators, } from 'redux';
import { connect, } from 'react-redux';
import classNames from 'classnames';
import {
  UNPLOWED,
  PLOWED,
  PLANTED,
  READY_FOR_HARVEST,
} from '../../modules/farm';
import { squarePropType, gridPropType, } from './propTypes';

const makeIsFarmer = (farmers, oddTick) => {
  if (oddTick) {
    return () => false;
  }
  return (row, col) =>
    farmers.some(farmer => farmer.row === row && farmer.col === col);
};

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

const PlotGrid = ({ squares, farmers, oddTick, }) => {
  const isFarmer = makeIsFarmer(farmers, oddTick);
  return (
    <div className="farm rounded border-success">
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
};

PlotGrid.propTypes = {
  squares: gridPropType,
  oddTick: PropTypes.bool,
};

const mapStateToProps = state => {
  const { farm, general, } = state;
  return {
    squares: farm.squares,
    farmers: farm.farmers,
    oddTick: general.ticks % 2 === 0,
  };
};

// no actions yet
const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlotGrid);
